import AWS from "aws-sdk"
import path from "path"
import fs from "fs"
import "dotenv/config"

const s3 = new AWS.S3({
    accessKeyId:process.env.S3_ACCESSID || "AKIA2NK3X7XBS4RSR24T",
    secretAccessKey:process.env.S3_SECRET_ACCESSID || "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",
    region:process.env.S3_REGION || "eu-north-1"
})

export const uploadVideoToS3 = async (folderPath,videoTitle) => {
  const pathUrl = [];
  console.log(folderPath)
  if(!folderPath){
      fs.mkdirSync(folderPath,{ recursive:true })
  }
  if(!videoTitle){
      throw new Error("video title is missing");
  }
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

        // upload the data on the aws s3 bucket
        const data = await s3.upload({
            Bucket:process.env.S3_BUCKET || "hls.bhargavgohel",
            Key:`videos/${videoTitle}/${file}`,
            Body:fs.readFileSync(file_path),
            ContentType: file.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/MP2T',
            // ACL:"public-read"
        }).promise()

        console.log("The Location is : ", data.Location)

        pathUrl.push(data.Location);

        // Delete the file after successful upload
        fs.unlinkSync(file_path);
        console.log("✅ File deleted locally after upload");
      }
    }

    console.log("✅ All files uploaded successfully");
    return pathUrl;
  } catch (error) {
    console.error("Error in S3 upload:", error);
    throw error;
  }
};
