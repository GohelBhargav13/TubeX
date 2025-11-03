import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { AvailableUserRole, UserRole } from "../utills/constant.js";


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
    userRole:{
        type:String,
        trim:true,
        enum:AvailableUserRole,
        default:UserRole.USER
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
    EmailVerficationExpiry:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
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
    ],
    userPlayLists: [
        { 
            type:mongoose.Schema.Types.ObjectId, 
            ref:"PlayList"
        }
    ]

}, { timestamps:true })

// hashing the password
userSchema.pre("save",async function(next){
    if(!this.isModified("userPassword")) return next();
    this.userPassword = await bcrypt.hash(this.userPassword,10);
    next();
})

// compare the password function
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.userPassword);
}

// Generate the Access-Token using JWT
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({ id:this._id,role:this.userRole },process.env.JWT_SECRET,
        { expiresIn:process.env.JWT_EXPIRES_IN,algorithm:"HS256"})
}

userSchema.methods.generateEmailVerifiactionToken = function(){
    const unhashedToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");

    const EmailVerificationTokenExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    this.EmailVerificationToken = hashedToken;
    this.EmailVerficationExpiry = EmailVerificationTokenExpires;

    return { unhashedToken,hashedToken,EmailVerificationTokenExpires }
}


const Userm = mongoose.model("Userm",userSchema);

export default Userm