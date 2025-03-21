import jwt from "jsonwebtoken"
const generateToken = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"15d"
    })
    res.cookie("jwt" ,token ,{
        maxAge : 15 * 24 * 60 * 60 * 1000,
        httpOnly : true ,// xss attack protection
        sameSite : "strict" ,//csrf protection
        secure : process.env.NODE_ENV !=="development"
    })
}

export default generateToken;
