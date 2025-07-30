const express = require('express')
const app = express();
const connectDb = require('./config/database')
const User = require('./models/user');


app.use(express.json());

app.post('/signup', async(req, res) => {

  //  Creating new instance of User model
  const user = new User(req.body);
  try{
    // It's a promise
    await user.save();
    res.send('User signed up successfully')
  }
  catch(err){
    console.error(err);
    res.status(500).send('Error signing up user '+err.message);
  }
})

// API - GET all users from the database to show on the feed
app.get('/users', async(req, res) => {

  try{
    const users = await User.find({})
    if(users.length == 0) {
      return res.status(404).send('No users found');
    }else{
      res.send(users)
    }
  }
  catch(err){
    console.error(err);
    res.status(500).send('Error getting users data '+err.message);
  }
})

// API - Delete a user by ID
app.delete('/delete', async(req, res) => {
  const id = req.query.id
  if(!id) {
    return res.status(400).send('User ID is required');
  }
  try{
    await User.findByIdAndDelete(id)
    res.send('User deleted successfully');
  }
  catch(err){
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