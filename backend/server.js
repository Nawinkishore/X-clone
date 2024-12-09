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



/* 
Here are the **important points** related to the code:

### General Express and Node.js:

1. **Express**: Used to create a server and define routes for handling HTTP requests (e.g., `/api/auth`, `/api/users`).
2. **dotenv.config()**: Loads environment variables (API keys, port numbers) from a `.env` file, ensuring sensitive data isn’t hardcoded.
3. **express.json()**: Middleware to parse incoming JSON request bodies, crucial for handling POST/PUT requests.
4. **Route Modularization**: Routes (e.g., `authRoute`, `userRoute`) are separated for easier management, maintainability, and scalability.
5. **PORT Environment Variable**: Dynamically sets the server port using `process.env.PORT`, making the app flexible for different environments.

### Database and API:

6. **connectDB()**: Handles the connection to the database, necessary for storing and querying data.
7. **Error Handling**: Proper error handling should be implemented for database connection failures and API request errors to avoid crashes.

### Security and Best Practices:

8. **cookie-parser**: Middleware to parse cookies, useful for authentication and session management.
9. **Cloudinary Configuration**: Used for uploading and managing media (images, videos), configured using environment variables for security.
10. **Security Concerns**:
   - Protect `.env` file and sensitive data.
   - Validate and sanitize user input to prevent SQL injection or XSS attacks.

### Error Handling and Scalability:

11. **Error Handling Middleware**: Capture and handle errors centrally in the application.
12. **Scalability**: Can be improved using clustering, load balancing, and breaking the application into microservices.

*/
