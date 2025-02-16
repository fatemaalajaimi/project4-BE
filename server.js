const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const authRouter = require('./controllers/auth')
const userRouter = require('./controllers/user')
const postRouter = require('./controllers/post')
const jobRouter = require('./controllers/job')
const applicationRouter = require('./controllers/application')
const { verifyToken } = require('./middleware/jwtUtils')
dotenv.config()

const app = express()
app.use(express.static('public'))
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Routes
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/job', jobRouter)
app.use('/application', applicationRouter)

// Database Connection
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// Start Server
app.listen(4000, () => console.log('Server running...'))
