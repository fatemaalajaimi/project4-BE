const Post = require('../models/Post')
const User = require('../models/User')
const router = require('express').Router()
const { verifyToken } = require('../middleware/jwtUtils')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/posts')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'))
  }
}

const upload = multer({ storage, fileFilter })

// Retrieve all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('accountId')
    res.status(200).json(posts)
    //console.log(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// add a new post
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(403).json({ error: 'User does not exist' })
    }

    req.body.accountId = req.user._id
    req.body.image = `/uploads/posts/${req.file.filename}`

    const newPost = await Post.create(req.body)
    res.status(201).json(newPost)
  } catch (error) {
    res.status(400).json({ error: error.message })
    console.log(error)
  }
})

module.exports = router
