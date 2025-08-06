const express = require('express')
const profileRouter = express.Router()
const userAuthCntrl = require('../middlewares/auth')
const profileCntrl = require('../controllers/profile')

profileRouter.get('/profile', userAuthCntrl.userAuth, profileCntrl.profile)

module.exports = profileRouter