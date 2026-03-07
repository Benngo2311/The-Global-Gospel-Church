import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
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

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Helper to create transporter
  const getTransporter = async () => {
    let ipv4 = 'smtp.gmail.com';
    try {
      const dnsResult = await lookup('smtp.gmail.com', { family: 4 });
      ipv4 = dnsResult.address;
    } catch (e) {
      console.warn("DNS IPv4 lookup failed, falling back to hostname:", e);
    }

    return nodemailer.createTransport({
      host: ipv4,
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS?.replace(/\s/g, ""),
      },
      connectionTimeout: 20000, // Increase to 20 seconds
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });
  };

  // Test route for SMTP
  app.get("/api/test-email", async (req, res) => {
    console.log("Testing SMTP connection...");
    console.log("SMTP_USER:", process.env.SMTP_USER ? "Set" : "Not Set");
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Set" : "Not Set");
    console.log("SMTP_FROM:", process.env.SMTP_FROM || "Not Set (using default)");

    let ipv4: string | undefined;
    try {
      const dnsResult = await lookup('smtp.gmail.com', { family: 4 });
      ipv4 = dnsResult.address;
      console.log("DNS Lookup (IPv4) for smtp.gmail.com:", dnsResult);
    } catch (dnsError: any) {
      console.error("DNS Lookup failed:", dnsError);
      return res.status(500).json({ success: false, error: "DNS Lookup failed: " + dnsError.message });
    }

    const transporter = nodemailer.createTransport({
      host: ipv4 || 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS?.replace(/\s/g, ""),
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });

    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
      res.json({ success: true, message: "SMTP connection verified using IP: " + ipv4 });
    } catch (error: any) {
      console.error("SMTP verification failed:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API route for giving form
  app.post("/api/give", async (req, res) => {
    const { name, email, phone, amount, message } = req.body;

    if (!name || !email || !phone || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transporter = await getTransporter();

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
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not set. Logging form data instead:", req.body);
        return res.json({ success: true, message: "Form received (Email not sent - SMTP not configured)" });
      }

      console.log(`Attempting to send email from ${fromAddress} to thegospelpower777@gmail.com`);
      await transporter.sendMail(mailOptions);
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

    const transporter = await getTransporter();

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
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not set. Logging form data instead:", req.body);
        return res.json({ success: true, message: "Form received (Email not sent - SMTP not configured)" });
      }

      console.log(`Attempting to send contact email from ${fromAddress} to thegospelpower777@gmail.com`);
      await transporter.sendMail(mailOptions);
      console.log("Contact email sent successfully");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email", details: error.message });
    }
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
