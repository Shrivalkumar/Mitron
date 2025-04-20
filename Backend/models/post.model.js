import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required :true
    },
    text:{
        type: String,
    },
    img: {
        type: String,
    },
    likes: [
        { 
            type: mongoose.Schema.Types.ObjectId, // each like is a refernce to a user 
            ref: "User",
        }
    ],
    comments: [
        {
            text:{
                type: String,
                required: true
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required :true
            }
        }
    ]
    
}, {timestamps: true}); //time stamps for the time the post was created and updated


const Post = mongoose.model("Post", postSchema); // create a model from the schema

export default Post; 