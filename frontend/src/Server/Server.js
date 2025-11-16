import { io } from "socket.io-client"

const socket = io("https://tubex-m576.onrender.com",{
    transports:["websocket"]
})

export default socket