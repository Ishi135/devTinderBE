// enum helps to restrict the values of the status field to only 'ignore', 'accepted', or 'rejected'.
const mongoose = require('mongoose')
const { requestStatus } = require('../constants')

const connectionSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: Object.values(requestStatus),
      message: '{VALUE} is not a valid status'
    }
  }
},
  {
    timestamps: true
  }
)

connectionSchema.index({ fromUserId: 1, toUserId: 1 })

connectionSchema.pre("save", function () {
  if (this.fromUserId.equals(this.toUserId))
    throw new Error('Cannot send a connection request to yourself')
})
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema)
module.exports = ConnectionRequest
