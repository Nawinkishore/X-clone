import express from 'express';
import { signUp,login,logOut,getMe } from '../controllers/auth.controller.js';
import protechRoute from '../middleware/protectRoute.js';
const router = express.Router();
router.post('/signup',signUp);
router.post('/login',login);
router.post('/logout',logOut);
router.get('/me',protechRoute,getMe)
export default router;