import mongoose from "mongoose";

const connectDB = async (req,res) =>{
    try{
        const connectionURL = await mongoose.connect(process.env.MONGODB_URI)
        console.log("✅ Database connection successfully");
    }
    catch(error)
    {
        console.log("😭 Database Connection Failed");
    }

}

export default connectDB