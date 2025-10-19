import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    // Define the destination folder for the video store
    destination:function(req,file,cb){
        cb(null,path.join(process.cwd(),"Videos"))
    },
    // for the function to store the file on the destination folder 
    filename:function(req,file,cb){
        console.log(file);
        cb(null,`${Date.now()}_${file.originalname}`)

    }
})

export const upload = multer({ storage:storage })