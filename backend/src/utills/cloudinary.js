import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: "dgllanar3",
  api_key: "275635841576997",
  api_secret: "rxL-uEa6bgGv-Ks-R5R85IiZJ6Q",
});

export const uploadVideoToCloudinary = async (folderPath) => {
  const pathUrl = [];
  try {
    const files = fs.readdirSync(folderPath);
    console.log("Files in folder:", files);

    for (let file of files) {
      const file_path = path.join(folderPath, file);
      console.log("Uploading file:", file_path);

      if (file.endsWith(".m3u8") || file.endsWith(".ts")) {
        if (!fs.existsSync(file_path)) {
          console.log("File does not exist:", file_path);
          continue;
        }

        const res = await cloudinary.uploader.upload(file_path, {
          resource_type: "video",
        });

        console.log(`${res.original_filename} uploaded:`, res.url);
        pathUrl.push(res.url);

        // Delete the file after successful upload
        fs.unlinkSync(file_path);
        console.log("✅ File deleted locally after upload");
      }
    }

    console.log("✅ All files uploaded successfully");
    return pathUrl;
  } catch (error) {
    console.error("Error in Cloudinary upload:", error);
    throw error;
  }
};
