const ConnectionRequest = require("../models/connections")
const User = require("../models/user")
const { requestStatus } = require('../constants')

const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).send('User not found');
    }
    const allowedStatus = [requestStatus.ignore, requestStatus.interested]
    if (!allowedStatus.includes(status))
      return res.status(400).json({
        message: 'Invalid status'
      })

    // use PRE mongoose method for this
    // if (fromUserId.toString() == toUserId.toString()) {
    //   throw new Error('Cannot send a connection request to yourself')
    // }

    const exixtingConnection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })
    if (exixtingConnection)
      return res.status(400).json({
        message: 'Connection Request already exists'
      })
    const connectionRequest = new ConnectionRequest({
      fromUserId, toUserId, status
    })
    const data = await connectionRequest.save()

    res.json({
      data,
      message: `${req.user.firstName} has sent the connection request to ${toUserId}`
    })
  }
  catch (error) {
    res.status(400).send('Error ' + (error.message || error))
  }
}

const reviewRequest = async (req, res) => {
  try {
    const loggedInUser = req.user
    const { status, requestId } = req.params

    const allowedStatus = ['accepted', 'rejected']
    if (!allowedStatus.includes(status)) {
      throw new Error('Status is not valid')
    }
    const connectionRequest = await ConnectionRequest.findOne({ _id: requestId, toUserId: loggedInUser._id, status: "interested" })
    if (!connectionRequest)
      return res.status(400).json({ message: 'connection Request is not found' })
    connectionRequest.status = status
    const data = await connectionRequest.save()
    res.json({ data, message: 'Connection Request ' + status })
  }
  catch (err) {
    res.status(400).send('ERROR ' + (err.message || err))
  }
}

module.exports = {
  sendRequest,
  reviewRequest
}