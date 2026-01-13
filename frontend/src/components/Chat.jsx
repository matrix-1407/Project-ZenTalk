import React, { useState } from 'react'

// TODO: replace mock messages with messages from backend socket
// TODO: socket integration: connect to VITE_BACKEND_URL using socket.io-client, send auth token during handshake
// import { io } from 'socket.io-client'

const initialMessages = [
  { id: 1, user: 'Alex', text: 'Welcome to ZenTalk 44b', time: '10:00' },
  { id: 2, user: 'Jordan', text: 'This is a mock conversation.', time: '10:01' },
  { id: 3, user: 'You', text: 'Looks clean and simple.', time: '10:02' },
  { id: 4, user: 'Alex', text: 'Sockets and Supabase coming soon.', time: '10:03' },
]

function Chat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!input.trim()) return

    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const nextMessage = {
      id: messages.length + 1,
      user: 'You',
      text: input.trim(),
      time,
    }

    setMessages([...messages, nextMessage])
    setInput('')
  }

  return (
    <section className="chat">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.user === 'You' ? 'chat-message--self' : ''}`}
          >
            <div className="chat-message-meta">
              <span className="chat-message-user">{msg.user}</span>
              <span className="chat-message-time">{msg.time}</span>
            </div>
            <div className="chat-message-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="chat-send-button">
          Send
        </button>
      </form>
    </section>
  )
}

export default Chat
