import { UserPortalRepository } from "../repository/userPortal.repository.js";

export const getMentorAvailability = async (mentorId) => {
  try {
    const availability = await UserPortalRepository.getAvailability(mentorId);
    const bookings = await UserPortalRepository.getBookings(mentorId);

    const formatted = availability.map((item) => {
      const dateStr = item.date.toISOString().split("T")[0];

      const slots = item.timeSlots.map((slot) => {
        const isBooked = bookings.some(
          (b) =>
            b.timeSlot === slot &&
            b.date.toISOString().split("T")[0] === dateStr
        );

        return {
          time: slot,
          isBooked,
        };
      });

      return {
        date: item.date,
        slots,
      };
    });

    return { success: true, data: formatted };

  } catch (error) {
    console.error("❌ getMentorAvailability Error:", error);
    return { success: false, message: error.message };
  }
};