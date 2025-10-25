import { Server } from "socket.io"
import app from "../../app.js"
import http from "http"
import { commentVideo, likeVideo } from "../API/video.api.js"

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


    socket.on("disconnect",() => {
        console.log("Socket is disconnected : ",socket.id)
    })
})