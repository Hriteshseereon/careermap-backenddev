import transporter from "./mailer.js";
import { escapeHtml } from "./escapeHtml.js";

/**
 * Sends psychometric assessment report link to student
 */
export const sendReportEmail = async ({
  toEmail,
  studentName,
  attemptId,
  assessmentTitle = "Career Compass Psychometric Assessment",
  hollandCode = "N/A",
  topCluster = null,
  topMatch = null,
}) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  // The route that frontend will render
  const reportUrl = `${frontendUrl}/student/assessment/report/${attemptId}`;

  const topClusterText = topCluster
    ? `${topCluster}${topMatch ? ` (${topMatch}% Match)` : ""}`
    : "Comprehensive Report Generated";

  await transporter.sendMail({
    from: `"CareerMap Compass" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🎯 Your ${assessmentTitle} Report is Ready!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 25px 15px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #4f46e5 100%); color: #ffffff; padding: 35px 25px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
          .header p { margin: 10px 0 0; opacity: 0.95; font-size: 15px; font-weight: 500; }
          .content { padding: 35px 30px; color: #334155; line-height: 1.6; }
          .welcome { font-size: 17px; margin-bottom: 15px; }
          .highlight-card { background: linear-gradient(to bottom right, #f8fafc, #f1f5f9); border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 25px 0; }
          .highlight-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
          .highlight-row:last-child { margin-bottom: 0; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 13px; }
          .badge-holland { background: #e0f2fe; color: #0369a1; }
          .badge-cluster { background: #dcfce7; color: #15803d; }
          .button-wrap { text-align: center; margin: 35px 0 25px; }
          .btn-report { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35); }
          .note { font-size: 13px; color: #64748b; text-align: center; margin-top: 25px; line-height: 1.5; }
          .footer { background: #f8fafc; padding: 22px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CareerMap Compass</h1>
            <p>Psychometric & Career Alignment Report</p>
          </div>
          <div class="content">
            <p class="welcome">Congratulations <strong>${escapeHtml(studentName || "Student")}</strong>! 🎉</p>
            <p>You have successfully completed the <strong>${escapeHtml(assessmentTitle)}</strong>. Your scores across RIASEC interests, personality traits, cognitive aptitudes, and career cluster alignment have been processed.</p>
            
            <div class="highlight-card">
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-weight: 600; font-size: 13px;">PRIMARY HOLLAND CODE:</span><br/>
                <span class="badge badge-holland" style="margin-top: 4px; font-size: 15px;">${escapeHtml(hollandCode)}</span>
              </div>
              <div>
                <span style="color: #64748b; font-weight: 600; font-size: 13px;">TOP CAREER CLUSTER MATCH:</span><br/>
                <span class="badge badge-cluster" style="margin-top: 4px; font-size: 15px;">${escapeHtml(topClusterText)}</span>
              </div>
            </div>

            <div class="button-wrap">
              <a href="${reportUrl}" class="btn-report">📊 View Interactive Full Report</a>
            </div>

            <p class="note">
              You can view your detailed graphs, learning style recommendations, and download a PDF copy anytime using this link:<br/>
              <a href="${reportUrl}" style="color: #2563eb; word-break: break-all;">${reportUrl}</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CareerMap Platform. All rights reserved.</p>
            <p>Empowering Students Towards Their Ideal Career Pathways.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};
