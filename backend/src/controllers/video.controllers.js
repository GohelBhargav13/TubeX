import ffmpeg from "fluent-ffmpeg";
import pathVal from "path";
import { uploadVideoToS3 } from "../utills/s3.configuration.js";

export const uploadVideo = async (req, res) => {
  console.log("This is the video files : ", req.file);

  // take the path of the input video file
  const { path } = req.file;
  const output_fileName = `${pathVal.join(process.cwd(), "Output")}/${
    req.file.originalname.split(".")[0]
  }.m3u8`;
  const upload_clodinary_path = `${pathVal.join(process.cwd(), "Output")}/`;

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(path)
        .outputOptions([
          "-start_number 0",
          "-hls_time 5", // each chunk 10 sec
          "-hls_list_size 0",
          "-f hls",
        ])
        .output(output_fileName)
        .on("end", () => {
          console.log("Video is uploaded successfully");
          resolve();
        })
        .on("error", (err) => {
          console.log(err);
          reject(err);
        })
        .run();
    });

    // Function for the clodinary data upload
    const url_data = await uploadVideoToS3(upload_clodinary_path);
    // Print the data
    console.log("Data From the cloudinary : ", url_data);

    res
      .status(200)
      .json({
        message: "Video is Converted Successfully",
        success: true,
        data: url_data,
      });
  } catch (error) {
    console.log("Catch part Error : ", error);
    res
      .status(500)
      .json({ message: "Video is not uploaded From catch", success: false });
  }
};
