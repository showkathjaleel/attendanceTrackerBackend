const mongoose = require('mongoose')

// const connectionString = process.env.CONNECTION_STRING
const connectionString ="mongodb+srv://showkathjaleel456:I9IxsAKuIPFGiZMk@attendance-db.smiaynh.mongodb.net/?retryWrites=true&w=majority&appName=attendance-db"

// mongodb+srv://showkathjaleel456:I9IxsAKuIPFGiZMk@attendance-db.smiaynh.mongodb.net/
//  "mongodb+srv://aishaazeez90:aisha@cluster0.jyljyef.mongodb.net/attendance?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(connectionString).then(()=>{
    console.log("Connected successfully");
}).catch((reason)=>{
    console.log(reason);
    console.log("Connection failed");
})         