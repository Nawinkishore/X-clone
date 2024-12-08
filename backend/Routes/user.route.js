import express from 'express';
import { getProfile,followUnfollow,getSuggestedUsers, updateUser } from '../controllers/user.controller.js';
import protechRoute from '../middleware/protectRoute.js';
const router = express.Router();
router.get('/profile/:username',protechRoute,getProfile);
router.post('/follow/:id',protechRoute,followUnfollow);
router.get('/suggested',protechRoute,getSuggestedUsers);
router.post('/update/',protechRoute,updateUser);


export default router;