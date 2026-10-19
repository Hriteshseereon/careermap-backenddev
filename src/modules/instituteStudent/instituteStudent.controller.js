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

  res.json(result);
};