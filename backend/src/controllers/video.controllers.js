import ffmpeg from "fluent-ffmpeg";
import pathVal from "path";
import { uploadVideoToS3 } from "../utills/s3.configuration.js";
import Video from "../models/video.models.js";
import ApiResponse from "../utills/api-response.js";
import ApiError from "../utills/api-error.js";
import Userm from "../models/user.models.js";
import { resolveAny } from "dns";

// Upload the data and core logic is here 
export const uploadVideo = async (req, res) => {
  const { videoTitle, videoDescription } = req.body;

  console.log("This is the video files : ", req.file);
  console.log("Video details: ", req.body);

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
          "-hls_time 12", // each chunk 12 sec
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
    const url_data = await uploadVideoToS3(upload_clodinary_path,videoTitle);
    // Print the data
    console.log("Data From the S3 : ", url_data);

    // add details of the video in database

    // Check the data is available or not
    if (!videoTitle || !videoDescription || url_data.length === 0) {
      return res
        .status(404)
        .json(new ApiError(404, "Video Details Are Required"));
    }

    // Create the new document in the database
    const newVideo = await Video.create({
      videoTitle,
      videoDescription,
      videoUrl: url_data[0],
      videoOwner: req.user.id,
    });

    if (!newVideo) {
      return res
        .status(404)
        .json(new ApiError(404, "Error in New Video Creation"));
    }

    console.log("New Video is : ", newVideo);

    // Sending a response of the new Video
    res
      .status(201)
      .json(new ApiResponse(201, newVideo, "Video is uploaded successfully"));
  } catch (error) {
    console.log("Catch part Error : ", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Server Error In Upload Video"));
  }
};

// getting all video for the home
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().select("-__v -postdAt -updatedAt").populate("videoOwner","userFirstName userLastName user_avatar");

    if (videos.length === 0) {
      return res.status(400).json(new ApiError(400, "No Videos Are Available"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos are fetched successfully"));
  } catch (error) {
    console.log("Error in fetching all videos : ", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in fetching videos"));
  }
};

// get video by ID
export const getVideoId = async (req, res) => {
  const { videoId } = req.params;
  try {
    if (!videoId) {
      return res.status(404).json(new ApiError(404, "Video Id is not found"));
    }

    const video = await Video.findById(videoId).select(
      "-__v -postdAt -updatedAt"
    ).populate("videoOwner","userFirstName userLastName user_avatar");

    if (!video) {
      return res.status(400).json(new ApiError(400, "Video is Not Found Yet"));
    }

    const userInfoComments = await video.populate("videoComments.user","userFirstName userLastName user_avatar");

    res
      .status(200)
      .json(new ApiResponse(200, { video,userInfoComments }, "Video is fetched Successfully"));
  } catch (error) {
    console.log("Error in fetch the video by ID : ", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in fetching video by ID", error));
  }
};

// Like the video
export const videoLiked = async (req, res) => {
  const { videoId } = req.params;
  const { id } = req.user;
  try {
    if (!videoId || !id) {
      return res
        .status(404)
        .json(new ApiError(404, "videoId and userId is required "));
    }

    // Find the Video Id
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json(new ApiError(404, "Video Is Not Found"));
    }

    // Find the User Id
    const user = await Userm.findById(id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User Is Not Found"));
    }

    // Main Logic of the video Like
    if (!video.videoLikes.includes(id)) {
      video.videoLikes.push(id);
      await video.save() // Must Remember

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { orginalVideo: video, VideoLikes: video.videoLikes.length },
            "Video Liked"
          )
        );
    } else {
      video.videoLikes = video.videoLikes.filter((userId) => userId.toString() !== id.toString());
      await video.save() // Must Remember

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { orginalVideo: video, VideoLikes: video.videoLikes.length },
            "Video DisLiked"
          )
        );
    }
  } catch (error) {
    console.log("Error in Liking the videos : ", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Erorr in Liking the videos"));
  }
};

// Comment the video
export const videoComment = async (req, res) => {
  const { videoId } = req.params;
  const { id } = req.user;
  const { comment } = req.body;

  try {
    if (!videoId || !id || !comment) {
      return res
        .status(404)
        .json(new ApiError(404, "VideoId and Id is required"));
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json(new ApiError(404, "Video Is Not Found"));
    }

    const user = await Userm.findById(id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User is not found"));
    }

    // Add the Comment of the user
    video.videoComments.push({ user:id,comment })
    await video.save()

    // const userInfo = await video.populate("videoComments.user","userFirstName userLastName user_avatar");

    res.status(200).json(new ApiResponse(200,{ orginalVideo:video,CommentCount:video.videoComments.length },"Comment Added"))

  } catch (error) {
    console.log("Error in Commenting the video : ", error);
    res.status(500).json(new ApiError(500,"Internal Error in Commenting the video"))
  }
};

// delete Comment on Video
export const deleteComment = async (req,res) => {
  const { videoId } = req.params;
  const { id } = req.user;

  try {

    if(!videoId || !id){
      return res.status(404).json(new ApiError(404,"VideoId and Id is required"))
    }

    // Find the Video
    const video = await Video.findById(videoId);  

    if(!video){
      return res.status(404).json(new ApiError(404,"Video is not found"))
    }

    // Find the User
    const user = await Userm.findById(id);

    if(!user){
      return res.status(404).json(new ApiError(404,"User is not found"))
    }

    // Delete the user comments
    video.videoComments = video.videoComments.filter((comment) => comment.user.toString() !== id.toString() )
    await video.save();

    res.status(200).json(new ApiResponse(200,{ orginalVideo:video,CommentCount:video.videoComments.length },"Comment Deleted"))
    
  } catch (error) {
    console.log("Error in deleting Comment: ",error);
    res.status(500).json(new ApiError(500,"Internal Error in deleting Comment"))
  }

}

// delete video from platform
export const deleteVideo = async (req,res) => {
  const { videoId } = req.params;

  try {

    if(!videoId){
      return res.status(404).json(new ApiError(404,"VideoId is required"))
    }

    // Find the video and delete
    await Video.findByIdAndDelete(videoId)

    res.status(200).json(new ApiResponse(200,"Video Deleted Successfully"))
    
  } catch (error) {
    console.log("Error while deleteing video : ",error);
    res.status(500).json(new ApiError(500,"Internal Error in deleting video"))
  }

}

// update video details from platform
export const updateVideo = async (req,res) => {
  const { videoId } = req.params;
  const { videoTitle,videoDescription } = req.body;

  try {

    // check if the videoId is not found
    if(!videoId){
      return res.status(404).json(new ApiError(404,"VideoId is required"))
    }

    // check the title and description of the video
    if(!videoTitle || !videoDescription){
      return res.status(404).json(new ApiError(404,"VideoTitle and VideoDescription is required"))
    }

   const updatedvideo = await Video.findByIdAndUpdate(videoId, {
      $set:{
        videoTitle,
        videoDescription,
      }
    }, { new:true }).populate("videoOwner","userFirstName userLastName user_avatar")

    res.status(200).json(new ApiResponse(200, updatedvideo, `${updatedvideo?._id} is updated`))
    
  } catch (error) {
      console.log("Error in updating video : ", error);
      res.status(500).json(new ApiError(500,"Internal Error in updating video"))
  }

}

// fecth the recent videos and users
export const fecthRecentVideosandUsers = async (req,res) => {
  try {

      const users =  await Userm.find().sort({ createdAt:-1 }).limit(5).select("-__v -updatedAt -isVerified -userPassword -userEmail -userVideos -userLikes" )
      const videos = await Video.find().sort({ createdAt:-1 }).limit(3).populate("videoOwner","userFirstName userLastName user_avatar").select("-__v  -updatedAt -createdAt")

      // console.log("No of users are : ", users);
      // console.log("No of videos are : ", videos)
      
      res.status(200).json(new ApiResponse(200,{ users,videos }, "Data is fecthed"))
  } catch (error) {
    console.log("Erro while fetch the recent users and videos");
    return;
  }
}
