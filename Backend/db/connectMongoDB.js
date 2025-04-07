import mongoose from "mongoose";

const connectMongoD = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI) //this way we can connect to our database
        console.log(`MongoDB connected: ${conn.connection.host}`) 
    } catch (error) {
        console.error(`Error connecting to the database : ${error}`);
        process.exit(1);
    }
}

export default connectMongoD; 