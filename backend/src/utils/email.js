// backend/src/utils/email.js
import dotenv from "dotenv";
dotenv.config();   // IMPORTANT: ensure .env is loaded

import nodemailer from "nodemailer";

/* ----------------------------------------------------
   1. Create Transporter
-----------------------------------------------------*/

console.log("SMTP CONFIG LOADED:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,         // smtp.gmail.com
  port: Number(process.env.SMTP_PORT), // 587
  secure: process.env.SMTP_SECURE === "true", // false for gmail
  auth: {
    user: process.env.SMTP_USER,       // your gmail
    pass: process.env.SMTP_PASS,       // app password
  },
});

/* ----------------------------------------------------
   2. Low Stock Email Sender
-----------------------------------------------------*/
export async function sendLowStockEmail(
  farmerEmail,
  productName,
  quantity
) {
  try {
    // Validate email format
    if (!farmerEmail || typeof farmerEmail !== "string" || !farmerEmail.includes("@")) {
      console.warn("⚠ Invalid email. Using ADMIN_EMAIL fallback.");
      farmerEmail = process.env.ADMIN_EMAIL;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: farmerEmail,
      subject: `🚨 Low Stock Alert — ${productName}`,
      html: `
        <h2>⚠ Low Stock Warning</h2>
        <p>Your product <b>${productName}</b> is running low.</p>
        <p>Remaining stock: <b>${quantity}</b> units.</p>
        <p>Please restock soon.</p>
        <br>
        <p>— GreenHarvest System</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Low stock email sent successfully to ${farmerEmail}`);

  } catch (err) {
    console.error("❌ Email send error:", err.message);
  }
}
export async function sendRestockedEmail(farmerEmail, productName, quantity) {
  try {
    if (!farmerEmail || typeof farmerEmail !== "string") {
      throw new Error("Invalid farmer email");
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: farmerEmail,
      subject: `Stock Restocked: ${productName}`,
      html: `
        <h2>🔄 Restocked!</h2>
        <p>Your product <strong>${productName}</strong> has been restocked.</p>
        <p>Current quantity: <strong>${quantity}</strong></p>
        <p>You will now start receiving low-stock alerts again when needed.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📦 Restock email sent to ${farmerEmail}`);
  } catch (err) {
    console.error("Restock email send error:", err);
  }
}

