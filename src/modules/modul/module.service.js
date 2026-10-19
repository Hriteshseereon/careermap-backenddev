import { modulesRepository } from "./module.repository.js";
import s3 from "../../lib/s3.js";
import { uploadToS3 } from "../../lib/s3Upload.js";

export const createModule = async (body,image)=>{
    try{
        const imageurl = await uploadToS3(image,"module");
        const module = await modulesRepository.createModule({
            title: body.title,
            url:body.url,
            image:imageurl,
            btn_text:body.btn_text,
            position:body.position,
            markas_free:body.markas_free === "true" || body.markas_free === true,
             freePreview:
    body.freePreview === undefined
      ? true
      : body.freePreview === "true" || body.freePreview === true,
        })
        return {success: true, data: module  }

    }catch(err){
        console.error(err);
         return { success: false, message: err.message };
    }
}

export const getAllModule = async () => {
    try{
        const data = await modulesRepository.findAll()
        return{success:true,data}
    }catch(err){
        console.error("getmodule error",err)
        return{success:false,message:err.message}
    }
}

export const getModuleById = async (id) =>{
    try{
        const data =  await modulesRepository.findById(Number(id));
        return{success:true,data}
    }
    catch(err){
        console.error("error in get by id module ",err);
        return{success:false,message:err.message}

    }
}

export const updateModuleById = async (id,body,image) => {
    try{
        let imageUrl;
        if(image){
            imageUrl =  await uploadToS3(image,"module")
        }
        const update = await modulesRepository.update(Number(id),{
             title: body.title,
            url:body.url,
            btn_text:body.btn_text,
            position:body.position,
            markas_free:body.markas_free === "true" || body.markas_free === true,
             freePreview:
    body.freePreview === undefined
      ? true
      : body.freePreview === "true" || body.freePreview === true,
            ...(imageUrl && { image: imageUrl })
        })
          return { success: true, data: update };
    }  catch(err){
        console.error("error comes in upadate module",err);
        return{success:false,message:err.message}
    }
}

export const deleteModule =  async (id) => {
    try{
        await modulesRepository.deleteModule(Number(id));
        return{success:true,message:"deleted successfully"}
    }catch(err){
        console.error("error comes in delete module",err)
        return{success:false,message:err.message}
    }
}