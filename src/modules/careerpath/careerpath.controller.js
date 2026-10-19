import * as service from "./careerpath.service.js";

export const create = async (req,res)=>{
  res.json(await service.createCareerPath(req.body));
};

export const getAll = async (req,res)=>{
  res.json(await service.getAllCareerPath());
};

export const getById = async (req,res)=>{
  res.json(await service.getCareerPathById(req.params.id));
};

export const update = async (req,res)=>{
  res.json(await service.updateCareerPath(req.params.id, req.body));
};

export const remove = async (req,res)=>{
  res.json(await service.deleteCareerPath(req.params.id));
};