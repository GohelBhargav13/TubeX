import mongoose from "mongoose";

// Database Connectivity for the Backend
export const db = async() => {
    try {
    
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Host is : ",mongoose.connection.host)
        console.log("Port is : ",mongoose.connection.port)
        console.log("Database Connected Successfully");

    } catch (error) {
        console.log("Error in Database Connection",error);
        process.exit(1); // For Cut the connection
    }
}

