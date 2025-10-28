import Userm from "../models/user.models.js";
import Video from "../models/video.models.js";
import { io } from "../Server/Server.js"

export const likeVideo = async (videoId, userId, socket) => { 
  try {
    if (!videoId || !userId) {
      socket.emit("ErrorInSocket", {
        message: "Video and UserId is not Found",
        success: false,
      });
      return;
    }

    // Find the Video Id
    const video = await Video.findById(videoId);
    if (!video) {
      socket.emit("ErrorInSocket", {
        message: "Video Is not Found",
        success: false,
      });
      return;
    }

    // Find the User Id
    const user = await Userm.findById(userId);
    if (!user) {
      socket.emit("ErrorInSocket", {
        message: "User is not found",
        success: false,
      });
      return;
    }

    // Main Logic of the video Like
    if (!video.videoLikes.includes(userId)) {
      video.videoLikes.push(userId);
      await video.save(); // Must Remember

      io.emit("VideoLikeUpdated", {
        LikeCounts: video.videoLikes.length,
        userId,
        videoId,
        message: "Video Liked",
      });
    } else {
      video.videoLikes = video.videoLikes.filter(
        (Id) => Id.toString() !== userId.toString()
      );
      await video.save(); // Must Remember

      io.emit("VideoLikeUpdated", {
        LikeCounts: video.videoLikes.length,
        userId,
        videoId,
        message: "Video DisLiked",
      });
    }
  } catch (error) {
    console.log("Error in Liking the videos : ", error);
    socket.emit("ErrorInSocket", {
      message: "Internal Error in Liking",
      success: false,
    });
    return;
  }
};

export const commentVideo = async (comment,userId,videoId,socket) => {
   try {
    if (!videoId || !userId || !comment) {
       socket.emit("ErrorInSocket", {
        message: "All Parameters are Required",
        success: false,
      });
      return;
    }

    const video = await Video.findById(videoId);

    if (!video) {
       socket.emit("ErrorInSocket", {
        message: "Video Is not Found",
        success: false,
      });
      return;
    }

    const user = await Userm.findById(userId);
    if (!user) {
       socket.emit("ErrorInSocket", {
        message: "User is not found",
        success: false,
      });
      return;
    }

    // Add the Comment of the user
    video.videoComments.push({ user:userId,comment })
    await video.save()

    const userInfo = await video.populate("videoComments.user","userFirstName userLastName user_avatar");
    // event emit for the comment on the video

    io.emit("VideoCommentUpdated", {
      New_Comment:video.videoComments[video.videoComments.length - 1],
      commentCount:video.videoComments.length,
      userId,
      videoId,
      message:"Video Commented Successfully",
      commentId:video.videoComments[video.videoComments.length - 1]._id
    })
   

  } catch (error) {
    console.log("Error in Commenting the video : ", error);
     socket.emit("ErrorInSocket", {
        message: "Error from catch part in commenting the video",
        success: false,
      });
      return;
  }
}

export const deleteComment = async (commentId,userId,videoId,socket) => {
  try {

    if(!videoId || !userId || !commentId){
     socket.emit("ErrorInSocket", { message:"Video Is Not Found" })
     return;
    }

    // Find the Video
    const video = await Video.findById(videoId);  

    if(!video){
      socket.emit("ErrorInSocket", { StatusCode:404,  message:"Video is not found" })
      return;
    }

    // Find the User
    const user = await Userm.findById(userId);

    if(!user){
      socket.emit("ErrorInSocket", { StatusCode:404,  message:"User is not found" })
      return;
    }

    // Delete the user comments
    video.videoComments = video.videoComments.filter((comment) => comment.user.toString() !== userId.toString() )
    await video.save();

    io.emit("deleteCommentUpdate",{ commentId,userId,videoID:videoId,message:"Comment Deleted Successfully",success:true, r_comments:Array.from(video.videoComments), commentCounts:video.videoComments.length })
    
  } catch (error) {
    console.log("Error in deleting Comment: ",error);
    socket.emit("ErrorInSocket", { message:"Internal Error in deleting Comment", StatusCode:500, success:false });
  }
}

export const deleteVideo = async (videoId,userData,socket) => {
   try {

    if(!videoId){
      socket.emit("ErrorInSocket", { message:"Video is not found"});
      return
    }
    // Find the video and delete
    await Video.findByIdAndDelete(videoId)

    io.emit("videoDeleted", { videoId,userData,message:"Video Deleted Successfully" })
    
  } catch (error) {
    console.log("Error while deleteing video : ",error);
    socket.emit("ErrorInSocket", { message:"Internal Error in deleting video"});
  }
}