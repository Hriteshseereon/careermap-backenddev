import {

  createInstitute,
  loginInstitute,
  getInstitutes,
  getInstituteById,
  updateInstitute,
  deleteInstitute,
  getInstituteDashboard,
  getInstituteStudents,
  getInstitutePsychometricAssessments,
} from "./institute.service.js";


export const createInstituteController =
async (req,res)=>{

  const result =
    await createInstitute(
      req.body
    );

  res
    .status(
      result.success
      ? 201
      : 400
    )
    .json(result);
};


export const loginInstituteController =
async (req,res)=>{

  const result =
    await loginInstitute(
      req.body
    );

  res
    .status(
      result.success
      ? 200
      : 400
    )
    .json(result);
};


export const getInstitutesController =
async(req,res)=>{

  const result =
    await getInstitutes();

  res.json(result);
};


export const getInstituteByIdController =
async(req,res)=>{

  const result =
    await getInstituteById(
      req.params.id
    );

  res.json(result);
};


export const updateInstituteController =
async(req,res)=>{

  const result =
    await updateInstitute(
      req.params.id,
      req.body
    );

  res.json(result);
};


export const deleteInstituteController =
async(req,res)=>{

  const result =
    await deleteInstitute(
      req.params.id
    );

  res.json(result);
};


export const getInstituteDashboardController =
async (req,res)=>{

  const instituteId =
    req.institute?.instituteId || req.query.instituteId || req.params.instituteId;

  if (!instituteId) {
    return res.status(400).json({ success: false, message: "Institute ID is required" });
  }

  const result =
    await getInstituteDashboard(
      instituteId
    );

  res.json(result);
};

export const getInstituteStudentsController = async (req, res) => {
  try {
    const instituteId =
      req.institute?.instituteId || req.query.instituteId || req.params.instituteId;

    if (!instituteId) {
      return res.status(400).json({ success: false, message: "Institute ID is required" });
    }

    const result = await getInstituteStudents(instituteId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInstitutePsychometricAssessmentsController = async (req, res) => {
  try {
    const instituteId =
      req.institute?.instituteId || req.query.instituteId || req.params.instituteId;

    if (!instituteId) {
      return res.status(400).json({ success: false, message: "Institute ID is required" });
    }

    const result = await getInstitutePsychometricAssessments(instituteId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};