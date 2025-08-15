const express = require('express')
const profileRouter = express.Router()
const userAuthCntrl = require('../middlewares/auth')
const profileCntrl = require('../controllers/profile')

profileRouter.get('/profile/view', userAuthCntrl.userAuth, profileCntrl.viewProfile)
profileRouter.patch('/profile/edit', userAuthCntrl.userAuth, profileCntrl.editProfile)
profileRouter.patch('/profile/editPassword', userAuthCntrl.userAuth, profileCntrl.editPassword)

module.exports = profileRouter