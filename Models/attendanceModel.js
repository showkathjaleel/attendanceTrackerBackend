const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // loggedIn: {
    //     type: String
    // },
    // region: {
    //     type: String
    // },
    // shift: {
    //     type: String
    // },
    // logoutTime: {
    //     type: String
    // },
    userId:{
        type: String,
    },  
    loginDate:{
        type: String,
    },
    firstLoginTime: {
        type: Date,
        required: true
    },
    totalTimeSpent: {
        type: String
    },
    // createdDate: {
    //     type: Date,
    //     default: Date.now // Set default value to current date/time
    // }
});

const attendancedetails = mongoose.model("attendancedetails", attendanceSchema);

module.exports = attendancedetails;
