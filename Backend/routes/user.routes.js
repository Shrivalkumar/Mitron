import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { followUnfollowUser, getUserProfile } from '../controllers/user.controller.js';


const router = express.Router();

router.get("/profile/:username" , protectRoute, getUserProfile); // get user profile 
router.post("/follow/:id" , protectRoute, followUnfollowUser) // follow or unfollow user

export default router;
