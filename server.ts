import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json());

  // API route for giving form
  app.post("/api/give", async (req, res) => {
    const { name, email, phone, amount, message } = req.body;

    if (!name || !email || !phone || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Use 'service: gmail' which is more reliable on cloud providers like Render
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

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

    // Use 'service: gmail' which is more reliable on cloud providers like Render
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

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
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
