import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({

    videotitle: {
        type:String,
        trim:true,
        required:[true,"video title is required"],
    },
    videodescription: {
        type:String,
        trim:true,
        required:[true,"video description is required"],
    },
    videourl:{
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
        ref:"User",
    },
    videoLikes:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
         }
    ],
    videoComments:[
        {
            user:{ type: mongoose.Schema.Types.ObjectId, ref:"User" },
            comment:{ type:String, trim:true, required:[true,"Comment is Required"] },
            commentedOn:{ type:Date, default:Date.now() }
        }
    ],
    videoThumbnail:{
        type:String,
        trim:true,
        required:false
    }


}, { timestamps:true })

const Video = mongoose.model("Video",videoSchema);

export default Video