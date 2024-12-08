import express from 'express';
import { getNotification,deleteNotification } from '../controllers/notification.controller.js';
import protechRoute from '../middleware/protectRoute.js';
const router = express.Router();
router.get('/',protechRoute,getNotification);
router.delete('/',protechRoute,deleteNotification);

export default router;