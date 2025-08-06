const express = require('express')
const authRouter = express.Router()
const authCntrl = require('../controllers/auth')

authRouter.post('/signup', authCntrl.signup)
authRouter.post('/login', authCntrl.login)
// authRouter.post('/logout', authCntrl.logout)

module.exports = authRouter