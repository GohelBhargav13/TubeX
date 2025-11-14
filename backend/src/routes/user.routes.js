import { Router } from "express"
import { chanegUserRole, getAllUsers, getMe, getUserLikedVideos, getUserVideos, registerUser, userLogin, userLogout, verifyEmail } from "../controllers/user.controller.js";
import { upload } from "../multer-config/multer_user_avatar.js";
import IsLoggedIn from "../middleware/auth.middleware.js";
import {  userCount, VideoCount } from "../Aggregation/User.Aggregation.js";


const userRoutes = Router();

userRoutes.post("/register", upload.single("user_avatar") ,registerUser)
userRoutes.get("/verify-email/:token",verifyEmail)
userRoutes.post("/login",userLogin)
userRoutes.get("/me",IsLoggedIn,getMe)
userRoutes.get("/get-liked-videos",IsLoggedIn,getUserLikedVideos)
userRoutes.get("/user-videos",IsLoggedIn,getUserVideos)
userRoutes.get("/all-users",IsLoggedIn,getAllUsers)
userRoutes.post("/change-userRole/:userId",IsLoggedIn,chanegUserRole)
userRoutes.get("/logout",IsLoggedIn,userLogout)
userRoutes.get("/get-user-count",IsLoggedIn,userCount)

export default userRoutes