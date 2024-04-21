

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    region: {
        type: String
    },
    shift: {
        type: String
    },
    password:{
        type: String
    },
    // logoutTime: {
    //     type: String
    // },
    // totalTimeSpent: {
    //     type: Number
    // },
    createdDate: {
        type: Date,
        default: Date.now // Set default value to current date/time
    }
});

const userdetails = mongoose.model("userdetails", userSchema);

module.exports = userdetails;
