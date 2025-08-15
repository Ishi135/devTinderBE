const validations = require('../utils/validations');

const viewProfile = async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  }
  catch (err) {
    res.status(400).send('Error : ' + (err.message || err));
  }
}

const editProfile = async (req, res) => {
  try {
    if (!validations.validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request")
    }
    const user = req.user
    Object.assign(user, req.body)
    user.save()
    res.json({ data: user, message: `${user.firstName}, your profile has been updated successfully` })
  }
  catch (err) {
    res.status(400).send('Error : ' + (err.message || err));
  }
}

const editPassword = async (req, res) => {
  try {
    const user = req.user
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    const isPasswordValid = await user.validatePassword(oldPassword)
    if (!isPasswordValid)
      throw new Error('Wrong password')
    if (!validator.isStrongPassword(newPassword))
      throw new Error('New password must be strong')
    const passwordHash = await bcrypt.hash(newPassword, 10)
    user.password = passwordHash
    user.save()
    res.cookie("token", null)
    res.json({ data: user, message: `${user.firstName}, your password has been updated successfully` })
  }
  catch (err) {
    res.status(400).send('Error : ' + (err.message || err))
  }
}

module.exports = {
  viewProfile,
  editProfile,
  editPassword
}