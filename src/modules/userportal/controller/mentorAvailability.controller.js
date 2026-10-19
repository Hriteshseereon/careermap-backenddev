import { getMentorAvailability } from "../services/mentorAvailability.service.js";

export const getMentorAvailabilityController = async (req, res) => {
  try {
    const mentorId = req.params.id;

    const result = await getMentorAvailability(mentorId);

    return res
      .status(result.success ? 200 : 400)
      .json(result);

  } catch (error) {
    console.error("❌ Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};