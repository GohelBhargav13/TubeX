import express from "express"
import { upload } from "../multer-config/multer.js"
import { deleteComment, deleteVideo, getVideoId, getVideos, updateVideo, uploadVideo, videoComment, videoLiked,fecthRecentVideosandUsers } from "../controllers/video.controllers.js";
import IsLoggedIn from "../middleware/auth.middleware.js";
import { checkUserRole } from "../middleware/check.middleware.js";
import {  UserRole } from "../utills/constant.js";
import { VideoCount } from "../Aggregation/User.Aggregation.js";

const videoRoutes = express.Router();


videoRoutes.post("/upload-videos",IsLoggedIn,upload.single("video"),checkUserRole([UserRole.ADMIN]),uploadVideo)  
videoRoutes.get("/get-videos",IsLoggedIn,getVideos)
videoRoutes.get("/get-video/:videoId",IsLoggedIn,getVideoId)
videoRoutes.post("/video-like/:videoId",IsLoggedIn,videoLiked)
videoRoutes.post("/video-comment/:videoId",IsLoggedIn,videoComment)
videoRoutes.delete("/video-comment-delete/:videoId",IsLoggedIn,deleteComment)
videoRoutes.delete("/delete-video/:videoId",IsLoggedIn,checkUserRole([UserRole.ADMIN]),deleteVideo)
videoRoutes.post("/update-video/:videoId",IsLoggedIn,updateVideo)
videoRoutes.get("/get-video-count",IsLoggedIn,VideoCount)
videoRoutes.get("/get-recents",IsLoggedIn,fecthRecentVideosandUsers)

export default videoRoutes