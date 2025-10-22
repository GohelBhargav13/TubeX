import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({

    videoTitle: {
        type:String,
        trim:true,
        required:[true,"video title is required"],
    },
    videoDescription: {
        type:String,
        trim:true,
        required:[true,"video description is required"],
    },
    videoUrl:{
        type:String,
        trim:true,
        required:[true,"video url is required"],
    },
    videoOtherUrl:{
        type:String,
        trim:true,
        required:false
    },
    videoOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Userm",
    },
    videoLikes:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"Userm"
         }
    ],
    videoComments:[
        {
            user:{ type: mongoose.Schema.Types.ObjectId, ref:"Userm" },
            comment:{ type:String, trim:true, required:[true,"Comment is Required"] },
            commentedOn:{ type:Date, default:Date.now() }
        }
    ],
    videoThumbnail:{
        type:String,
        trim:true,
        required:false
    },
    postdAt:{
        type:Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default:Date.now()
    }


}, { timestamps:true })

const Video = mongoose.model("Video",videoSchema);

export default Video