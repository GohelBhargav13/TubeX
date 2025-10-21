import express from "express"
import { upload } from "../multer-config/multer.js"
import { getVideoId, getVideos, uploadVideo } from "../controllers/video.controllers.js";

const videoRoutes = express.Router();


videoRoutes.post("/upload-videos",upload.single("video"),uploadVideo)  
videoRoutes.get("/get-videos",getVideos)
videoRoutes.get("/get-video/:videoId",getVideoId)

export default videoRoutes