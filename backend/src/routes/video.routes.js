import express from "express"
import { upload } from "../multer-config/multer.js"
import { uploadVideo } from "../controllers/video.controllers.js";

const videoRoutes = express.Router();


videoRoutes.post("/upload-videos",upload.single("video"),uploadVideo)  

export default videoRoutes