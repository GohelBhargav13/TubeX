import ffmpeg from "fluent-ffmpeg";
import pathVal from "path";
import { uploadVideoToS3 } from "../utills/s3.configuration.js";
import Video from "../models/video.models.js";
import ApiResponse from "../utills/api-response.js"
import ApiError from "../utills/api-error.js"
import mongoose from "mongoose";

export const uploadVideo = async (req, res) => {

  const { videoTitle,videoDescription } = req.body;

  console.log("This is the video files : ", req.file);

  // take the path of the input video file
  const { path } = req.file;
  const output_fileName = `${pathVal.join(process.cwd(), "Output")}/${req.file.originalname.split(".")[0]}.m3u8`;
  const upload_clodinary_path = `${pathVal.join(process.cwd(), "Output")}/`;

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(path)
        .outputOptions([
          "-start_number 0",
          "-hls_time 10", // each chunk 10 sec
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

    // Function for the S3 data upload
    const url_data = await uploadVideoToS3(upload_clodinary_path);
    // Print the data
    console.log("Data From the S3 : ", url_data);

    // add details of the video in database

    // Check the data is available or not
    if(!videoTitle || !videoDescription || url_data.length === 0){
      return res.status(404).json(new ApiError(404,"Video Details Are Required"))
    }

    // Create the new document in the database
      const newVideo = await Video.create({
        videoTitle,
        videoDescription,
        videoUrl: url_data[0],
        videoOwner:new mongoose.Types.ObjectId(123456789)
      })

      if(!newVideo){
        return res.status(404).json(new ApiError(404,"Error in New Video Creation"))
      }

      console.log("New Video is : ",newVideo)

      // Sending a response of the new Video
      res.status(201).json(new ApiResponse(201,newVideo,"Video is uploaded successfully"))

  } catch (error) {
    console.log("Catch part Error : ", error);
    res.status(500).json(new ApiError(500,"Internal Server Error In Upload Video"))
  }
};

// getting all video for the home
export const getVideos = async (req,res) => {
  try {

    const videos = await Video.find().select("-__v -postdAt -updatedAt")

    if(videos.length === 0){
      return res.status(400).json(new ApiError(400,"No Videos Are Available"))
    }

    res.status(200).json(new ApiResponse(200,videos,"Videos are fetched successfully"))
    
  } catch (error) {
    console.log("Error in fetching all videos : ",error);
    res.status(500).json(new ApiError(500,"Internal Error in fetching videos"))
  }
}

// get video by ID
export const getVideoId = async(req,res) => {
  const { videoId } = req.params;
  try {

    if(!videoId){
      return res.status(404).json(new ApiError(404,"Video Id is not found"))
    }

    const video = await Video.findById(videoId)
    .select("-__v -postdAt -updatedAt")

    if(!video){
      return res.status(400).json(new ApiError(400,"Video is Not Found Yet"))
    }

    res.status(200).json(new ApiResponse(200,video,"Video is fetched Successfully"))
    
  } catch (error) {
    console.log("Error in fetch the video by ID : ",error)
    res.status(500).json(new ApiError(500,"Internal Error in fetching video by ID",err))
  }

} 
