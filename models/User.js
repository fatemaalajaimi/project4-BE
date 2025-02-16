const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    accountType: {
      type: String,
      required: true
      // default: 'personal'
    },
    about: {
      type: String,
      required: false
    },
    image: {
      type: String,
      required: true,
      default: '/public/profile/default.png'
    }
  },
  {
    timestamps: false
  }
)
userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    delete returnedObj._id
    delete returnedObj.__v
  }
})
const User = mongoose.model('User', userSchema)
module.exports = User
