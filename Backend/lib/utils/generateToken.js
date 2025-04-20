import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    //here we are creating a jwt token
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    httpOnly: true, // cookie is accessible only by server avoiding XSS(cross site scripting) attacks
    sameSite: "strict", // cookie is not sent in cross site requests(to avoid CSRF attacks)
    secure: process.env.NODE_ENV !== "development", // cookie is sent only over https
  });
};
