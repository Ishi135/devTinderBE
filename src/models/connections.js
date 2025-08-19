// enum helps to restrict the values of the status field to only 'ignore', 'accepted', or 'rejected'.
const { default: mongoose } = require('mongoose')
const moongose = require('mongoose')

const connectionSchema = new moongose.Schema({
  fromUserId: {
    type: moongose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: moongose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['ignore', 'interested', 'accepted', 'rejected'],
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
