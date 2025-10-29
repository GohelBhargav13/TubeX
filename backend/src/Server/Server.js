import { Server } from "socket.io"
import app from "../../app.js"
import http from "http"
import { commentVideo, deleteComment, deleteVideo, likeVideo } from "../API/video.api.js"

export const server = http.createServer(app)

export const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173","http://localhost:5174"],
        credentials:true,
        methods:["GET","POST","DELETE","OPTION","PUT","PATCH"]
    }
})


io.on("connection",(socket) => {
    console.log("New Socket Connection : ",socket.id);

    socket.on("likePost", async ({ videoId,userId }) => {
        // console.log("Receving Like Event : ",videoId,userId)
        await likeVideo(videoId,userId,socket)
    })

    socket.on("commentPost", async ({ comment,commentId,userId,videoId }) => {
        await commentVideo(comment,userId,videoId,socket)
    })

    socket.on("deleteComment",async ({ commentId,userId,videoID }) => {
        console.log("Receving Delete Comment Event : ",commentId,userId)
        await deleteComment(commentId,userId,videoID,socket)
    })

    socket.on("uploadvideo", async({ videoData }) => {
        console.log("Video is upload on the server")
         io.emit("newVideoUploaded", { videoData })
    })

    socket.on("deleteVideo", async({ videoId,userData }) => {
        console.log("Receving Delete Video Event : ", { videoId,userData });
        try {
            if(userData?.userRole === "admin"){
                await deleteVideo(videoId,userData,socket)
                return;
            }else {
                socket.emit("ErrorInSocket", { message:"You are not authorized to delete the video"});
            }     
        } catch (error) {
            console.log("Error While Deleting Video : ",error);
        }
    })

    socket.on("videoDetailsUpdate", async({ videoId,updatedData }) => {
        console.log("Updated Data At Server Side :", updatedData)
       try {
         if(videoId){
             io.emit("videoDetailsUpdated", { videoId,updatedData, message:`${updatedData?.videoTitle} video Details Updated` })
         }
       } catch (error) {
        console.log(error)
       }
    })

    socket.on("disconnect",() => {
        console.log("Socket is disconnected : ",socket.id)
    })
})