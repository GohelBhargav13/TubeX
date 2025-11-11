import { io } from "socket.io-client"

const socket = io("https://tubex-m576.onrender.com:8080",{
    transports:["websocket"]
})

export default socket