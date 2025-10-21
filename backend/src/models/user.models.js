import mongoose from "mongoose";
import bcrypt from "bcrypt"

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
    user_avatar:{
        type:String,
        trim:true,
        required:false
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

// hashing the password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

// compare the password function
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

const User = mongoose.model("User",userSchema);

export default User