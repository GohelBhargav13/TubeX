import { Server } from "socket.io"
import app from "../../app.js"
import http from "http"

export const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173","http://localhost:5174"],
        credentials:true,
        methods:["GET","POST","DELETE","OPTION","PUT","PATCH"]
    }
})


io.on("connection",(socket) => {
    console.log("New Socket Connection : ",socket.id);


    socket.on("disconnect",() => {
        console.log("Socket is disconnected : ",socket.id)
    })
})