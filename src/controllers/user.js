const { requestStatus } = require('../constants')
const ConnectionRequest = require('../models/connections')

const getAllRequests = async (req, res) => {
  try {
    const user = req.user
    const data = await ConnectionRequest
      .find({ toUserId: user._id, status: requestStatus.interested })
      // .populate('fromUserId', ['firstName', 'lastName'])
      .populate('fromUserId', 'firstName lastName')
    if (!data) {
      res.json({ data, message: 'No connection found for ' + user.firstName })
    }
    res.json({ data, message: 'Successfully fetched all requests for ' + user.firstName })
  }
  catch (err) {
    res.status(400).send('Error ' + (err.message || err))
  }
}

module.exports = { getAllRequests }