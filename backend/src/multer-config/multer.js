import multer from "multer"
import path from "path"
import fs from "node:fs"

const storage = multer.diskStorage({
    // Define the destination folder for the video store
    destination:function(req,file,cb){
        const dir = process.cwd().split('\\').pop()
        if(!fs.existsSync(path.join(dir,"Videos"))){
            console.log("videos folder created at :", path.join(dir,"Videos"))
            fs.mkdirSync(path.join(dir,"Videos"),{ recursive:true })
        }
        cb(null,path.join(dir,"Videos"))
    },
    // for the function to store the file on the destination folder 
    filename:function(req,file,cb){
        console.log(file);
        cb(null,`${Date.now()}_${file.originalname}`)

    }
})

export const upload = multer({ storage:storage })