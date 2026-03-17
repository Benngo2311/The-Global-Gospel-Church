import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";
import { promisify } from "util";

const lookup = promisify(dns.lookup);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json());

  // Database setup
  const db = new Database("church.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS prayers (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      author TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      prayedCount INTEGER DEFAULT 0,
      timestamp INTEGER NOT NULL
    )
  `);

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Helper to create transporter
  const getTransporter = async () => {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    console.log(`SMTP Config: Host=${smtpHost}, Port=${smtpPort}, Secure=${smtpSecure}, User=${process.env.SMTP_USER}`);
    
    try {
      const dnsResult = await lookup(smtpHost, { family: 4 });
      console.log(`DNS Lookup: ${smtpHost} -> ${dnsResult.address}`);
    } catch (dnsErr) {
      console.warn(`DNS Lookup Failed for ${smtpHost}:`, dnsErr);
    }
    
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS?.replace(/\s/g, ""),
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      family: 4,
      logger: true,
      debug: true,
      tls: {
        rejectUnauthorized: false
      }
    } as any);
  };

  // Helper to send email (supports Resend API or Nodemailer SMTP)
  const sendEmail = async (options: { from: string, to: string, subject: string, text: string, html: string }) => {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    
    // If using Resend, use their API (HTTP) instead of SMTP to bypass port blocking
    if (smtpHost.includes('resend.com') && process.env.SMTP_PASS?.startsWith('re_')) {
      console.log("Using Resend API (HTTP) for delivery...");
      const resend = new Resend(process.env.SMTP_PASS.replace(/\s/g, ""));
      const { data, error } = await resend.emails.send({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      if (error) {
        throw new Error(`Resend API Error: ${error.message}`);
      }
      return data;
    }

    // Fallback to Nodemailer SMTP
    const transporter = await getTransporter();
    return await transporter.sendMail(options);
  };

  // Test route for SMTP / API
  app.get("/api/test-email", async (req, res) => {
    console.log("--- EMAIL TEST START ---");
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    
    try {
      if (smtpHost.includes('resend.com')) {
        console.log("Testing Resend API...");
        const result = await sendEmail({
          from: process.env.SMTP_FROM || "onboarding@resend.dev",
          to: "thegospelpower777@gmail.com",
          subject: "Test Email from TGGPC",
          text: "This is a test email to verify the connection.",
          html: "<p>This is a test email to verify the connection.</p>"
        });
        res.json({ success: true, message: "Resend API test successful", result });
      } else {
        const transporter = await getTransporter();
        await transporter.verify();
        res.json({ success: true, message: "SMTP connection verified successfully" });
      }
    } catch (error: any) {
      console.error("EMAIL TEST FAILED:", error);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      console.log("--- EMAIL TEST END ---");
    }
  });

  // API route for giving form
  app.post("/api/give", async (req, res) => {
    const { name, email, phone, amount, message } = req.body;

    if (!name || !email || !phone || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fromAddress = process.env.SMTP_FROM || `"Church Giving" <${process.env.SMTP_USER}>`;
    const mailOptions = {
      from: fromAddress,
      to: "thegospelpower777@gmail.com",
      subject: "Tithes & Offerings",
      text: `
New Tithes & Offerings Submission:

Name: ${name}
Email: ${email}
Phone: ${phone}
Amount: $${amount}
Message/Note: ${message || "N/A"}

Submitted at: ${new Date().toLocaleString()}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #b91c1c;">Tithes & Offerings</h2>
          <hr />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Message/Note:</strong> ${message || "N/A"}</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    try {
      if (!process.env.SMTP_PASS) {
        console.warn("SMTP credentials not set. Logging form data instead:", req.body);
        return res.json({ success: true, message: "Form received (Email not sent - SMTP not configured)" });
      }

      console.log(`Attempting to send email from ${fromAddress} to thegospelpower777@gmail.com`);
      await sendEmail(mailOptions);
      console.log("Email sent successfully");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email", details: error.message });
    }
  });

  // API route for contact form
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fromAddress = process.env.SMTP_FROM || `"Church Contact" <${process.env.SMTP_USER}>`;
    const mailOptions = {
      from: fromAddress,
      to: "thegospelpower777@gmail.com",
      subject: "Message",
      text: `
New Contact Message:

Name: ${name}
Email: ${email}
Subject: ${subject || "General Inquiry"}
Message:
${message}

Submitted at: ${new Date().toLocaleString()}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #b91c1c;">Message</h2>
          <hr />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    try {
      if (!process.env.SMTP_PASS) {
        console.warn("SMTP credentials not set. Logging form data instead:", req.body);
        return res.json({ success: true, message: "Form received (Email not sent - SMTP not configured)" });
      }

      console.log(`Attempting to send contact email from ${fromAddress} to thegospelpower777@gmail.com`);
      await sendEmail(mailOptions);
      console.log("Contact email sent successfully");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email", details: error.message });
    }
  });

  // Prayer Wall Email Notification API
  app.post("/api/send-prayer-email", async (req, res) => {
    const { text, author, email, phone, timestamp } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });
    
    // Send email notification
    const fromAddress = process.env.SMTP_FROM || `"Prayer Wall" <${process.env.SMTP_USER}>`;
    const mailOptions = {
      from: fromAddress,
      to: "thegospelpower777@gmail.com",
      subject: "New Prayer Request",
      text: `
New Prayer Request Submitted:

Author: ${author || "Anonymous"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}

Prayer Request:
${text}

Submitted at: ${new Date(timestamp).toLocaleString()}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #b91c1c;">New Prayer Request</h2>
          <hr />
          <p><strong>Author:</strong> ${author || "Anonymous"}</p>
          <p><strong>Email:</strong> ${email || "N/A"}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Prayer Request:</strong></p>
          <p style="white-space: pre-wrap; font-style: italic; color: #444;">"${text}"</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Submitted at: ${new Date(timestamp).toLocaleString()}</p>
        </div>
      `,
    };

    try {
      if (process.env.SMTP_PASS) {
        console.log(`Sending prayer notification to thegospelpower777@gmail.com`);
        await sendEmail(mailOptions);
      } else {
        console.warn("SMTP not configured, skipping prayer email notification.");
      }
    } catch (error) {
      console.error("Failed to send prayer notification email:", error);
      // We don't fail the request if email fails
    }
    
    res.json({ success: true });
  });

  // Repentance Email Notification API
  app.post("/api/send-repentance-email", async (req, res) => {
    const { text, author, email, phone, timestamp } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });
    
    // Send email notification
    const fromAddress = process.env.SMTP_FROM || `"Repenting Corner" <${process.env.SMTP_USER}>`;
    const mailOptions = {
      from: fromAddress,
      to: "thegospelpower777@gmail.com",
      subject: "New Repentance Confession",
      text: `
New Repentance Confession Submitted:

Author: ${author || "Anonymous"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}

Confession:
${text}

Submitted at: ${new Date(timestamp).toLocaleString()}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #059669;">New Repentance Confession</h2>
          <hr />
          <p><strong>Author:</strong> ${author || "Anonymous"}</p>
          <p><strong>Email:</strong> ${email || "N/A"}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Confession:</strong></p>
          <p style="white-space: pre-wrap; font-style: italic; color: #444;">"${text}"</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Submitted at: ${new Date(timestamp).toLocaleString()}</p>
        </div>
      `,
    };

    try {
      if (process.env.SMTP_PASS) {
        console.log(`Sending repentance notification to thegospelpower777@gmail.com`);
        await sendEmail(mailOptions);
      } else {
        console.warn("SMTP not configured, skipping repentance email notification.");
      }
    } catch (error) {
      console.error("Failed to send repentance notification email:", error);
      // We don't fail the request if email fails
    }
    
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
