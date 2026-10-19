import * as service from "./pathtype.service.js";

export const create = async (req,res)=>{
  const result = await service.createPathType(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

export const getAll = async (req,res)=>{
  res.json(await service.getAllPathType());
};

export const getById = async (req,res)=>{
  res.json(await service.getPathTypeById(req.params.id));
};

export const update = async (req,res)=>{
  res.json(await service.updatePathType(req.params.id, req.body));
};

export const remove = async (req,res)=>{
  res.json(await service.deletePathType(req.params.id));
};