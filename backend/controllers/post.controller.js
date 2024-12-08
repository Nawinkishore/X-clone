import mongoose from "mongoose";
import User from "../models/user.model.js";
import  cloudinary from 'cloudinary'
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
export const createPost = async (req,res)=>{
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();
        const user = await User.findOne({_id: userId})
        if(!user)
        {
            return res.status(400).json({error: 'User not found'})
        }
        if(!text && !img)
        {
            return res.status(400).json({error :'Post must have image or text'})
        }
        if(img)
        {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user:userId,
            text,
            img,
        })
        await newPost.save();  
        res.status(201).json(newPost); // if anything created we denoted as 201 code
    } catch (error) {
        console.log(`Error creating post controller: ${error.message}`)
        return res.status(500).json({error : 'Internal Server Error'})
    }
}

export const deletePost = async(req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        if (!post) {
            return res.status(404).json({ error: 'Not Found' });
        }

        // Check if the user is authorized to delete the post
         if (post.user.toString() !== req.user._id.toString()) {
            return res.status(400).json({ error: 'You are not allowed to delete this post' });
        }

        // If the post has an image, delete it from Cloudinary
        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0]; // Extract the public ID of the image
            await cloudinary.uploader.destroy(imgId); // Use cloudinary.uploader.destroy
        }

        // Delete the post from the database
        await Post.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log(`Error deleting post controller: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }


 




};

export const createComment = async(req,res) =>{
    try {
        const {text}= req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if(!text)
        {
            return res.status(400).json({error:"Comment text is required"});
        }
        const post = await Post.findOne({_id:postId})
        if(!post)
        {
            return res.status(404).json({error:"Post not found"}); 
        }
        const comment = {
            user:userId,
            text,
        }
        post.comments.push(comment)
        await post.save();
        res.status(201).json(post)
        //task to add notification enum add comment
    
        
    } catch (error) {
        console.log(`Error comment post controller: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const likeUnlikePost = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {id:postId} =req.params;
        const post = await Post.findOne({_id: postId});

        if(!post)
        {
            return res.status(404).json({error:'cannot find post'})
        }
        const userLikedPost = post.likes.includes(userId) 
        if(userLikedPost)
        {
            //unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            await User.updateOne({_id:userId},{$pull:{likedPosts:postId}});
            res.status(200).json({message:'Unliked Successfully'});
        }
        else
        {
            //like post
            post.likes.push(userId);
            await User.updateOne({_id:userId},{$push:{likedPosts:postId}});
            await post.save();
            const notification = new Notification({
                from:userId,
                to:post.user,
                type:"like"
            })
            await notification.save();
            res.status(200).json({message:'Post liked'})
        }
    } catch (error) {
        console.log(`Error likeUnlike post controller: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
}

export const getAllPost = async(req,res)=>{
    try {
        const post = await Post.find().sort({createdAt : -1}).populate({
            path :"user",
            select : "-password"
        }).populate({
            path:"comments.user",
            select : ["-password","-email","-following","-followers","-bio","-link"]
        })
        if(post.length ===0)
        {
            return res.status(200).json([]);
        }
        res.status(200).json(post)
    } catch (error) {
        console.log(`Error Get post controller: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById({_id: userId});
        if(!user)
        {
            return res.status(404).json({ error: 'User id not found' });
        }
        const likedPosts = await Post.find({_id: {$in : user.likedPosts}}).populate({
            path:'user',
            select : '-password'
        }).
        populate({ path:'comments.user', select : ["-password","-email","-following","-followers","-bio","-link"] })
        return res.status(200).json({likedPosts});
    } catch (error) {
        console.log(`Error Get Get all likes controller: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getFollowingPosts = async (req, res) => {
    try{
        const userId = req.user._id;
        const user = await User.findById({_id: userId});
        if(!user)
        {
            return res.status(404).json({'error': 'Not Found'});
        }
        const following = user.following;
        const feedPosts = await Post.find({user : {$in : following}})
            .sort({createdAt:-1})
            .populate
            ({
                path:'user',
                select : '-password'
             }).
            populate
            ({   path:'comments.user',
                 select : ["-password","-email","-following","-followers","-bio","-link"] 
             })
             res.status(200).json(feedPosts)
    }catch (error) {
        console.log(`Error  Get all likes controller: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
// give 


export const getUserPosts = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username})
        if(!user)
        {
            return res.status(404).json({error: 'Not Found'});
        }
        const posts =  await Post.find({user:user._id})
        .sort({createdAt:-1})
        .populate
        ({
            path:'user',
            select : '-password'
         }).
        populate
        ({   path:'comments.user',
             select : ["-password","-email","-following","-followers","-bio","-link"] 
         })
         return res.status(200).json(posts);
    } catch (error) {
        console.log(`Error  Get Specfic username posts: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
        
        
    }
}

