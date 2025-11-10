import { io } from "socket.io-client"

const socket = io("http://13.51.106.105:8080",{
    transports:["websocket"]
})

export default socket