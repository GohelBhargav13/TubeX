import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config({ path:"./.env" })

const app = express()

app.use(cors({
    origin:["http://51.20.98.141:5174","http://localhost:5173","http://localhost:5174","https://tube-x.vercel.app:5174"],
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    credentials:true
}))

// MiddleWares
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())



app.get("/",(req,res) => {
    res.status(200).json({ message:"Hello from the root" })
})

// All routes
import videoRoutes from "./src/routes/video.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import playlistRoutes from "./src/routes/playlist.routes.js"


// middleware of the routes
app.use("/api/v1/video",videoRoutes)
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/playlist",playlistRoutes)

export default app