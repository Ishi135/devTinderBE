const validations = require('../utils/validations');
const bcrypt = require('bcrypt');
const validator = require('validator')
const User = require('../models/user');

// API - User signup
const signup = async (req, res) => {
  // Validate request body
  try {
    const invalidParam = validations.validateSignUpData(req);
    if (invalidParam) {
      throw {
        message: invalidParam
      }
    }
    const { firstName, lastName, email, password, interests } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists with this email');
    }

    // Encrypt the password using bcrypt
    const passwordHash = await bcrypt.hash(password, 10)
    // Creating new instance of User model
    const user = new User({ firstName, lastName, email, password: passwordHash, interests });
    await user.save();
    res.send('User signed up successfully')
  }
  catch (err) {
    res.status(500).send('Error : ' + (err.message || err));
  }
}

// API - User login
const login = async (req, res) => {
  try {
    // Validate email and password
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send('Invalid email');
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      // Create JWT using user Schema methods
      const token = await user.getJWT();
      res.cookie("token", token)
    } else {
      throw new Error('Invalid credentials');
    }

    // If login is successful, send a success message
    res.send('Login successful')

  }
  catch (err) {
    res.status(400).send('Error logging in: ' + (err.message || err));
  }
}

const logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now())
    }).send("User Logged out successfully")
  }
  catch {
    res.status(400).send('Error logging out: ' + (err.message || err));
  }
}

module.exports = {
  signup,
  login,
  logout
}
