import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body();
    //Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // to check if the emaail is valid or not
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid Email" });
    }

    //Checking existing User
    const existingUser = await User.findOne({ username: username }); // to check if the username is already taken or not
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" }); // if the username is already taken, return an error
    }


    //Checking existing Email
    const existingEmail = await User.findOne({ email: email }); // to check if the email is already taken or not
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" }); // if the email is already taken, return an error
    }


    //Hashing the password
    const salt = await bcrypt.genSalt(10); // to generate a salt for the password
    const hashedPassword = await bcrypt.hash(password, salt); // to hash the password 


    //Creating a new User object of the user model
    const newUser = new User({
        fullName: fullName,
        username: username,
        email: email,
        password: hashedPassword
    });

    if(newUser){
        generateTokenAndSetCookie(newUser._id , res); // to generate a token and set a cookie(to create)
        

        // Saving the new user to the database
        await newUser.save();
        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
        });
    }else{
        console.log("Error in signup controller")
        res.status(400).json({error: "Failed to create user"});
    }


  } catch (error) {
    res.status(500).json({error: "Internal Server Error"});
  }
};

export const login = async (req, res) => {
  res.json({
    data: " you hit the signup end point",
  });
};

export const logout = async (req, res) => {
  res.json({
    data: " you hit the signup end point",
  });
};
