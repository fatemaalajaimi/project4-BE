const User = require('../models/User')
const Job = require('../models/Job')
const Application = require('../models/Application')
const router = require('express').Router()
const { verifyToken } = require('../middleware/jwtUtils')

// Apply for a Job
router.post('/apply/:jobId/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(403).json({ error: 'User does not exist' })
    }

    req.body.UserId = req.params.userId
    req.body.jobId = req.params.jobId

    const newApplication = await Application.create(req.body)
    res.status(201).json(newApplication)
  } catch (error) {
    res.status(400).json({ error: error.message })
    console.log(error)
  }
})

// count number of applications for a specific job
router.get('/applicationcount/:jobId', async (req, res) => {
  try {
    const Count = await Application.countDocuments({
      jobId: req.params.jobId
    })

    return res.status(200).json({ count: Count })
  } catch (error) {
    console.error('Error while counting pharmacies:', error)
    return res
      .status(500)
      .json({ message: 'Something went wrong while counting pharmacies.' })
  }
})

// Get job applications for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId })
      .populate('userId')
      .populate('jobId')
      .sort({ createdAt: -1 })

    // console.log(applications)
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get job applications for a specific job
router.get('/job/:jobId', async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId')
      .populate('jobId')
      .sort({ createdAt: -1 })

    const transformedApplications = applications.map((application) => ({
      _id: application._id,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      userId_username: application.userId.username,
      userId_Id: application.userId._id
    }))

    console.log(transformedApplications)
    res.status(200).json(transformedApplications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
