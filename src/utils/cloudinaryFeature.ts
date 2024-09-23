import {v2 as cloudinary} from "cloudinary";
import { v4 as uuid } from "uuid";
import getBase64 from "../lib/helper";


const uploadFilesToCloudinary = async (files=[]) => {
    // Upload files to Cloudinary
    const uploadPromises = files.map(async (file) => {
        // Wait for getBase64 to resolve before creating the Promise
        const base64Data = await getBase64(file);
    
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                base64Data,
                {
                    resource_type: "auto",
                    public_id: uuid(),
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    });

    try {
        const results = await Promise.all(uploadPromises);

        const formattedResults = results.map((result:any) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        return formattedResults;
    } catch (error) {
        throw new Error(`Error uploading files to cloudinary, ${error}`);
    }

}