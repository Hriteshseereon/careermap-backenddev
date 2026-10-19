import bcrypt from "bcryptjs";
import crypto from "crypto"
import {
  InstituteStudentRepository,
} from "./instituteStudent.repository.js";

import { sendStudentCredentials } from "../../utils/sendStudentCredentials.js";
// CREATE
export const createStudent = async (body) => {
  try {

    const generatedPassword =
      crypto
        .randomBytes(4)
        .toString("hex");

    const institute =
      await InstituteStudentRepository.getInstitute(
        body.instituteId
      );

    if (!institute) {
      return {
        success: false,
        message: "Institute not found",
      };
    }

    if (!institute.student_allow) {
      return {
        success: false,
        message:
          "Student creation disabled for this institute",
      };
    }

    const usersCount = institute._count?.users ?? institute.users?.length ?? 0;
    if (usersCount >= institute.limit) {
      return {
        success: false,
        message: "Institute student limit exceeded",
      };
    }

    const existing = await InstituteStudentRepository.findByEmail(body.email);

    if (existing) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const student = await InstituteStudentRepository.createStudent({
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      password: hashedPassword,
      mobile: body.mobile,
      country: body.country,
      state: body.state,
      city: body.city,
      district: body.district,
      gender: body.gender,
      address: body.address,
      dataOfBirth: body.dataOfBirth ? new Date(body.dataOfBirth) : null,
      image: body.image,
      instituteId: Number(body.instituteId),
      isInstituteStudent: true,
      status: body.status || "active",
    });

    // Send credentials email in background (non-blocking for fast UI response)
    sendStudentCredentials(
      student.email,
      student.firstName,
      generatedPassword
    ).catch((emailError) => {
      console.error("❌ Email Send Error:", emailError.message);
    });

    const { password, ...studentData } = student;

    return {
      success: true,
      message: "Student created successfully",
      data: studentData,
    };

  } catch (error) {

    console.error(
      "Create Student Error:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Failed to create student",
    };
  }
};


// GET ALL
export const getStudents = async () => {

  const data =
    await InstituteStudentRepository.getAllStudents();

  return {
    success: true,
    data,
  };
};


// GET BY INSTITUTE
export const getStudentsByInstitute =
async (instituteId) => {

  const data =
    await InstituteStudentRepository.getStudentsByInstitute(
      instituteId
    );

  return {
    success: true,
    data,
  };
};


// GET BY ID
export const getStudentById =
async (id) => {

  const data =
    await InstituteStudentRepository.getStudentById(
      id
    );

  if (!data) {
    return {
      success: false,
      message:
        "Student not found",
    };
  }

  return {
    success: true,
    data,
  };
};


// UPDATE
export const updateStudent = async (
  id,
  body
) => {

  const student =
    await InstituteStudentRepository.getStudentById(
      id
    );

  if (!student) {
    return {
      success: false,
      message: "Student not found",
    };
  }

  const updateData = {
    ...body,
  };

  if (body.dataOfBirth) {
    updateData.dataOfBirth =
      new Date(body.dataOfBirth);
  }

  if (body.instituteId) {
    updateData.instituteId =
      Number(body.instituteId);
  }

  // Security
  delete updateData.password;
  delete updateData.isInstituteStudent;
  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  const updated =
    await InstituteStudentRepository.updateStudent(
      id,
      updateData
    );

  const { password, ...studentData } =
    updated;

  return {
    success: true,
    message: "Student updated successfully",
    data: studentData,
  };
};


// DELETE
export const deleteStudent =
async (id) => {

  const student =
    await InstituteStudentRepository.getStudentById(
      id
    );

  if (!student) {
    return {
      success: false,
      message:
        "Student not found",
    };
  }

  await InstituteStudentRepository.deleteStudent(
    id
  );

  return {
    success: true,
    message:
      "Student deleted successfully",
  };
};

export const bulkCreateStudents =
async (
  students,
  instituteId
) => {

  const success = [];
  const failed = [];

  for (const student of students) {

    try {

      const existing =
        await InstituteStudentRepository.findByEmail(
          student.Email
        );

      if (existing) {

        failed.push({
          email: student.Email,
          reason:
            "Email already exists",
        });

        continue;
      }

      const password =
        crypto
          .randomBytes(4)
          .toString("hex");

      const hashedPassword = await bcrypt.hash(password, 10);

      const created = await InstituteStudentRepository.createStudent({
        firstName: student["First Name"],
        lastName: student["Last Name"],
        username: student["Username"],
        email: student["Email"],
        mobile: String(student["Mobile"]),
        gender: student["Gender"],
        country: student["Country"],
        state: student["State"],
        city: student["City"],
        district: student["District"],
        address: student["Address"],
        dataOfBirth: student["DOB"] ? new Date(student["DOB"]) : null,
        password: hashedPassword,
        instituteId: Number(instituteId),
        isInstituteStudent: true,
      });

      success.push(created);

      // Send email asynchronously in background so bulk creation doesn't hang
      sendStudentCredentials(
        created.email,
        created.firstName,
        password
      ).catch((err) => {
        console.error(`❌ Background Email Error for ${created.email}:`, err.message);
      });

    } catch (error) {

      failed.push({
        email:
          student.Email,
        reason:
          error.message,
      });

    }
  }

  return {
    success: true,
    total:
      students.length,
    created:
      success.length,
    failed:
      failed.length,
    failedRecords:
      failed,
  };
};