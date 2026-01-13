import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { supabase } from '../supabaseClient'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const [currentUser, setCurrentUser] = useState(null)

  // Get logged-in user once
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user)
    })
  }, [])

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Socket connection
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: 'ZenTalk',
          text: 'ZenTalk server connected',
          time: new Date().toLocaleTimeString(),
        },
      ])
    })

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return () => socket.disconnect()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const sender = currentUser?.email || 'Guest'

    socketRef.current.emit('message', {
      id: Date.now(),
      user: sender,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })

    setInput('')
  }

  return (
    <section className="chat">
      <div className="chat-messages">
        {messages.map((msg) => {
          const isMe = msg.user === currentUser?.email
          const displayName =
            msg.user === 'ZenTalk'
              ? 'ZenTalk'
              : msg.user?.split('@')[0]

          return (
            <div
              key={msg.id}
              className={`chat-message ${isMe ? 'self' : ''}`}
            >
              <div className="chat-meta">
                <strong>{displayName}</strong>
                <span>{msg.time}</span>
              </div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </section>
  )
}

export default Chat
