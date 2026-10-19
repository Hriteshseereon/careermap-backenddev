import transporter from "./mailer.js";

export const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    await transporter.sendMail({
      from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw new Error("Failed to send email");
  }
};