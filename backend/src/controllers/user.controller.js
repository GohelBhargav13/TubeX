import Userm from "../models/user.models.js";
import ApiError from "../utills/api-error.js";
import ApiResponse from "../utills/api-response.js";
import crypto from "crypto";
import Video from "../models/video.models.js"
import { sendEmail,verificationEmailTemplate } from "../utills/mail.js"
// import { redis } from "../Aggregation/User.Aggregation.js"

export const registerUser = async (req, res) => {
  console.log(req.body);
  const { userEmail, userFirstName,userLastName, userPassword } = req.body;
  
  try {
    const existingUser = await Userm.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json(new ApiError(400, "User already exists"));
    }

    //check for the user_avatar is upload to the localpath
    console.log(req.file);
    const user_avatar_upload = req.file?.path;

    // if(!user_avatar_upload){
    //     return res.status(400).json(new ApiError(400,"Image is not uploaded"))
    // }

    // const cloudPathImage = await uploadImageOnCloudinary(user_avatar_upload);
    // if(!cloudPathImage){
    //     return res.status(400).json(new ApiError(400,"File is not uploaded in cloud"))
    // }

    const newUser = await Userm.create({
      userEmail,
      userFirstName,
      userLastName,
      user_avatar:user_avatar_upload,
      userPassword,
    });

    //Generate email verification token
    const emailToken = await newUser.generateEmailVerifiactionToken();

    if(!emailToken){
        return res.status(404).json(new ApiError(404,"Email Token is not Generated"))
    }
    
    await newUser.save();

    //Send verification email
    await sendEmail({
      email: newUser.userEmail,
      subject: "Verification Email",
      mailgencontent: verificationEmailTemplate(userFirstName, emailToken.unhashedToken),
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: newUser?._id, email: newUser.userEmail,user_avatar:user_avatar_upload },
          "User registerd sucessfully please Verify Your Email"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Internal Error in Registering User", error.message)
      );
  }
};

// User Email Verification
export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  console.log(token);
  
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashedToken);

    const userToken = await Userm.findOne({
      EmailVerificationToken: hashedToken,
      EmailVerficationExpiry: { $gt: Date.now() },
    });
    if (!userToken) {
      return res.status(400).json(new ApiError(400, "User Not Found"));
    }

    userToken.EmailVerificationToken = undefined;
    userToken.EmailVerficationExpiry = undefined;
    userToken.isVerified = true;

    await userToken.save();

    res.status(200).json(
      new ApiResponse(200, {
        message: "User Email Verification Successfully",
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Internal Error in Verifying User", error.message)
      );
  }
};

// User Login Controller
export const userLogin = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  // console.log({email,password})
  try {

    if(!userEmail || !userPassword){
        return res.status(404).json(new ApiError(404,"All Fields are required"))
    }

    const user = await Userm.findOne({ userEmail });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User Not Found"));
    }

    //generate Access Token
    const accessToken = user.generateAccessToken();
    console.log(accessToken);

    //match the password of User
    const isMatched = user.comparePassword(userPassword);
    if (!isMatched) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid Credential,Please Try Again"));
    }

    //check if user is verfied or not 
    if(user.isVerified === false){
      return res.status(400).json(new ApiError(400,"Please Verify Your Email"))
    }

    //check if user is disabled or not
    // if(user.isDisabled){
    //   return res.status(400).json(new ApiError(400,"User is Disabled"))
    // }

    //set Access Token into cookies
    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite:"none"
    }); // 24 hrs

    await user.save();

    res
      .status(200)
      .json(new ApiResponse(201, { message: "User LoggedIn successfully" }));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in Login", error.message));
  }
};

// GET / Profile 
export const getMe = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await Userm.findById({ _id: id }).select(
      "-password -__v -createdAt -updatedAt -isVerified -isDisabled"
    );
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    res.status(200).json(new ApiResponse(200, user, "User data Fetched"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in getMe", error.message));
  }
};

// Logout Module
export const userLogout = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await Userm.findById({ _id: id });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User Not Found"));
    }

    res.cookie("accesstoken", "", {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200,{ message:"user Logout Successfully" }))

  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Internal Error in logout", error.message)
      );
  }
};

// Fetch the user uploaded videos
export const getUserVideos = async (req,res) => {
  const { id } = req.user;

  try {

    if(!id){
      return res.status(404).json(new ApiError(404,"User Id is not Found"))
    }

    const videos = await Video.find({ videoOwner:id }).select("-__v -postdAt -updatedAt").populate("videoOwner","userFirstName userLastName user_avatar");
    // If Videos are not Available 
    if(videos.length === 0){
      return res.status(400).json(new ApiError(400,"No Videos Are Available"))
    }

    res.status(200).json(new ApiResponse(200,videos,"Videos Are Fetched Successfully"))
    
  } catch (error) {
    console.log("Error in fetching user videos : ",error);
    res.status(500).json(new ApiError(500,"Internal Error in fetching user videos"))
  }
  
}

// Fetch User where User Like video like instagram
export const getUserLikedVideos = async (req,res) => {
    const { id } = req.user;
    try {

      if(!id){
        return res.status(404).json(new ApiError(404,"User Id is not Found"))
      }

      const LikedVideos = await Video.find({ videoLikes:id }).select("-__v -postdAt -updatedAt").populate("videoOwner","userFirstName userLastName user_avatar");
      
      // If User is not Found
      if(LikedVideos.length === 0){
        return res.status(404).json(new ApiError(404,"No Liked Videos Are Available"))
      }

      res.status(200).json(new ApiResponse(200,LikedVideos,"Liked Videos Are Fetched Successfully"))

    } catch (error) {
      console.log("Error in fetching user liked videos : ",error);
      res.status(500).json(new ApiError(500,"Internal Error in fetching user liked videos"))
    }
}

// Fetch All user for Admin
export const getAllUsers = async(req,res) => {
    try {

     const result = await Userm.find().select("-password -__v -createdAt -updatedAt -EmailVerificationToken -EmailVerficationExpiry");
     
     console.log("User Found Result is : ", result)
     // If no user found
     if(result.length === 0){
      return res.status(404).json(new ApiError(404,"No User Found"))
     }

     res.status(200).json(new ApiResponse(200,result,"All User's Fetch Successfully"))
      
    } catch (error) {
      console.log("Error while fetch the All users : ",error);
      return
    }
}

// Change User Role
export const chanegUserRole = async(req,res) => {

  const { userId } = req.params;
  const { userRole } = req.body;

  console.log("UserID and UserRole in Controller : ", { userId,userRole })

  try {

      if(!userId){
        return res.status(404).json(new ApiError(404,"User ID is not found"))
      }
       console.log("UserRole Value from backend : ", userRole)

     const user = await Userm.findByIdAndUpdate(userId, {
        $set:{
          userRole:userRole
        },
     }, { new:true })

      // await redis.del("user-count")
      // await redis.del("admin-count")

     console.log("User after role change : ", user)

     if(user){
      return res.status(200).json(new ApiResponse(200,{ userData:user, UpdatedRole:user?.userRole }, "Role is Change"))
     }
    
  } catch (error) {
      console.log("Erorr While changing a role of user : ", error)
      return;
  }
}