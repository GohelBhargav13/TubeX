import express from "express"
import { upload } from "../multer-config/multer.js"

const videoRoutes = express.Router();


videoRoutes.post("/upload-videos",upload.single("video"),(req,res) => {
    console.log(req.file);

    if(req.file){
        res.status(200).json({ success:true, message:"video uploaded Successfully" })
    }else {
        res.status(500).json({success:false, message:"Internal Error in video Uploading" })
    }
})  

export default videoRoutes