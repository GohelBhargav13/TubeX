import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(process.cwd(),"User_Avatar"))
    },
    filename:function(req,file,cb){
        const file_name = `${Date.now()}_${file.originalname}`
        cb(null,file_name)
    }
})

export const upload = multer({ storage })