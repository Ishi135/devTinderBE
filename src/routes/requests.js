const express = require('express')
const requestRouter = express.Router()
const userAuthCntrl = require('../middlewares/auth')
const requestCntrl = require('../controllers/request')

requestRouter.post('/request/send/:status/:toUserId', userAuthCntrl.userAuth, requestCntrl.sendRequest)

module.exports = requestRouter