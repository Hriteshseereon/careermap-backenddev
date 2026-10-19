import {
  uploadInstitutionExcel,
} from "./institutionImport.service.js";

export const uploadInstitutionExcelController =
  async (req, res) => {
    try {
      const result =
        await uploadInstitutionExcel(
          req.file
        );

      return res
        .status(
          result.success
            ? 202
            : 400
        )
        .json(result);
    } catch (error) {
      console.error(
        "Institution Excel Controller Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };