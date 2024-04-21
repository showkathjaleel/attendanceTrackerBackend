


//loads .env file contents into process.env
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./Routes/router')
require('./DB/connection')


//express server
const attServer = express()

//use cors in server
attServer.use(cors())
//use json parser
attServer.use(express.json())
//use router
attServer.use(router)

const PORT = 3000

//to host attServer: localhost:3000
attServer.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`)
})

//to resolve GET http request to http://localhost:3000/
attServer.get('/', (req, res) => {
    res.send("<h1>Waiting</h1>")
})
