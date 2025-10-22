import { Router } from "express"
import { getMe, registerUser, userLogin, verifyEmail } from "../controllers/user.controller.js";
import { upload } from "../multer-config/multer_user_avatar.js";
import IsLoggedIn from "../middleware/auth.middleware.js";

const userRoutes = Router();

userRoutes.post("/register", upload.single("user_avatar") ,registerUser)
userRoutes.get("/verify-email/:token",verifyEmail)
userRoutes.post("/login",userLogin)
userRoutes.get("/me",IsLoggedIn,getMe)

export default userRoutes