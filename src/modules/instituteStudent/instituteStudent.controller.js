import {

  createStudent,
  getStudents,
  getStudentsByInstitute,
  getStudentById,
  updateStudent,
  deleteStudent,
  bulkCreateStudents,
} from "./instituteStudent.service.js";
import XLSX from "xlsx";

export const createStudentController =
async (req,res)=>{

  const result =
    await createStudent(
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


export const getStudentsController =
async(req,res)=>{

  const result =
    await getStudents();

  res.json(result);
};


export const getStudentsByInstituteController =
async(req,res)=>{

  const result =
    await getStudentsByInstitute(
      req.params.instituteId
    );

  res.json(result);
};


export const getStudentByIdController =
async(req,res)=>{

  const result =
    await getStudentById(
      req.params.id
    );

  res.json(result);
};


export const updateStudentController =
async(req,res)=>{

  const result =
    await updateStudent(
      req.params.id,
      req.body
    );

  res.json(result);
};


export const deleteStudentController =
async(req,res)=>{

  const result =
    await deleteStudent(
      req.params.id
    );

  res.json(result);
};

// ---------- Institute portal (instituteId always comes from the login token) ----------

const myInstituteId = (req) => Number(req.institute.instituteId);

export const instituteCreateStudentController = async (req, res) => {
  const result = await createStudent({
    ...req.body,
    instituteId: myInstituteId(req),
  });

  // 403 when the seat limit / permission blocks it, so the UI can show the message.
  const blocked =
    !result.success &&
    (/limit/i.test(result.message) || /disabled/i.test(result.message));

  res.status(result.success ? 201 : blocked ? 403 : 400).json(result);
};

export const instituteListStudentsController = async (req, res) => {
  res.json(await getStudentsByInstitute(myInstituteId(req)));
};

const ownedStudent = async (req, res) => {
  const found = await getStudentById(req.params.id);
  if (!found.success || found.data.instituteId !== myInstituteId(req)) {
    res.status(404).json({ success: false, message: "Student not found" });
    return null;
  }
  return found.data;
};

export const instituteUpdateStudentController = async (req, res) => {
  if (!(await ownedStudent(req, res))) return;

  const { instituteId, email, ...safeBody } = req.body;
  res.json(await updateStudent(req.params.id, safeBody));
};

export const instituteDeleteStudentController = async (req, res) => {
  if (!(await ownedStudent(req, res))) return;
  res.json(await deleteStudent(req.params.id));
};

export const instituteBulkCreateStudentsController = async (req, res) => {
  req.body = { ...req.body, instituteId: myInstituteId(req) };
  return bulkCreateStudentsController(req, res);
};

export const bulkCreateStudentsController =
async (req, res) => {

  if (!req.file?.buffer) {
    return res.status(400).json({
      success: false,
      message: "Excel file is required",
    });
  }

  // multer uses memoryStorage, so there is no req.file.path: read from the buffer.
  const workbook =
    XLSX.read(req.file.buffer, { type: "buffer" });

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const students =
    XLSX.utils.sheet_to_json(sheet);

  const result =
    await bulkCreateStudents(
      students,
      req.body.instituteId
    );

  res.status(result.success ? 200 : 403).json(result);
};