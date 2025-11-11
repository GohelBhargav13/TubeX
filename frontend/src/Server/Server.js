import { io } from "socket.io-client"

const socket = io("http://51.20.98.141:8080",{
    transports:["websocket"]
})

export default socket