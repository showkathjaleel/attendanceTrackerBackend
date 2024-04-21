const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    email:{
        type: String,
    },
    userId:{
        type: String,
    },  
    loginDate:{
        type: String,
    },
    lastLoginedTime: {
        type: Date,
        // required: true
    },
    totalTimeSpent: {
        type: String
    },
});

const attendancedetails = mongoose.model("attendancedetails", attendanceSchema);

module.exports = attendancedetails;
