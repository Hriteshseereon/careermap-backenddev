import { createModule,getAllModule,getModuleById,updateModuleById,deleteModule } from "./module.service.js";

export const createmodulecontroller = async (req,res) => {
    const result = await createModule(req.body,req.file);
    res.status(result.success ? 201 : 400).json(result);
}

export const getModuleController = async (req,res) => {
    const result = await getAllModule();
    res.status(200).json(result);
}

export const getModuleByIdController = async (req,res) => {
    try{
        const {id} =  req.params;
        const result = await getModuleById(id);
        res.status(result.success ? 200 : 404).json(result);
    }catch(err){
             console.error("❌ Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
    
}

export const updateModuleController = async (req,res) => {
    const result = await updateModuleById(req.params.id,req.body,req.file);
    res.status(result.success ? 200 : 400).json(result);

}

export const deleteModuleController =  async (req,res) => {
    const result =  await deleteModule(req.params.id);
     res.status(result.success ? 200 : 400).json(result);
}