const mongoose = require('mongoose')

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      required: true,
      default: 'Application submitted'
    }
  },
  {
    timestamps: true
  }
)
ApplicationSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    delete returnedObj._id
    delete returnedObj.__v
  }
})
const Application = mongoose.model('Application', ApplicationSchema)
module.exports = Application
