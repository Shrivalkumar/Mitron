import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) { // check if token exists
      return res.status(401).json({ message: "You are not logged in" });
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token

    if(!decoded) {  // check if decoded token is valid
        return res.status(401).json({ message: "You are not logged in" });
    }

    const user = await User.findById(decoded.userId).select("-password"); // find user by id 

    if(!user){
        return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // add user to the request object
    next(); // move to the next middleware
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
