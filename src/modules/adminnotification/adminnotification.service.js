    import { AdminNotificationRepository } from "./adminnotification.repository.js";

export const getAdminNotifications = async () => {
  try {
    const today = new Date();

    // =========================
    // Mentor Birthday
    // =========================

    const mentors =
      await AdminNotificationRepository.getBirthdayMentors();

    const mentorNotifications = mentors
      .filter((mentor) => {
        const dob = new Date(mentor.dateof_birth);

        return (
          dob.getDate() === today.getDate() &&
          dob.getMonth() === today.getMonth()
        );
      })
      .map((mentor) => ({
        type: "mentor_birthday",
        title: "Mentor Birthday 🎂",
        message: `${mentor.name} birthday is today`,
        mentorId: mentor.id,
      }));

    // =========================
    // Entrance Exam Expired
    // =========================

    const exams =
      await AdminNotificationRepository.getExpiredEntranceExams();

    const examNotifications = exams.map(
      (exam) => ({
        type: "exam_expired",
        title: "Entrance Exam Closed",
        message: `${exam.examname} registration deadline has ended`,
        examId: exam.id,
      })
    );

    return {
      success: true,
      count:
        mentorNotifications.length +
        examNotifications.length,
      data: [
        ...mentorNotifications,
        ...examNotifications,
      ],
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};