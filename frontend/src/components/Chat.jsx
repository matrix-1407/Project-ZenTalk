// frontend/src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

// TODO: replace mock messages with messages from backend socket
// TODO: socket integration: send auth token in handshake when auth is ready
// e.g. io(BACKEND_URL, { auth: { token: '<token>' } })

const initialMessages = [
  { id: 1, user: 'Clove', text: 'Welcome to ZenTalk 👋', time: '10:00' },
  { id: 2, user: 'Shubham', text: 'This is a mock conversation.', time: '10:01' },
  { id: 3, user: 'You', text: 'Looks clean and simple.', time: '10:02' },
  { id: 4, user: 'Clove', text: 'Sockets and Supabase coming soon.', time: '10:03' },
]

function Chat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  // scroll to bottom helper
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Backend URL from Vite env or fallback to localhost
    const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

    // Connect
    const socket = io(BACKEND, {
      // TODO: when using auth, send token in auth: { token }
      // auth: { token: session?.access_token }
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('server:hello', (payload) => {
      console.log('server:hello', payload)
      // Optionally append server hello as a message
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          user: 'ZenTalk',
          text: payload?.message || 'server hello',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    })

    socket.on('message', (msg) => {
      // Expect msg to be an object { id?, user, text, time? }
      setMessages((prev) => [...prev, msg])
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connect_error:', err)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

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

    // If socket connected, emit to server
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('message', nextMessage)
    } else {
      // Fallback: if not connected, just update UI locally
      setMessages((prev) => [...prev, nextMessage])
    }

    setInput('')
  }

  return (
    <section className="chat">
      <div className="chat-messages" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.user === 'You' ? 'chat-message--self' : ''}`}
            style={{ marginBottom: '8px' }}
          >
            <div className="chat-message-meta" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span className="chat-message-user" style={{ fontWeight: 700 }}>{msg.user}</span>
              <span className="chat-message-time" style={{ color: '#9fb7cc' }}>{msg.time}</span>
            </div>
            <div className="chat-message-text" style={{ marginTop: '4px' }}>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-bar" onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#e6eef9' }}
        />
        <button type="submit" className="chat-send-button" style={{ padding: '10px 14px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none' }}>
          Send
        </button>
      </form>
    </section>
  )
}

export default Chat
