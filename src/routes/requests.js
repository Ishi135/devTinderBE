const express = require('express')
const requestRouter = express.Router()
const userAuthCntrl = require('../middlewares/auth')
const requestCntrl = require('../controllers/request')

requestRouter.post('/request/send/:status/:toUserId', userAuthCntrl.userAuth, requestCntrl.sendRequest)
requestRouter.post('/request/review/:status/:requestId', userAuthCntrl.userAuth, requestCntrl.reviewRequest)

module.exports = requestRouter