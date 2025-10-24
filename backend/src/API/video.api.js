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
        (userId) => userId.toString() !== userId.toString()
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
