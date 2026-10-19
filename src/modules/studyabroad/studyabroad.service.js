import { StudyAbroadRepository,StudyAbroadConsultRepository } from "./studyabroad.repository.js";

// 🔹 CREATE
export const createStudyAbroad = async (body) => {
  try {
    const data = await StudyAbroadRepository.create({
      title: body.title,
      country_name: body.country_name,
      description: body.description,
      overview: body.overview,
      visa_work: body.visa_work,
      living_cost: body.living_cost,
      tution_cost: body.tution_cost,

      top_university: body.top_university || [],
      scholarship: body.scholarship || [],
      requirment: body.requirment || [],
      popular_course: body.popular_course || [],
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 GET ALL
export const getStudyAbroad = async () => {
  try {
    const data = await StudyAbroadRepository.findAll();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 GET BY ID
export const getStudyAbroadById = async (id) => {
  try {
    const data = await StudyAbroadRepository.findById(Number(id));

    if (!data) {
      return { success: false, message: "Not found" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 UPDATE
export const updateStudyAbroad = async (id, body) => {
  try {
    const updated = await StudyAbroadRepository.update(Number(id), {
      title: body.title,
      country_name: body.country_name,
      description: body.description,
      overview: body.overview,
      visa_work: body.visa_work,
      living_cost: body.living_cost,
      tution_cost: body.tution_cost,

      top_university:
        body.top_university !== undefined
          ? body.top_university
          : undefined,

      scholarship:
        body.scholarship !== undefined
          ? body.scholarship
          : undefined,

      requirment:
        body.requirment !== undefined
          ? body.requirment
          : undefined,

      popular_course:
        body.popular_course !== undefined
          ? body.popular_course
          : undefined,
    });

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 🔹 DELETE
export const deleteStudyAbroad = async (id) => {
  try {
    await StudyAbroadRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const createStudyAbroadConsult = async (userId, body) => {
  try {
    const data = await StudyAbroadConsultRepository.create({
      userId,

      // =========================
      // USER / STUDY ABROAD
      // =========================
      studyAbroadId: Number(body.studyAbroadId),

      // =========================
      // 1. STUDENT BASIC DETAILS
      // =========================
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth
        ? new Date(body.dateOfBirth)
        : null,

      gender: body.gender,
      email: body.email,
      mobileNumber: body.mobileNumber,
      whatsappNumber: body.whatsappNumber,
      currentCityState: body.currentCityState,
      countryOfCitizenship: body.countryOfCitizenship,

      // =========================
      // 2. PARENT / GUARDIAN
      // =========================
      parentGuardianName: body.parentGuardianName,
      parentRelationship: body.parentRelationship,
      parentMobileNumber: body.parentMobileNumber,
      parentEmail: body.parentEmail,
      parentOccupation: body.parentOccupation,

      primaryFundingSource:
        body.primaryFundingSource || [],

      // =========================
      // 3. ACADEMIC
      // =========================
      highestQualification:
        body.highestQualification,

      schoolCollegeUniversity:
        body.schoolCollegeUniversity,

      boardUniversity:
        body.boardUniversity,

      passingYear:
        body.passingYear,

      class10PercentageCGPA:
        body.class10PercentageCGPA,

      class12PercentageCGPA:
        body.class12PercentageCGPA,

      // =========================
      // 4. FOREIGN EDUCATION
      // =========================
      intendedStudyLevel:
        body.intendedStudyLevel,

      preferredIntake:
        body.preferredIntake,

      preferredCountries:
        body.preferredCountries || [],

      preferredCourseProgramme:
        body.preferredCourseProgramme,

      preferredSpecialization:
        body.preferredSpecialization,

      preferredUniversities:
        body.preferredUniversities,

      openToAlternativeUniversities:
        body.openToAlternativeUniversities !== undefined
          ? body.openToAlternativeUniversities === "true" ||
            body.openToAlternativeUniversities === true
          : null,

      // =========================
      // 5. ENGLISH & ENTRANCE EXAMS
      // =========================
      englishTest:
        body.englishTest,

      englishTestScoreDate:
        body.englishTestScoreDate,

      otherEntranceExams:
        body.otherEntranceExams || [],

      entranceExamScoreDate:
        body.entranceExamScoreDate,

      // =========================
      // 6. CAREER & BUDGET
      // =========================
      preferredCareerDomain:
        body.preferredCareerDomain,

      reasonToStudyAbroad:
        body.reasonToStudyAbroad,

      topPriorities:
        body.topPriorities || [],

      annualTuitionBudget:
        body.annualTuitionBudget,

      totalEducationBudget:
        body.totalEducationBudget,

      scholarshipRequired:
        body.scholarshipRequired,

      educationLoanRequired:
        body.educationLoanRequired,

      // =========================
      // 7. PASSPORT & DOCUMENTS
      // =========================
      passportStatus:
        body.passportStatus,

      passportExpiryDate:
        body.passportExpiryDate
          ? new Date(body.passportExpiryDate)
          : null,

      documentsAvailable:
        body.documentsAvailable || [],

      // =========================
      // 9. SERVICES
      // =========================
      servicesRequired:
        body.servicesRequired || [],

      // =========================
      // SYSTEM
      // =========================
      message: body.message,

      status: "pending",
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
// GET ALL
export const getStudyAbroadConsult = async () => {
  try {
    const data = await StudyAbroadConsultRepository.findAll();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// GET BY ID
export const getStudyAbroadConsultById = async (id) => {
  try {
    const data = await StudyAbroadConsultRepository.findById(Number(id));

    if (!data) {
      return {
        success: false,
        message: "Consult data not found",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// UPDATE
export const updateStudyAbroadConsult = async (id, body) => {
  try {
    const updated = await StudyAbroadConsultRepository.update(Number(id), {
      preferredCountry:
        body.preferredCountry !== undefined
          ? body.preferredCountry
          : undefined,

      courseInterest:
        body.courseInterest !== undefined
          ? body.courseInterest
          : undefined,

      budgetRange:
        body.budgetRange !== undefined
          ? body.budgetRange
          : undefined,

      preferredIntake:
        body.preferredIntake !== undefined
          ? body.preferredIntake
          : undefined,

      message:
        body.message !== undefined
          ? body.message
          : undefined,

      status:
        body.status !== undefined
          ? body.status
          : undefined,
    });

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// DELETE
export const deleteStudyAbroadConsult = async (id) => {
  try {
    await StudyAbroadConsultRepository.delete(Number(id));

    return {
      success: true,
      message: "Consult deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};