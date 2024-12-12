import mongoose from "mongoose";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js";



export const signUp = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        const existingEmail = await User.findOne({ email: email })
        const existingUsername = await User.findOne({ username: username })
        if (existingEmail || existingUsername) {
            return res.status(400).json({ error: 'Already signed In' });
        }
        if (password.length < 6) {
            res.status(400).json({ error: 'Password length is Minimum' });
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            fullName,
            email,
            password: hashedPassword
        })
        if (user) {
            generateToken(user._id, res)
            await user.save();
            res.status(200).json({
                _id: user.id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                followers: user.followers,
                following: user.following,
            });
        }
        else { res.status(400).json({ error: "Invalid User Data" }) }
    } catch (error) {
        console.log(`Error in ${error.message}`)
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username: username })
        const isPassword = await bcrypt.compare(password, user?.password || "")
        if (!user || !isPassword) {
            return res.status(400).json({ error: "Invalid User name or Password" })
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user.id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
        });
    } catch (error) {
        console.log(`Error in ${error.message}`)

    }
}

export const logOut = async (req, res) => {
    try {
    res.cookie("jwt" ,"",{maxAge : 0});
    res.status(200).json({Message:"Log Out Successfully"})
    } catch (error) {
        console.log(`Error in ${error.message}`)
        
    }
} 


export const getMe = async (req, res) => {
      try{
         const user = await User.findOne({_id: req.user._id}).select("-password");
         res.status(200).json(user);
      }catch(error){
        console.log(`Error in ${error.message}`)

      }
}
