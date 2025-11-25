// backend/src/utils/email.js
import nodemailer from "nodemailer";

/* ----------------------------------------------------
   1. MAIN TRANSPORTER (SMTP or Gmail)
-----------------------------------------------------*/
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

/* ----------------------------------------------------
   2. CORE EMAIL FUNCTION
-----------------------------------------------------*/
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        `"GreenHarvest" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("sendEmail error:", err);
    throw err;
  }
};

/* ----------------------------------------------------
   3. LOW STOCK ALERT EMAIL
-----------------------------------------------------*/
export const sendLowStockEmail = async (farmerEmailOrId, productName, qty) => {
  const to =
    typeof farmerEmailOrId === "string" && farmerEmailOrId.includes("@")
      ? farmerEmailOrId
      : process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  const subject = `Low stock alert: ${productName}`;
  const html = `
    <h2>⚠ Low Stock Warning</h2>
    <p>Product <strong>${productName}</strong> is running low.</p>
    <p>Remaining quantity: <strong>${qty}</strong></p>
    <p>Please restock soon.</p>
  `;

  return sendEmail({ to, subject, html });
};

/* ----------------------------------------------------
   4. AGENT ASSIGNMENT EMAIL
-----------------------------------------------------*/
export const sendAgentAssignedEmail = async (agentEmail, agentName) => {
  return sendEmail({
    to: agentEmail,
    subject: "New Delivery Assigned",
    text: `Hello ${agentName},

A new delivery order has been assigned to you.

Open your Delivery App to view the details.

- GreenHarvest Team`,
  });
};
