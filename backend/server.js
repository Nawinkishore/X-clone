// const express = require('express');
import express from 'express' //It can be achieved by adding the "type" : "module"
import dotenv from 'dotenv'
import authRoute from './Routes/auth.route.js'
import userRoute from './Routes/user.route.js'
import postRoute from './Routes/post.route.js'
import notificationRoute from './Routes/notification.route.js'
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import cloudinary from "cloudinary"
dotenv.config();
cloudinary.config(
    {
        cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
        api_key :process.env.CLOUDINARY_API_KEY,
        api_secret :process.env.CLOUDINARY_API_SECRET_KEY
    }
);
const app = express();
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
    connectDB();
})
app.use(cookieParser())
app.use(express.json()); // middleware
app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/posts',postRoute);
app.use('/api/notification',notificationRoute)
