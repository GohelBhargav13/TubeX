import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    userFirstName: {
        type:String,
        trim:true,
        required:[true , "User First Name is required"]
    },
    userLastName: {
        type:String,
        trim:true,
        required:[true , "User Last Name is required"]
    },
    userEmail:{
        type:String,
        trim:true,
        required:[true,"Email is Required"]
    },
    userPassword: {
            type:String,
            trim:true,
            required:[true,"Password is required"]
    },
    accessToken:{
        type:String,
        trim:true
    },
    accessTokenExpiry:{
        type:Date
    },
    EmailVerificationToken: {
        type:String,
        trim:true
    },
    userVideos: [
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    userLikes: [
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ]

}, { timestamps:true })

const User = mongoose.model("User",userSchema);

export default User