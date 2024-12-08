import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "cloudinary";
import Notification from "../models/notification.model.js";


export const getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(`Error in getProfile :${error.message}`)
    }
}

export const followUnfollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);  // No need for { _id: id } inside findById
        const currentUser = await User.findById(req.user._id); // Use findById for consistency

        if (id === req.user._id) {
            return res.status(400).json({ error: 'You cannot follow/unfollow yourself' });
        }

        if (!userToModify || !currentUser) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });  // Correct the field
            res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            // Follow
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });  // Correct the field
            const newNotication = new Notification({
                type: 'follow',
                from: req.user._id,
                to: userToModify._id,

            })

            await newNotication.save();
            res.status(200).json({ message: "Followed successfully" });

            // Send notification (optional)
        }
    } catch (error) {
        console.log(`Error in: ${error.message}`);
        res.status(500).json({ error: "Server error" });  // Ensure to send a response on errors
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get the user who is making the request
        const userFollowedByMe = await User.findById(userId).select("-password");

        // Fetch random users who are not the logged-in user
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }  // Exclude the logged-in user
                }
            },
            {
                $sample: {
                    size: 10  // Get a random sample of 10 users
                }
            }
        ]);

        // Filter out users already followed by the logged-in user
        const filteredUsers = users.filter(
            (user) => !userFollowedByMe.following.includes(user._id)
        );

        // Take the first 4 users from the filtered list
        const suggestedUsers = filteredUsers.slice(0, 4);

        // Nullify the password field in the suggested users
        suggestedUsers.forEach((user) => (user.password = null));

        // Send the response with the suggested users
        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.log(`Error in getSuggestedUsers: ${error.message}`);
        return res.status(500).json({ error: "Suggested users retrieval error" });
    }
};


export const updateUser = async(req,res)=>{
         try {
            const userId = req.user._id;
            const {username,fullName,email,currentPassword,newPassword,bio,link} = req.body;
            let {profileImg,coverImg} = req.body;
            let user = await User.findById({_id: userId});
            if(!user)
            {
                return res.status(404).json({error: "User not found"});
            }

            if((!newPassword && currentPassword) || (!currentPassword && newPassword))
            {
                return res.status(400).json({error: "please provide both new password and current password"});

            }
            if(currentPassword && newPassword)
            {
                const isMatch = await bcrypt.compare(currentPassword,user.password);
                if(!isMatch)
                {
                    return res.status(400).json({error: "current password is incorrect" }); 
                }
                if(newPassword.length < 6)
                {
                    return res.status(400).json({error: "password must be at least 6 characters"}); 
                }
                const salt = await bcrypt.genSalt(10)
                user.password = await bcrypt.hash(newPassword,salt)
            }
            // if(profileImg)
            // {
            //     if(user.profileImg)
            //     {
            //         await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
            //     }
            //     const uploadResponse = await cloudinary.uploader.upload(profileImg)
            //     profileImg =  uploadResponse.secure_url;
            // }
            // if(coverImg)
            //     if(user.coverImg)
            //         {
            //             await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
            //         }
            //     {
            //         const uploadResponse = await cloudinary.uploader.upload(coverImg)
            //         coverImg =  uploadResponse.secure_url;
            //     }

            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.username = username || user.username;
            user.link = link || user.link;
            user.bio = bio || user.bio;
            user.profileImg = profileImg || user.profileImg;
            user.coverImg = coverImg || user.coverImg;

            user = await user.save();
            //password is null in response
            user.password = null;
            return res.status(200).json(user);
            
         } catch (error) {
            console.log(`Error in getSuggestedUsers: ${error.message}`);
            return res.status(500).json({ error: "Update user retrieval error" });
      
         }
}
