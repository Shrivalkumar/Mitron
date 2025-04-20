import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId, // this notification is from this user 
        ref: 'User',
        required: true
    },
    to:{
        type: mongoose.Schema.Types.ObjectId, // this notification is for this user
        ref: 'User',
        required: true
    },
    type:{
        type: String,
        required: true,
        enum: ['like', 'follow'] // the type of notification 
    },
    read:{
        type: Boolean, // if the notification is read or not...
        default: false
    }
} , {timestamps: true})


const Notification = mongoose.model('Notification', notificationSchema); // creating a model on the schema ..... 
export default Notification; 