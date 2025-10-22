import express from "express"
import { upload } from "../multer-config/multer.js"
import { deleteComment, getVideoId, getVideos, uploadVideo, videoComment, videoLiked } from "../controllers/video.controllers.js";
import IsLoggedIn from "../middleware/auth.middleware.js";

const videoRoutes = express.Router();


videoRoutes.post("/upload-videos",upload.single("video"),uploadVideo)  
videoRoutes.get("/get-videos",getVideos)
videoRoutes.get("/get-video/:videoId",getVideoId)
videoRoutes.post("/video-like/:videoId",IsLoggedIn,videoLiked)
videoRoutes.post("/video-comment/:videoId",IsLoggedIn,videoComment)
videoRoutes.delete("/video-comment-delete/:videoId",IsLoggedIn,deleteComment)

export default videoRoutes