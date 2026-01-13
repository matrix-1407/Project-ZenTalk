const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
// const { createClient } = require('@supabase/supabase-js') // TODO: initialize Supabase client when ready

// Validate required environment variables for Supabase
const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
const missing = requiredEnv.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error(
    `Missing required environment variables: ${missing.join(', ')}.\n` +
      'Create a .env file based on .env.example and restart the server.'
  )
  process.exit(1)
}

const PORT = process.env.PORT || 5000

const app = express()

app.use(
  cors({
    origin: '*', // TODO: restrict allowed origins in production
  })
)

app.use(express.json())

// TODO: initialize Supabase client with service role key for persistence

app.get('/', (req, res) => {
  res.type('text/plain').send('ZenTalk server running')
})

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*', // TODO: restrict allowed origins in production
    methods: ['GET', 'POST'],
  },
})

// TODO: verify Supabase access token during handshake and attach user info
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.emit('server:hello', { message: 'hello from ZenTalk server' })

  socket.on('message', (payload) => {
    // TODO: persist to Supabase
    io.emit('message', payload)
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

server.listen(PORT, () => {
  console.log(`ZenTalk server listening on port ${PORT}`)
})
