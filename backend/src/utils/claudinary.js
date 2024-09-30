import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilepath) => {
    try {
        if (!localFilepath) return null;

        // Upload file with resource_type set to raw for .obj files
        const response = await cloudinary.uploader.upload(localFilepath, {
            resource_type: "raw",  // Explicitly set to raw for .obj files
        });

        // Optionally log the URL or handle response
        // console.log("File has been uploaded on Cloudinary:", response.url);

        // Remove the file from local storage
        fs.unlinkSync(localFilepath);

        return response;
    } catch (error) {
        // Remove the file even in case of error
        fs.unlinkSync(localFilepath);
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary };
