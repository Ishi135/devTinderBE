const User = require('../models/user');

// API - GET all users from the database to show on the feed
const profile = async (req, res) => {
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
}

module.exports = {
  profile
}