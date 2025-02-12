const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    image: {
      type: String
    }
  },
  {
    timestamps: false
  }
)
postSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    delete returnedObj._id
    delete returnedObj.__v
  }
})
const Post = mongoose.model('Post', postSchema)
module.exports = Post
