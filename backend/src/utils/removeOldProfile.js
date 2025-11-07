import { deleteFromCloudinary } from "./cloudinary.js";

const createRemoveOldProfileImagesFromCloudionary= () =>{
    const oldProfiles =new Set();
    const cleanupOldProfileImages=async()=>{
        for(const publicId of oldProfiles){
            const response = await deleteFromCloudinary(publicId);
            if(response)oldProfiles.delete(publicId);
        }
    };
    setInterval(cleanupOldProfileImages,24*60*60*1000);

    return {
        add:(link)=>{
            oldProfiles.add(link);
        }
    }
}

export const removeOldProfileImagesFromCloudionary = createRemoveOldProfileImagesFromCloudionary();