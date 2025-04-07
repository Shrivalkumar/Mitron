import express from 'express';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import connectMongoD from './db/connectMongoDB.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


app.use("/api/auth" , authRoutes);

app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoD(); // once our server is runnning we can connect out database
})