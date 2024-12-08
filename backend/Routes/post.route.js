import express from 'express';
import protechRoute from '../middleware/protectRoute.js';
import { createPost , 
    deletePost, 
    createComment,
    likeUnlikePost,
    getAllPost,
    getLikedPosts,
    getFollowingPosts,
    getUserPosts} from '../controllers/post.controller.js';
const router = express.Router();
router.get('/all',protechRoute,getAllPost)
router.get('/following',protechRoute,getFollowingPosts);
router.get('/likes/:id',protechRoute,getLikedPosts);
router.get('/user/:username',protechRoute,getUserPosts)
router.post('/create' ,protechRoute,createPost);
router.post('/like/:id' ,protechRoute,likeUnlikePost);
router.post('/comment/:id' ,protechRoute,createComment);
router.delete('/:id' ,protechRoute,deletePost);

export default router;