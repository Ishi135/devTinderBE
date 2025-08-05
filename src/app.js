const express = require('express')
const app = express();
const connectDb = require('./config/database')
const User = require('./models/user');
const validateParams = require('./utils/validations');
const bcrypt = require('bcrypt');
const validator = require('validator')
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());  //  used to parse cookie otherwise gets undefined
// app.use(userAuth)

// API - User signup
app.post('/signup', async (req, res) => {

  // Validate request body
  try {
    const invalidParam = validateParams(req);
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
    // Creating new instance of User model
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    const user = new User({ firstName, lastName, email, password: passwordHash, interests });
    await user.save();
    res.send('User signed up successfully')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Error : ' + err.message);
  }
})

// API - User login
app.post('/login', async (req, res) => {
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

    // Compare password with the stored hashed password Using bcrypt
    const isPasswordValid = await user.validatePassword(password)
    // const isPasswordValid = await bcrypt.compare(password, user.password);
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
    res.status(400).send('Error logging in: ' + err.message);
  }
})

// API - GET all users from the database to show on the feed
app.get('/users', userAuth, async (req, res) => {
  try {
    const email = req.query.email
    const users = await User.findOne({ email })
    if (users.length == 0) {
      return res.status(404).send('No users found');
    } else {
      res.send(users)
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Error getting users data ' + err.message);
  }
})

// API - Delete a user by ID
app.delete('/delete', async (req, res) => {
  const id = req.query.id
  if (!id) {
    return res.status(400).send('User ID is required');
  }
  try {
    await User.findByIdAndDelete(id)
    res.send('User deleted successfully');
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Error deleting the user');
  }
})

// API - Update user data by ID
app.patch('/updateUserData', async (req, res) => {
  const id = req.query.id;
  const updatedValues = { ...req.body };

  // If interests is present, remove duplicates
  if (Array.isArray(updatedValues.interests)) {
    updatedValues.interests = [...new Set(updatedValues.interests)];
  }

  try {
    await User.findByIdAndUpdate(id, updatedValues);
    res.send('User updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error while updating users data');
  }
});

app.use('/', (err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Something went wrong!');
})

connectDb()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    })
  }).catch(() => {
    console.error('Database connection failed');
  })