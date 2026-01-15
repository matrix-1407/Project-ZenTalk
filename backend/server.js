require('dotenv').config()

const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const { createClient } = require('@supabase/supabase-js')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

// Supabase service role (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.emit('server:hello', { message: 'ZenTalk connected' })

  socket.on('message', async (msg) => {
    try {
      // Save message
      const { error } = await supabase.from('messages').insert({
        user_id: msg.user_id,
        email: msg.user,
        content: msg.text,
      })

      if (error) {
        console.error('DB insert error:', error)
        return
      }

      // Broadcast to all clients
      io.emit('message', msg)
    } catch (err) {
      console.error('Socket message error:', err)
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`ZenTalk backend running on port ${PORT}`)
})
