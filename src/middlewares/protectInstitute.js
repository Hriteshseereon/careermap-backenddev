import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const protectInstitute =
async(req,res,next)=>{

  try{

    const token =
      req.headers.authorization
      ?.split(" ")[1];

    if(!token){
      return res.status(401)
      .json({
        message:"No token"
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.INSTITUTE_SECRET
      );

    if(
      decoded.type !==
      "institute"
    ){
      return res.status(401)
      .json({
        message:"Unauthorized"
      });
    }

    // Deactivated / deleted institutes lose access immediately (login refuses them too).
    const account =
      await prisma.institutes.findUnique({
        where: { id: Number(decoded.instituteId) },
        select: { status: true },
      });

    if (!account || account.status === false) {
      return res.status(401)
      .json({
        message:"Institute account is inactive. Please contact administrator."
      });
    }

    req.institute =
      decoded;

    next();

  }catch(error){

        console.log(
      "JWT ERROR =",
      error.message
    );

    return res.status(401)

    .json({
      message:"Unauthorized"
    });
  }
};