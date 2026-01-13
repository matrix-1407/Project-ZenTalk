/* ZenTalk Backend Server 
A simple chat server using Express and Socket.io 
*/

const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('ZenTalk server running')
})

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`)

  socket.emit('server:hello', {
    message: 'ZenTalk server connected',
  })

  socket.on('message', (payload) => {
    io.emit('message', {
      user: payload.user || 'Guest',
      text: payload.text,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })
  })

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 ZenTalk backend running on port ${PORT}`)
})
