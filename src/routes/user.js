const express = require('express')
const userRouter = express.Router()
const userAuthCntrl = require("../middlewares/auth")
const userCntrl = require('../controllers/user')

userRouter.get('/requests/received', userAuthCntrl.userAuth, userCntrl.getAllRequests)

module.exports = userRouter