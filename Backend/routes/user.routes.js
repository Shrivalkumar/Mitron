import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser } from '../controllers/user.controller.js';


const router = express.Router();

router.get("/profile/:username" , protectRoute, getUserProfile); // get user profile 
router.get("/suggested" , protectRoute, getSuggestedUsers); // get suggested users
router.post("/follow/:id" , protectRoute, followUnfollowUser) // follow or unfollow user
router.post("/update" , protectRoute , updateUser) // to upadte a user profile it should be protected as unauthorized user can't update user profile...

export default router;