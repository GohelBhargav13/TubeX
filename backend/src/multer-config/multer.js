import multer from "multer"
import path from "path"
import fs from "node:fs"

const dir = path.join(process.cwd(), 'uploads/videos');
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir,{ recursive:true })
}

const storage = multer.diskStorage({
    // Define the destination folder for the video store
    destination:function(req,file,cb){
        this.destination = dir
        cb(null,dir)
    },
    // for the function to store the file on the destination folder 
    filename:function(req,file,cb){
        console.log(file);
        cb(null,`${Date.now()}_${file.originalname}`)

    }
})

export const upload = multer({ storage:storage })