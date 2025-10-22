import { Router } from "express"
import IsLoggedIn from "../middleware/auth.middleware.js" 
import { addVideoInPlayList, createPlayList, deletePlayList, getUserPlaylists } from "../controllers/playlist.controller.js";
import { checkUserRole } from "../middleware/check.middleware.js"
import { UserRole } from "../utills/constant.js";

const playlistRoutes = Router();

playlistRoutes.post("/create-playlist",IsLoggedIn, checkUserRole([UserRole.ADMIN,UserRole.USER]) ,createPlayList)
playlistRoutes.get("/get-playlists",IsLoggedIn, checkUserRole([UserRole.ADMIN,UserRole.USER]),getUserPlaylists)
playlistRoutes.post("/add-videos/:vId/:playlistId",IsLoggedIn,addVideoInPlayList)
playlistRoutes.delete("/delete-playlist/:playlistId",IsLoggedIn,deletePlayList)

export default playlistRoutes