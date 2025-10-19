import express from "express"
import cors from "cors"
import videoRoutes from "./src/routes/video.routes.js"
const app = express()


const PORT = 4000

app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173","http://localhost:5174"],
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    credentials:true
}))

app.get("/",(req,res) => {
    res.status(200).json({ message:"Hello from the root" })
})

app.use("/video",videoRoutes)

app.listen(PORT,() => console.log(`App is running on port ${PORT}`))
