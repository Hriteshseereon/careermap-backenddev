import {
  submitAssessment,
  getMyAssessment,
  getAssessmentById,
  deleteAssessment,
} from "./assessment.service.js";

export const submitAssessmentController = async (req, res) => {
  try {
    const result = await submitAssessment(req.user.id, req.body);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Submit Assessment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMyAssessmentController = async (req, res) => {
  try {
    const result = await getMyAssessment(req.user.id);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Get My Assessment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAssessmentByIdController = async (req, res) => {
  try {
    const result = await getAssessmentById(req.user.id, req.params.id);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Get Assessment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteAssessmentController = async (req, res) => {
  try {
    const result = await deleteAssessment(req.user.id, req.params.id);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete Assessment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};