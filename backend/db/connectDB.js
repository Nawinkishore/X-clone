import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connected");
    }
    catch(error){
        console.log(`Error in ConnnectDB : ${error}`)
        process.exit(1); // This will end the connection
    }
} 

export default connectDB;