import jwt from "jsonwebtoken";

export const protectStaff =
async(req,res,next)=>{

  try{

    const auth =
      req.headers.authorization;

    if(!auth){
      return res.status(401)
      .json({
        message:"No token"
      });
    }

    const token =
      auth.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.STAFF_SECRET
      );

    req.staff = decoded;

    next();

  }catch(error){

    return res.status(401)
    .json({
      message:"Unauthorized"
    });
  }
};