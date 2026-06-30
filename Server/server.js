import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import accountRouter from "./routes/account.routes.js";
import transectionRoute from "./routes/transection.routes.js";

const app = express();
const PORT = process.env.PORT || 3000


connectDB();
app.use(express.json());
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Server side running  ");
})


app.use('/api/auth' , authRouter)
app.use('/api/accounts' ,accountRouter)
app.use('/api/transection' , transectionRoute)
app.listen(PORT,()=>{
    console.log("Server is running on port 3000");
})