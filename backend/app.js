import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
// import { debuggerForTheRoutes } from "./src/middleware/debug.middleware.js"

const app = express()

app.use(cors({
    origin:["http://localhost:5173","http://localhost:5174","https://tube-x.vercel.app"],
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    credentials:true,
    allowedHeaders:["Content-Type","Authorization"]
}))

// MiddleWares
// app.use(debuggerForTheRoutes)
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())



app.get("/",(req,res) => {
    res.status(200).json({ message:"Hello from the root" })
})

// health-check route
app.get("/health-check",(req,res) => {
    res.status(200).json({ message: "Server is Up and Running" })
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