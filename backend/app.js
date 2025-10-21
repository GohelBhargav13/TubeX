import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config()

const app = express()

// MiddleWares
app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())

app.use(cors({
    origin:["http://localhost:5173","http://localhost:5174"],
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    credentials:true
}))

app.get("/",(req,res) => {
    res.status(200).json({ message:"Hello from the root" })
})

// All routes
import videoRoutes from "./src/routes/video.routes.js"


// middleware of the routes
app.use("/api/v1/video",videoRoutes)

export default app