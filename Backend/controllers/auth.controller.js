import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


// Singup controller 
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    //Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // to check if the emaail is valid or not
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    //Checking existing User
    const existingUser = await User.findOne({ username }); // to check if the username is already taken or not
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" }); // if the username is already taken, return an error
    }

    //Checking existing Email
    const existingEmail = await User.findOne({ email }); // to check if the email is already taken or not
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" }); // if the email is already taken, return an error
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" }); // if the password is less than 6 characters, return an error
    }

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creating a new User object of the user model
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res); // to generate a token and set a cookie

      // Saving the new user to the database
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




// Login Controller

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username }); // find the user by the username
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    ); // compare the password with the hashed password


    //checking if the user exists and the password is correct
    if (!user || !isPasswordCorrect) {
      res.status(401).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id , res); // to generate a token and set a cookie 


    //sending the user data 
    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,  
        profileImg: user.profileImg,
        coverImg: user.coverImg,
    })
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Logout Controller
export const logout = async (req, res) => {
  try {
    res.cookie("jwt" , "" , { // to delete the cookie
        maxAge: 0
    })
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error is logout controller" , error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// A check if the user is logged in or not 
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
