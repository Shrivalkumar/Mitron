import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params; // get the username from the URL

  try {
    const user = await User.findOne({ username: username }).select("-password"); // find the user by username and exclude the password field
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user); // return the user object
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error is getUserProfile", error.message);
  }
};

// controller for the follow and unfollow
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params; // get the id from the URL to identify the user to follow or unfollow
    const userToModify = await User.findById(id); // find the user to follow or unfollow
    const currentUser = await User.findById(req.user._id); // find the current user

    if (id === req.user._id.toString()) { // we have to convert it to string because it's an ObjectId
      // checking if the user is trying to unfollow himself
      res.status(400).json({
        error: "You can't follow or unfollow yourself",
      });
    }

    //chekcing if the user exists
    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    } 

    const isFollowing = currentUser.following.includes(id); // check if the current user is already following the user to modify

    if (isFollowing) {
      // we will remove the user from the following array
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({ message: "user unfollowed" });
    } else {
      // we will add the user to the following array
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }); // add the current user to the followers array of the user to modify
	  await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); // add the user to modify to the following array of the current user


    //creating a notification of the follow action....
    const newNotification = new Notification({
        from: req.user._id,
        to: id,
        type: "follow"
    })
    //saving the notification to the database
    await newNotification.save();

      res.status(200).json({ message: "user followed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error is followUnfollowUser", error.message);
  }
};
