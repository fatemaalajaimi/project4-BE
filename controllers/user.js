const User = require('../models/User')
const router = require('express').Router()
const { verifyToken } = require('../middleware/jwtUtils')

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const userInfo = {
      _id: user._id,
      password: user.password,
      accountType: user.accountType,
      about: user.about,
      image: user.image
    }

    return res.status(201).json(userInfo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

// Get user by ID
router.get('/:accountId', async (req, res) => {
  try {
    const user = await User.findById(req.params.accountId)
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
