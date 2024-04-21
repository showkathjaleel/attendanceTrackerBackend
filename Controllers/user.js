const userdetails = require('../Models/userModel');
const attendancedetails = require('../Models/attendanceModel');
const ObjectId = require('mongodb').ObjectId

function formattedTodaysDate() {
    const today = new Date();
    // Extract the year, month, and day
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Adding 1 because January is 0
    const day = today.getDate();

    // Format the date as desired
     const todaysDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

    console.log(todaysDate,'todaysDate in formattedDate fun')
  
    return todaysDate;
}

function calculateTimeDifference(timeDifferenceMilliseconds) {
    const hours = Math.floor(timeDifferenceMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifferenceMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifferenceMilliseconds % (1000 * 60)) / 1000);


    const timediff = `${hours} hours, ${minutes} minutes, ${seconds} seconds`
    console.log(timediff, 'timediff in calculateTimeDifference fun');
    return timediff
}


function getTotalTimeSpentAndcalculateTimeDifference(totalTimeSpent,logoutTime, loginedTime){
    console.log(totalTimeSpent,'totalTimeSpenttotalTimeSpent')
    const timeParts = totalTimeSpent.match(/\d+/g);
    const hours = parseInt(timeParts[0]) || 0;
    const minutes = parseInt(timeParts[1]) || 0;
    const seconds = parseInt(timeParts[2]) || 0;
    console.log(hours,'111',minutes,'222',seconds,'333')

    // Convert hours, minutes, and seconds to milliseconds
    const hoursInMilliseconds = hours * 60 * 60 * 1000;
    const minutesInMilliseconds = minutes * 60 * 1000;
    const secondsInMilliseconds = seconds * 1000;

    // Calculate the total time in milliseconds
    const totalTimeMilliseconds = hoursInMilliseconds + minutesInMilliseconds + secondsInMilliseconds;
    console.log(totalTimeMilliseconds,'totalTimeMilliseconds')

    // last entered time difference
    const timeDifferenceMilliseconds = logoutTime - loginedTime;
    const totalTime=timeDifferenceMilliseconds+totalTimeMilliseconds
     const result= calculateTimeDifference(totalTime)
     console.log(result,'result')
     return result;


}
// Register
const register = async (req, res) => {

    const { email, region, shift, password } = req.body; // Correctly destructure only the email field

    try {
        const existingUser = await userdetails.findOne({ email: email, password: password });
        if (existingUser) {
            return res.status(406).json({ message: "User already exists" });
        } else {
            // Add user to collection
            const newUser = new userdetails({
                email,
                password,
                region,
                shift,

            });
            await newUser.save();
            return res.status(200).json({ message: "User created" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const login = async (req, res) => {

    const { email, password } = req.body; // Correctly destructure only the email field
    try {
        const existingUser = await userdetails.findOne({ email: email, password: password });

        if (!existingUser) {
            return res.status(406).json({ message: "Invalid Email Id or Password" });
        }

        let existingTodaysAttendance = await attendancedetails.findOne({ userId: existingUser._id, loginDate: formattedTodaysDate() })
        // console.log(existingTodaysAttendance,'todays attendance in login 111111111')
        if (!existingTodaysAttendance) {

            const newAttendance = new attendancedetails({
                email: existingUser.email,
                userId: existingUser._id,
                loginDate: formattedTodaysDate(),
                lastLoginedTime: new Date()
            });
             existingTodaysAttendance = await newAttendance.save();
            // console.log(savedAttendance, 'savedAttendance')
        }else {
            // if it exist
          const updatedAttendance=  await attendancedetails.updateOne({ _id: existingTodaysAttendance._id },
            { $set: { lastLoginedTime: new Date() } })
            // console.log(updatedAttendance,'updatedAttendance  in login 333333333')
        }
       

        // console.log(existingTodaysAttendance,'todays attendance in login 2222222222222')
       


        return res.status(200).json({attendanceId:existingTodaysAttendance._id, message: "User Logined Successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}



// update
const logout = async (req, res) => {

    try {
        const { attendanceId } = req.body;
    
        //finding todays attendance record
        const TodaysAttendance = await attendancedetails.findOne({ _id: attendanceId, loginDate: formattedTodaysDate() })
        // console.log(TodaysAttendance, 'TodaysAttendance0000000000000000')
        const logoutTime = Date.now();
        const loginedTime = TodaysAttendance.lastLoginedTime
     
        const timeDifferenceMilliseconds = logoutTime - loginedTime; // Difference in milliseconds
        console.log('&&&&&&&&&&&&&&&')
        const totalTimeSpent = TodaysAttendance.totalTimeSpent ? getTotalTimeSpentAndcalculateTimeDifference(TodaysAttendance.totalTimeSpent,logoutTime, loginedTime) : calculateTimeDifference(timeDifferenceMilliseconds)
        console.log(totalTimeSpent,'totalTimeSpent 1111111111111111111')

        const updatedAttendance = await attendancedetails.updateOne({ _id: attendanceId, loginDate: formattedTodaysDate() },
            { $set: { totalTimeSpent: totalTimeSpent } })
        console.log(updatedAttendance, 'updatedAttendance')
        const TodayAttendance= await attendancedetails.findOne({ _id: attendanceId, loginDate: formattedTodaysDate() })
        
        return res.status(200).json({ message: `you worked ${TodayAttendance.totalTimeSpent} today`  });
    } catch (error) {
        console.log(error,'erorr')
        return res.status(500).json({ message: "Internal Server Error" });
    }



}




module.exports = { register, logout , login };
