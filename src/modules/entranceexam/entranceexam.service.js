import { entranceExamRepository } from "./entranceexam.repository.js";


const PRIORITY_EXAMS = [
  "NEET-UG",
  "NEET-PG",
  "JEE Main",
  "JEE Advance",
  "NEET-SS",
  "NEST",
  "IISc IAT",
  "INI CET",
  "AIIMS Paramedical Exam",
  "JEE Main Paper 2 (B.Planning)",
  "NATA",
  "AAT",
  "GATE",
  "IIT-JAM",
  "JEST (Joint Entrance Screening Test)",
  "CUET-UG",
  "CUET PG",
  "NDA",
  "ICAR AIEEA (PG)",
  "OUAT",
  "GAT-B (DBT)",
  "CLAT",
  "IPMAT",
  "CAT",
  "NIFT (National Institute of Fashion Technology)",
  "NID DAT",
  "UCEED",
  "CEED (Common Entrance Examination for Design)",
  "NIPER JEE",
  "GPAT",
  "NCHM JEE (IHMs)",
  "CSIR‑UGC NET",
  "UGC NET/JRF",
  "CPPNET",
];

const priorityMap = new Map(
  PRIORITY_EXAMS.map((name, index) => [
    name.toLowerCase(),
    index,
  ])
);
export const createExam = async (body) => {
  try {
    const existing = await entranceExamRepository.findByExamName(body.examname);

    if (existing) {
      return {
        success: false,
        message: "Exam already exists",
      };
    }

    const data = await entranceExamRepository.create({
      moduleId: Number(body.moduleId),
      streamId: Number(body.streamId),
      categoryId: Number(body.categoryId),
      secondcategoryId: Number(body.secondcategoryId),
      subcategoryId: Number(body.subcategoryId),

      examname: body.examname,

      issuedate: body.issuedate ? new Date(body.issuedate) : null,
      lastdate: body.lastdate ? new Date(body.lastdate) : null,
      exam_date: body.exam_date ? new Date(body.exam_date) : null,

      url: body.url,
      about: body.about,
      eligibility: body.eligibility,
      mode: body.mode,
      duration: body.duration,
      total_mark: body.total_mark,
      frequncy: body.frequncy,
      exam_pattern: body.exam_pattern,

      subject: body.subject || [],
      top_institution: body.top_institution || [],
    });

    return { success: true, data };
  } catch (err) {
    if (err.code === "P2002") {
      return {
        success: false,
        message: "Exam already exists",
      };
    }
    return { success: false, message: err.message };
  }
};

export const getAllExam = async () => {
  try {
    const data = await entranceExamRepository.findAll();

    data.sort((a, b) => {
      const aPriority = priorityMap.get(
        a.examname.toLowerCase()
      );

      const bPriority = priorityMap.get(
        b.examname.toLowerCase()
      );

      // Both are priority exams
      if (
        aPriority !== undefined &&
        bPriority !== undefined
      ) {
        return aPriority - bPriority;
      }

      // Only A is priority
      if (aPriority !== undefined) {
        return -1;
      }

      // Only B is priority
      if (bPriority !== undefined) {
        return 1;
      }

      // Remaining exams → alphabetical
      return a.examname.localeCompare(
        b.examname,
        undefined,
        { sensitivity: "base" }
      );
    });

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const getExamById = async (id) => {
  try {
    const data = await entranceExamRepository.findById(Number(id));
    return data
      ? { success: true, data }
      : { success: false, message: "Not found" };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const updateExam = async (id, body) => {
  try {
    const examId = Number(id);

    // ✅ Check uniqueness ONLY if examname is being updated
    if (body.examname) {
      const existing = await entranceExamRepository.findByExamName(body.examname);

      if (existing && existing.id !== examId) {
        return {
          success: false,
          message: "Exam already exists",
        };
      }
    }

    const updated = await entranceExamRepository.update(examId, {
      moduleId: body.moduleId ? Number(body.moduleId) : undefined,
      streamId: body.streamId ? Number(body.streamId) : undefined,
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
      secondcategoryId: body.secondcategoryId
        ? Number(body.secondcategoryId)
        : undefined,
      subcategoryId: body.subcategoryId
        ? Number(body.subcategoryId)
        : undefined,

      // ✅ Only update if provided
      examname: body.examname !== undefined ? body.examname : undefined,

      issuedate:
        body.issuedate !== undefined
          ? body.issuedate
            ? new Date(body.issuedate)
            : null
          : undefined,

      lastdate:
        body.lastdate !== undefined
          ? body.lastdate
            ? new Date(body.lastdate)
            : null
          : undefined,

      exam_date:
        body.exam_date !== undefined
          ? body.exam_date
            ? new Date(body.exam_date)
            : null
          : undefined,

      url: body.url,
      about: body.about,
      eligibility: body.eligibility,
      mode: body.mode,
      duration: body.duration,
      total_mark: body.total_mark,
      frequncy: body.frequncy,
      exam_pattern: body.exam_pattern,

      subject: body.subject !== undefined ? body.subject : undefined,
      top_institution:
        body.top_institution !== undefined
          ? body.top_institution
          : undefined,
    });

    return { success: true, data: updated };

  } catch (err) {
    // ✅ Handle Prisma unique constraint (backup safety)
    if (err.code === "P2002") {
      return {
        success: false,
        message: "Exam already exists",
      };
    }

    return { success: false, message: err.message };
  }
};

export const deleteExam = async (id) => {
  try {
    await entranceExamRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (err) {
    return { success: false, message: err.message };
  }
};