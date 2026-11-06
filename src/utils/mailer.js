import dns from "dns";
import { createRequire } from "module";
import nodemailer from "nodemailer";

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

// Force IPv4 in Nodemailer's internal resolver:
// Cloud hosts (like Render) often have partial IPv6 interfaces without an internet gateway,
// causing "connect ENETUNREACH 2607:...:465" when Nodemailer randomly picks an IPv6 address.
try {
  const require = createRequire(import.meta.url);
  const shared = require("nodemailer/lib/shared");
  if (shared && shared.networkInterfaces) {
    for (const key of Object.keys(shared.networkInterfaces)) {
      shared.networkInterfaces[key] = shared.networkInterfaces[key].filter(
        (i) => i.family !== "IPv6" && i.family !== 6
      );
    }
  }
} catch (_err) {
  // Ignore fallback
}

const emailUser = (process.env.EMAIL_USER || "").trim();
const emailPass = (process.env.EMAIL_PASS || "").trim().replace(/\s+/g, "");
const resendApiKey = (process.env.RESEND_API_KEY || "").trim();

const nodemailerTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: true,
    servername: "smtp.gmail.com",
  },
});

const getBrevoApiKey = () => {
  return (process.env.BREVO_API_KEY || "").trim().replace(/['"]/g, "").replace(/\s+/g, "");
};

/**
 * 1. Sends email via Brevo (Sendinblue) HTTPS REST API
 * (Port 443 - 300 free emails/day to ANY recipient, NO domain verification needed!)
 */
export const sendViaBrevo = async ({ from, to, subject, html }) => {
  const apiKey = getBrevoApiKey();
  const senderEmail = emailUser || "it.identitygroup@gmail.com";
  const toList = Array.isArray(to)
    ? to.map((email) => ({ email: email.trim() }))
    : [{ email: String(to).trim() }];

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "CareerMap", email: senderEmail },
      to: toList,
      subject,
      htmlContent: html,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("❌ Brevo API Error:", data);
    console.error(`ℹ️ Brevo Key debug: Starts with "${apiKey.substring(0, 8)}..." | Total length: ${apiKey.length}`);
    throw new Error(data.message || JSON.stringify(data));
  }
  return data;
};

/**
 * 2. Sends email via Resend HTTPS REST API (Port 443)
 */
export const sendViaResend = async ({ from, to, subject, html }) => {
  // Use official verified domain sender
  const defaultFrom = process.env.EMAIL_FROM || "CareerMap <noreply@thecareermap.in>";
  
  let sender = from;
  // If 'from' is missing, or uses gmail/resend default, use the verified domain sender
  if (!sender || sender.includes("@gmail.com") || sender.includes("onboarding@resend.dev")) {
    sender = defaultFrom;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${(process.env.RESEND_API_KEY || "").trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("❌ Resend API Error:", data);
    throw new Error(data.message || JSON.stringify(data));
  }
  return data;
};

/**
 * Unified Mailer Transporter:
 * Priority 1: BREVO_API_KEY (Works to any recipient without domain verification!)
 * Priority 2: RESEND_API_KEY (Works with verified domain or test email)
 * Priority 3: SMTP (Localhost)
 */
const transporter = {
  sendMail: async (options) => {
    if (process.env.BREVO_API_KEY) {
      return sendViaBrevo(options);
    }
    if (process.env.RESEND_API_KEY) {
      return sendViaResend(options);
    }
    return nodemailerTransporter.sendMail(options);
  },
};

// Startup diagnostic check
if (process.env.BREVO_API_KEY) {
  console.log("✅ Mailer active using Brevo HTTPS REST API (Free 300 emails/day to any recipient)!");
} else if (process.env.RESEND_API_KEY) {
  console.log("✅ Mailer active using Resend HTTPS REST API!");
} else if (emailUser && emailPass) {
  nodemailerTransporter.verify((error) => {
    if (error) {
      console.warn("⚠️ SMTP Notice: Render Free Tier blocks outbound SMTP (ports 465/587). Error:", error.message);
      console.warn("👉 Recommendation: Add BREVO_API_KEY in Render Environment Variables to send emails for free over HTTPS!");
    } else {
      console.log(`✅ SMTP Mailer connected for: ${emailUser}`);
    }
  });
}

export default transporter;