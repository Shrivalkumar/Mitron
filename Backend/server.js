import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from 'url';

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import connectMongoD from "./db/connectMongoDB.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

app.use(express.json({limit: "5mb"})); //using middleware to parse json data between req and res (to parse req.body())
app.use(express.urlencoded({ extended: true })); //using middleware to parse url encoded data between req and res (to parse req.body())

app.use(cookieParser()); //using middleware to parse cookies

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(rootDir, "Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(rootDir, "Frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} http://localhost:${PORT}/`);
  connectMongoD(); // once our server is runnning we can connect out database
});
