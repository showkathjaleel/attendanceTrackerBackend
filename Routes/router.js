// const express = require('express')
// const user = require('../Controllers/user')
// const router = new express.Router()
// //register api
// router.post('/register',user.register)
// //export
// module.exports = router

const express = require('express')
const user = require('../Controllers/user')
const router = new express.Router()

//register api
router.post('/register', user.register)
router.post('/login', user.login)
router.post('/logout', user.logout)

//export
module.exports = router



