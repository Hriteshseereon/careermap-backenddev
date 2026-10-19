import {
  checkModuleAccess,
  startPagePreview,
  verifyPreviewSession,
} from "./moduleAccess.service.js";

export const checkModuleAccessController = async (req, res) => {
  try {
    const result = await checkModuleAccess(req.user.id, req.body.moduleId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const startPagePreviewController = async (req, res) => {
  try {
    const { moduleId, pageType, pageId } = req.body;

    if (!moduleId || !pageType || !pageId) {
      return res.status(400).json({
        success: false,
        message: "moduleId, pageType and pageId are required",
      });
    }

    const result = await startPagePreview(req.user.id, {
      moduleId,
      pageType,
      pageId,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPreviewSessionController = async (req, res) => {
  try {
    const previewSessionId =
      req.body.previewSessionId || req.params.previewSessionId;

    if (!previewSessionId) {
      return res.status(400).json({
        success: false,
        message: "previewSessionId is required",
      });
    }

    const result = await verifyPreviewSession(
      req.user.id,
      previewSessionId
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
