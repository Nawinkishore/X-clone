import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
const protechRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token)
        {
            return res.status(400).json({error :"No token provided"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded)
        {
            return res.status(400).json({error:"Unauthorized"})
        }
        const user = await User.findOne({_id:decoded.userId}).select("-password");
        if(!user)
        {
            return res.status(400).json({error:"No such user"})
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
    }
}

export  default protechRoute;