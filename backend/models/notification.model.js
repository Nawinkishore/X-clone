import mongoose from "mongoose";

const notificationschema = mongoose.Schema({
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
        
    },

    type : {
        type : String,
        required : true,
        enum : ["follow","like"]   // Restricts the field to these two values only

    },
    read : {
        type : Boolean,
        default : false

    }
},{timestamps : true})


const Notification = mongoose.model("Notification", notificationschema);
export default Notification;