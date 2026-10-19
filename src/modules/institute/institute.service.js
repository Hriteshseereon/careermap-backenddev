import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { InstituteRepository } from "./institute.repository.js";
import { sendInstituteCredentials } from "../../utils/sendInstituteCredentials.js";

// CREATE
export const createInstitute = async (body) => {
  const existing = await InstituteRepository.findByEmail(body.email);

  if (existing) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  const rawPassword = body.password;
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const institute = await InstituteRepository.create({
    name: body.name,
    email: body.email,
    password: hashedPassword,
    contract_person: body.contract_person,
    mobile: body.mobile,
    address: body.address,
    limit: Number(body.limit) || 100,
  });

  // Send credentials email to institute in background (non-blocking for fast UI response)
  sendInstituteCredentials(
    institute.email,
    institute.name,
    rawPassword
  ).catch((emailError) => {
    console.error("❌ Institute Credentials Email Send Error:", emailError.message);
  });

  return {
    success: true,
    data: institute,
  };
};


// LOGIN
export const loginInstitute =
async (body) => {

  if (!body?.email || !body?.password) {
    return {
      success: false,
      message:
        "Email and password are required",
    };
  }

  const institute =
    await InstituteRepository.findByEmailWithPassword(
      body.email
    );

  if (!institute) {
    return {
      success: false,
      message:
        "Institute not found",
    };
  }

  const match =
    await bcrypt.compare(
      String(body.password),
      institute.password
    );

  if (!match) {
    return {
      success: false,
      message:
        "Invalid password",
    };
  }

  // Inactive (disabled by admin) institutes cannot log in.
  if (institute.status === false) {
    return {
      success: false,
      message:
        "Your institute account is inactive. Please contact administrator.",
    };
  }

  const { password: _password, ...safeInstitute } = institute;

  const token =
    jwt.sign(
      {
        instituteId:
          institute.id,

        type:
          "institute",
      },

      process.env.INSTITUTE_SECRET,

      {
        expiresIn: "1d",
      }
    );

  return {
    success: true,
    token,
    institute: safeInstitute,
  };
};


// GET ALL
export const getInstitutes =
async () => {

  const data =
    await InstituteRepository.findAll();

  return {
    success: true,
    data,
  };
};


// GET BY ID
export const getInstituteById =
async (id) => {

  const data =
    await InstituteRepository.findById(
      id
    );

  if (!data) {
    return {
      success: false,
      message:
        "Institute not found",
    };
  }

  return {
    success: true,
    data,
  };
};


// UPDATE
export const updateInstitute =
async (
  id,
  body
) => {

  const data =
    await InstituteRepository.update(
      id,
      {
        name: body.name,

        contract_person:
          body.contract_person,

        mobile:
          body.mobile,

        address:
          body.address,

        status:
          body.status,

        student_allow:
          body.student_allow,

        limit:
          Number(body.limit),
      }
    );

  return {
    success: true,
    data,
  };
};


// DELETE
export const deleteInstitute =
async (id) => {

  await InstituteRepository.delete(
    id
  );

  return {
    success: true,
    message:
      "Institute deleted successfully",
  };
};

export const getInstituteDashboard =
async (instituteId) => {

  const institute =
    await prisma.institutes.findUnique({
      where: {
        id: Number(instituteId),
      },
    });

  const students =
    await prisma.users.findMany({
      where: {
        instituteId: Number(instituteId),
      },

      include: {
        quizattempt: true,
        assessmentAttempts: {
          where: { status: "completed" },
        },
      },
    });

  const totalStudents = students.length;

  const quizAttemptedStudents = students.filter(
    (s) => s.quizattempt.length > 0
  ).length;

  const psychometricAttemptedStudents = students.filter(
    (s) => s.assessmentAttempts && s.assessmentAttempts.length > 0
  ).length;

  return {
    success: true,
    data: {
      totalStudents,
      studentLimit: institute?.limit || 100,
      availableSeats: Math.max(0, (institute?.limit || 100) - totalStudents),
      quizAttempted: quizAttemptedStudents,
      quizNotAttempted: totalStudents - quizAttemptedStudents,
      psychometricAttempted: psychometricAttemptedStudents,
      psychometricNotAttempted: totalStudents - psychometricAttemptedStudents,
    },
  };
};

// GET ALL STUDENTS OF AN INSTITUTE
export const getInstituteStudents = async (instituteId) => {
  const students = await prisma.users.findMany({
    where: {
      instituteId: Number(instituteId),
    },
    include: {
      profile: true,
      quizattempt: {
        select: {
          id: true,
          score: true,
          attemptedAt: true,
        },
      },
      assessmentAttempts: {
        where: { status: "completed" },
        include: {
          result: {
            select: {
              hollandCode: true,
              topCareerCluster: true,
              topCareerMatch: true,
            },
          },
        },
        orderBy: {
          completedAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatted = students.map((s) => {
    const { password, ...studentData } = s;
    const latestAttempt = s.assessmentAttempts?.[0] || null;

    return {
      ...studentData,
      fullName: [s.firstName, s.lastName].filter(Boolean).join(" ") || s.username,
      class: s.profile?.class || null,
      stream: s.profile?.stream || null,
      totalQuizAttempts: s.quizattempt?.length || 0,
      hasAttemptedPsychometric: (s.assessmentAttempts?.length || 0) > 0,
      latestPsychometric: latestAttempt
        ? {
            attemptId: latestAttempt.id,
            completedAt: latestAttempt.completedAt,
            hollandCode: latestAttempt.result?.hollandCode || null,
            topCareerCluster: latestAttempt.result?.topCareerCluster || null,
            topCareerMatch: latestAttempt.result?.topCareerMatch || null,
          }
        : null,
    };
  });

  return {
    success: true,
    total: formatted.length,
    data: formatted,
  };
};

// GET ALL PSYCHOMETRIC EXAM ATTEMPTS/RESULTS FOR AN INSTITUTE
export const getInstitutePsychometricAssessments = async (instituteId) => {
  const attempts = await prisma.assessmentAttempt.findMany({
    where: {
      user: {
        instituteId: Number(instituteId),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          mobile: true,
          gender: true,
          profile: {
            select: {
              class: true,
              stream: true,
            },
          },
        },
      },
      assessment: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      result: {
        select: {
          id: true,
          hollandCode: true,
          topCareerCluster: true,
          topCareerMatch: true,
          top5Clusters: true,
          scores: true,
        },
      },
    },
    orderBy: {
      completedAt: "desc",
    },
  });

  const formatted = attempts.map((att) => ({
    attemptId: att.id,
    assessmentId: att.assessmentId,
    assessmentTitle: att.assessment?.title || "Career Compass Psychometric Assessment",
    assessmentSlug: att.assessment?.slug || null,
    status: att.status,
    completedAt: att.completedAt,
    startedAt: att.createdAt,
    student: {
      id: att.user?.id,
      name: [att.user?.firstName, att.user?.lastName].filter(Boolean).join(" ") || att.user?.username,
      email: att.user?.email,
      mobile: att.user?.mobile,
      gender: att.user?.gender,
      class: att.user?.profile?.class || null,
      stream: att.user?.profile?.stream || null,
    },
    result: att.result
      ? {
          resultId: att.result.id,
          hollandCode: att.result.hollandCode,
          topCareerCluster: att.result.topCareerCluster,
          topCareerMatch: att.result.topCareerMatch,
          top5Clusters: att.result.top5Clusters,
        }
      : null,
  }));

  return {
    success: true,
    total: formatted.length,
    completed: formatted.filter((a) => a.status === "completed").length,
    data: formatted,
  };
};