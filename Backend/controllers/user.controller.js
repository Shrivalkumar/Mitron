import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

//models
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

    if (id === req.user._id.toString()) {
      // we have to convert it to string because it's an ObjectId
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
        type: "follow",
      });
      //saving the notification to the database
      await newNotification.save();

      res.status(200).json({ message: "user followed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error is followUnfollowUser", error.message);
  }
};

// controller for getSuggested Users
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    //get the array of users I am following
    const usersFollowedByMe = await User.findById(userId).select("following");

    //getting 10 users except me
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    //excluding the users followed by me...
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    // getting 5 users out of it...for the suggestions..
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null)); // removing the password from the suggested users

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error is getSuggestedUsers", error.message);
  }
};

// controller for updating user profiles ...
export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body; // destructuring the request body
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId); //we have to use let becuase we are changing the user object
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // checking for the password input validation ....
    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res
        .status(400)
        .json({ error: " Please enter both current and new password" });
    }

    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid current password" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password should be at least 6 characters" });
      }

      //if all is good then hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword; // updating the password
    }

    // updating the user profile Image
    if (profileImg) {
      //if user already has a profile image we are removing the old one  from the cloudinary
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        ); //removing the id of the old image from the url saved in the cloudinary
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    // updating the user cover image
    if (coverImg) {
      //if user already has a cover image we are removing the old one  from the cloudinary
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    //updating the user details and other atttributes ...
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    //saving the user in the database
    user = await user.save();

    user.password = null; // the password is removed from the user object

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser" + error);
    return res.status(500).json({ error: error.message });
  }
};
