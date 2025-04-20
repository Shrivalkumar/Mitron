import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

//conroller for creating a new post
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //input validation for the input feilds ...
    if (!text && !img) {
      return res
        .status(400)
        .json({ error: "Please enter either text or image" });
    }

    //uploading the image to the cloudinary
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url; // getting the url of the uploaded image
    }

    //creating a new Post
    const newPost = new Post({
      user: userId,
      text: text,
      img,
    });

    //saving it to the database
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
    console.log("Error in createPost controller " + error.message);
  }
};

//controller for deleting posts
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // getting the post from the url id... to delete
    if (!post) {
      return res.status(404).json({ errro: "Post not found" });
    }

    //checking if the user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    //check if the post has an image ... we have to delete that from the cloudinary...
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId); // deleting the image from the cloudinary
    }

    //deleting the post from the database
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost Controller " + error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

//controller for commenting on a post
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body; //getting the text from the request body
    const postId = req.params.id;
    const post = await Post.findById(postId); //getting the post from the url id
    const userId = req.user._id;

    //checking for input validation
    if (!text) {
      return res.status(400).json({ error: "Please enter a comment" });
    }

    //checking for the post
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    //creating the comment
    const comment = { user: userId, text };

    //putting the comment in the posts comments array
    post.comments.push(comment);

    //saving the post to the database
    await post.save();

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.log("Error in commentOnPost controller " + error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

//controller for liking and unliking a post
export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    //check if the user liked this post already
    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //if the user liked the post we have to unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } }); //update the user liked posts array
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //we have to like the post here
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save(); //saving it to the database

      //now we have to create a notifiaction for the user who posted this post
      const notifiaction = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notifiaction.save(); // saving the notification into the database
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller " + error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

//controller for getting all the posts of the users
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        //here we will use a populate method to get the user who posted the post
        path: "user",
        select: "-password", //we dont want to send the password in the response
      })
      .populate({
        path: "comments.user", // we use populate to get the user who commented on the post
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]); //returning empty array
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller " + error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

//controller for getting liked Posts
export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User nto Found" });
    }

    //getting posts liked by the user
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }) // here we are using $in operator to get all the posts which are liked by the user
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller " + error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

//controller for getting posts by the following users
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following; //getting the following array of the user

    const feedPosts = await Post.find({ user: { $in: following } }) //getting the posts of the users which the user is following
      .sort({ createdAt: -1 }) // sorting the posts in descending order of their creation time to get the recent posts
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller " + error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};

//controller for getting posts by the user
export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ user: user._id }) //getting the posts by the user
      .sort({ createdAt: -1 }) //sorting the posts in descending order of their creation time to get the recent posts
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller " + error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
