import {
  createStaff,
  loginStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff
}
from "./staff.service.js";

export const createStaffController =
async(req,res)=>{

  try{

    const data =
      await createStaff(
        req.body
      );

    res.status(201).json({
      success:true,
      data,
    });

  }catch(error){

    res.status(400).json({
      success:false,
      message:error.message,
    });
  }
};

export const loginStaffController =
async(req,res)=>{

  try{

    const data =
      await loginStaff(
        req.body.email,
        req.body.password
      );

    res.json({
      success:true,
      ...data
    });

  }catch(error){

    res.status(400).json({
      success:false,
      message:error.message,
    });
  }
};

export const getAllStaffController =
async(req,res)=>{

  const data =
    await getAllStaff();

  res.json({
    success:true,
    data
  });
};

export const getStaffByIdController =
async(req,res)=>{

  const data =
    await getStaffById(
      req.params.id
    );

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Staff member not found",
    });
  }

  res.json({
    success:true,
    data
  });
};

export const updateStaffController =
async(req,res)=>{

  try{

    const data =
      await updateStaff(
        req.params.id,
        req.body
      );

    res.json({
      success:true,
      message:"Staff updated successfully",
      data
    });

  }catch(error){

    res.status(400).json({
      success:false,
      message:error.message,
    });
  }
};

export const deleteStaffController =
async(req,res)=>{

  try{

    await deleteStaff(
      req.params.id
    );

    res.json({
      success:true,
      message:"Deleted successfully"
    });

  }catch(error){

    res.status(400).json({
      success:false,
      message:error.message,
    });
  }
};