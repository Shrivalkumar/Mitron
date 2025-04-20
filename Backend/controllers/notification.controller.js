import Notification from "../models/notification.model.js";



//controller for get Notifications 
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        //getting all the notifications sent to the user 
        const notifications = await Notification.find({to: userId}).populate({
            path: "from",
            select: "username profileImg" //populating the oath from which the notifications came and the user who sent the notification

        })


        //updating if the notification is read
        await Notification.updateMany({to: userId}, {read: true}) //marking all the notifications as read


        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in the getNotifications controller", error);
        res.status(500).json({error : "Internal server error"});
    }

}


//controller for deleting the Notifications 
export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;


        //deleting the notifications sent to the user
        await Notification.deleteMany({to: userId})
        res.status(200).json({message: "Notifications deleted successfully"});
    } catch (error) {
        console.log("Error in deleteNotification controller", error);
        res.status(500).json({error : "Internal server error"});
    }
}