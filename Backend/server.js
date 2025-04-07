import express from 'express';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import connectMongoD from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json()); //using middleware to parse json data between req and res (to parse req.body())
app.use(express.urlencoded({ extended: true })); //using middleware to parse url encoded data between req and res (to parse req.body())

app.use(cookieParser()); //using middleware to parse cookies 

app.use("/api/auth" , authRoutes);

app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoD(); // once our server is runnning we can connect out database
})
