import transporter from "./mailer.js";
import { escapeHtml } from "./escapeHtml.js";

export const sendMentorBookingMail = async (
  user,
  mentor,
  booking
) => {

  // 📩 Mail to Student
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: user.email,

    subject: "Mentor Session Confirmed | CareerMap",

    html: `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>Hello ${escapeHtml(user.firstName)},</h2>

        <p>Your mentor session has been successfully booked.</p>

        <table cellpadding="8">
          <tr>
            <td><b>Mentor</b></td>
            <td>${escapeHtml(mentor.name)}</td>
          </tr>

          <tr>
            <td><b>Date</b></td>
            <td>${new Date(
              booking.date
            ).toLocaleDateString()}</td>
          </tr>

          <tr>
            <td><b>Time</b></td>
            <td>${escapeHtml(booking.timeSlot)}</td>
          </tr>
        </table>

        <br>

        <p>
          Please join your session on time.
        </p>

        <br>

        <b>CareerMap Team</b>

      </div>
    `,
  });

  // 📩 Mail to Mentor

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: mentor.email,

    subject: "New Mentor Session Booked",

    html: `
      <div style="font-family:Arial,sans-serif;padding:20px">

        <h2>Hello ${escapeHtml(mentor.name)},</h2>

        <p>You have received a new mentoring session.</p>

        <table cellpadding="8">

          <tr>
            <td><b>Student</b></td>
            <td>${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</td>
          </tr>

          <tr>
            <td><b>Email</b></td>
            <td>${escapeHtml(user.email)}</td>
          </tr>

          <tr>
            <td><b>Mobile</b></td>
            <td>${escapeHtml(user.mobile)}</td>
          </tr>

          <tr>
            <td><b>Date</b></td>
            <td>${new Date(
              booking.date
            ).toLocaleDateString()}</td>
          </tr>

          <tr>
            <td><b>Time</b></td>
            <td>${escapeHtml(booking.timeSlot)}</td>
          </tr>

        </table>

        <br>

        <p>
          Kindly be available before the scheduled time.
        </p>

        <br>

        <b>CareerMap Team</b>

      </div>
    `,
  });

};