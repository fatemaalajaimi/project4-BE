const User = require('../models/User')
const Job = require('../models/Job')
const Application = require('../models/Application')
const router = require('express').Router()
const { verifyToken } = require('../middleware/jwtUtils')
const multer = require('multer')

// // Retrieve all jobs
// router.get('/', async (req, res) => {
//   try {
//     const jobs = await Job.find()
//     // .populate('companyId').sort({ createdAt: -1 })
//     res.status(200).json(jobs)
//     console.log(jobs)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// // Retrieve all jobs for a specific company
// router.get('/companyJobs', verifyToken, async (req, res) => {
//   try {
//     const jobs = await Job.find({ companyId: req.user._id })
//       .populate('companyId')
//       .populate('companyId')
//       .sort({ createdAt: -1 })

//     res.status(200).json(jobs)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// Retrieve all jobs the user did not apply to
router.get('/notApplied/:userId', async (req, res) => {
  try {
    const jobs = await Job.find().populate('companyId').sort({ createdAt: -1 })

    const applications = await Application.find({
      userId: req.params.userId
    }).select('jobId') // Get only the jobIds the user applied for

    // Extract the jobIds the user applied for
    const appliedJobIds = applications.map((app) => app.jobId.toString())

    // Filter out the jobs that the user has applied to
    const filteredJobs = jobs.filter(
      (job) => !appliedJobIds.includes(job._id.toString())
    )

    const transformedJobs = filteredJobs.map((job) => ({
      _id: job._id, // Convert _id to id
      companyId: job.companyId,
      role: job.role,
      description: job.description,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    }))

    res.status(200).json(transformedJobs) // Send the transformed jobs as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Retrieve all jobs for a specific company
router.get('/companyJobs', verifyToken, async (req, res) => {
  try {
    // Fetch jobs for the company associated with the user
    const jobs = await Job.find({ companyId: req.user._id })
      .populate('companyId') // Populate company details (optional)
      .sort({ createdAt: -1 }) // Sort jobs by creation date

    const transformedJobs = jobs.map((job) => ({
      _id: job._id, // Convert _id to id
      companyId: job.companyId,
      role: job.role,
      description: job.description,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    }))

    res.status(200).json(transformedJobs) // Send the jobs as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message }) // Handle errors
  }
})

// Get job by ID
router.get('/:jobId', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('companyId')
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' })
    }
    res.status(200).json(job)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user || user.accountType !== 'company') {
      return res
        .status(403)
        .json({ error: 'User does not exist or not authorized' })
    }

    req.body.companyId = req.user._id
    const newJob = await Job.create(req.body)
    res.status(201).json(newJob)
  } catch (error) {
    res.status(400).json({ error: error.message })
    console.log(error)
  }
})

module.exports = router
