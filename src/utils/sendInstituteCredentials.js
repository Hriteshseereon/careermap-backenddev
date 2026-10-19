import transporter from "./mailer.js";
import { escapeHtml } from "./escapeHtml.js";

export const sendInstituteCredentials = async (email, name, password) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const loginUrl = `${frontendUrl}/login`;

  await transporter.sendMail({
    from: `"CareerMap" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "CareerMap - Your Institute Account Credentials",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; padding: 30px 25px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
          .content { padding: 30px 25px; color: #334155; line-height: 1.6; }
          .welcome-text { font-size: 16px; margin-bottom: 20px; }
          .credentials-box { background: #f1f5f9; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 18px 20px; margin: 24px 0; }
          .cred-row { margin: 10px 0; font-size: 14px; }
          .cred-label { font-weight: 600; color: #475569; display: inline-block; width: 110px; }
          .cred-value { font-family: 'Courier New', Courier, monospace; font-weight: 700; color: #0f172a; font-size: 15px; }
          .button-container { text-align: center; margin: 30px 0 20px; }
          .btn { background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 15px; transition: background 0.2s; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CareerMap</h1>
            <p>Institute Partner Portal</p>
          </div>
          <div class="content">
            <p class="welcome-text">Hello <strong>${escapeHtml(name)}</strong>,</p>
            <p>Your institutional administrator account has been successfully created on the CareerMap platform. You can now manage your students, view assessment progress, and access comprehensive reporting dashboards.</p>
            
            <div class="credentials-box">
              <div class="cred-row">
                <span class="cred-label">Login Portal:</span>
                <a href="${loginUrl}" style="color: #2563eb; font-weight: 600;">${loginUrl}</a>
              </div>
              <div class="cred-row">
                <span class="cred-label">Email ID:</span>
                <span class="cred-value">${escapeHtml(email)}</span>
              </div>
              <div class="cred-row">
                <span class="cred-label">Password:</span>
                <span class="cred-value">${escapeHtml(password)}</span>
              </div>
            </div>

            <div class="button-container">
              <a href="${loginUrl}" class="btn">Login to Institute Portal</a>
            </div>

            <p style="font-size: 13px; color: #64748b; margin-top: 25px;">
              ⚠️ For security purposes, please change your temporary password immediately upon your first login.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CareerMap. All rights reserved.</p>
            <p>If you did not expect this email, please contact platform support.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};
