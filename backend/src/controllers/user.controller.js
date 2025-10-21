import User from "../models/user.models.js";
import ApiError from "../utills/api-error.js";
import ApiResponse from "../utills/api-response.js";

export const registerUser = async (req, res) => {
  console.log(req.body);
  const { userEmail, userFirstName,userLastName, user_avatar, userPassword } = req.body;
  
  try {
    const existingUser = await User.findOne({ userEmail });
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

    const newUser = await User.create({
      userEmail,
      userFirstName,
      userLastName,
      user_avatar:user_avatar_upload,
      userPassword,
    });

    //Generate email verification token
    const emailToken = newUser.generateEmailVerificationToken();

    await newUser.save();

    //Send verification email
    await sendEmail({
      email: newUser.email,
      subject: "Verification Email",
      mailgencontent: verificationEmailTemplate(userFirstName, emailToken.unhashedToken),
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: newUser._id, email: newUser.email,user_avatar:cloudPathImage },
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