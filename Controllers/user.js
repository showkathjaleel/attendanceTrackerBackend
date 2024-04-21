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

    console.log(todaysDate,'todaysDate')
  
    return todaysDate;
}

function calculateTimeDifference(logoutTime, loginedTime) {
    const timeDifferenceMilliseconds = logoutTime - loginedTime; // Difference in milliseconds
    const hours = Math.floor(timeDifferenceMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifferenceMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifferenceMilliseconds % (1000 * 60)) / 1000);


    const timediff = `${hours} hours, ${minutes} minutes, ${seconds} seconds`
    console.log(timediff, 'timediff');
    return timediff
}

// Register
const register = async (req, res) => {

    const { email, region, shift, password } = req.body; // Correctly destructure only the email field

    try {
        const existingUser = await userdetails.findOne({ email: email, password: password });
        console.log(existingUser);
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
        console.log(formattedTodaysDate(), 'formattedTodaysDate')
        console.log(existingUser.userId, 'userId')

        // check whether user is logined today
        // const existingTodaysAttendance = await attendancedetails.findOne({ userId: existingUser._id, loginDate: formattedTodaysDate() })
        // console.log(existingTodaysAttendance,'existingTodaysAttendance')

        // if (!existingTodaysAttendance) {

        //     const newAttendance = new attendancedetails({
        //         userId: existingUser._id,
        //         loginDate: formattedTodaysDate(),
        //         firstLoginTime: new Date()
        //     });
        //     const savedAttendance = await newAttendance.save();
        //     console.log(savedAttendance, 'savedAttendance')
        // }


        let existingTodaysAttendance = await attendancedetails.findOne({ userId: existingUser._id, loginDate: formattedTodaysDate() })

        if (!existingTodaysAttendance) {

            const newAttendance = new attendancedetails({
                userId: existingUser._id,
                loginDate: formattedTodaysDate(),
                firstLoginTime: new Date()
            });
             existingTodaysAttendance = await newAttendance.save();
            // console.log(savedAttendance, 'savedAttendance')
        }
        console.log(existingTodaysAttendance,'existingTodaysAttendance1111111111111111')


        return res.status(200).json({attendanceId:existingTodaysAttendance._id, message: "User Logined Successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}



// update
const logout = async (req, res) => {

    // const { email } = req.body;
    try {
        const { userId, attendanceId } = req.body;
        console.log(attendanceId, 'attendance id in logout')

        //finding todays attendance record
        const TodaysAttendance = await attendancedetails.findOne({ _id: attendanceId, loginDate: formattedTodaysDate() })
        console.log(TodaysAttendance, 'TodaysAttendance')
        const logoutTime = Date.now();
        const loginedTime = TodaysAttendance.firstLoginTime

        const updatedAttendance = await attendancedetails.updateOne({ _id: attendanceId, loginDate: formattedTodaysDate() },
            { $set: { totalTimeSpent: calculateTimeDifference(logoutTime, loginedTime) } })
        console.log(updatedAttendance, 'updatedAttendance')
        const TodayAttendance= await attendancedetails.findOne({ _id: attendanceId, loginDate: formattedTodaysDate() })
        
        return res.status(200).json({ message: `you worked ${TodayAttendance.totalTimeSpent} today`  });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }



}




module.exports = { register, logout , login };
