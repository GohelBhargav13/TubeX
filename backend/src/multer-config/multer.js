import multer from "multer"
import path from "path"
import fs from "node:fs"

const storage = multer.diskStorage({

    // Define the destination folder for the video store
    destination:function(req,file,cb){
        const dir = path.join(process.cwd(), 'uploads/videos');
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir,{ recursive:true })
        }
        // console.log("Multer upload directory:", dir);
        this.destination = dir
        cb(null,dir)
    },
    // for the function to store the file on the destination folder 
    filename:function(req,file,cb){
        const video_name = `${Date.now()}_${file.originalname}`
        cb(null,video_name)
    }
})

export const upload = multer({ storage:storage })