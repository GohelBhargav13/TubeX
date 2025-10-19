export const uploadVideo = (req,res) => {
    console.log(req.file);
    if(req.file){
        res.status(200).json({ success:true, message:"video uploaded Successfully" })
    }else {
        res.status(500).json({success:false, message:"Internal Error in video Uploading" })
    }
}