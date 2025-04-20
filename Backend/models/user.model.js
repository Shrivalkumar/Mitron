import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    //creating a user schema
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId, // followers will be an array of user ids
        ref: "User", // referencing the user model
        default: [], // default value is an empty array
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId, // following will be an array of user ids
        ref: "User", // referencing the user model
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId, // likedPosts will be an array of post ids
        ref: "Post", 
        default: [],
    }]
  },
  { timestamps: true }
); // this gives us all the timeStamps as updated and created

const User = mongoose.model("User", userSchema); // creating a userModel with a userSchema we just created

export default User;
