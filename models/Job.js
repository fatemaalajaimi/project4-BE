const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)
jobSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    delete returnedObj._id
    delete returnedObj.__v
  }
})
const Job = mongoose.model('Job', jobSchema)
module.exports = Job
