import Userm from "../models/user.models.js";
import ApiError from "../utills/api-error.js";
import ApiResponse from "../utills/api-response.js";
import crypto from "crypto";
import { sendEmail,verificationEmailTemplate } from "../utills/mail.js"

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

    if(!user_avatar_upload){
        return res.status(400).json(new ApiError(400,"Image is not uploaded"))
    }

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
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
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