const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        default:true, // Auto-verify users (no email verification)
    },
    // verificationLinkSent field removed - no longer needed
    // avatarLink : {
    //     type:String
    // },
}, {timestamps:true}
);

const User = mongoose.model("user",userSchema);
module.exports = {User}
