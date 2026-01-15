import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { supabase } from '../supabaseClient'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'


function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  useEffect(() => {
    const socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => socket.disconnect()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || !user) return

    socketRef.current.emit('message', {
      id: Date.now(),
      user: user.email,
      user_id: user.id,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })

    setInput('')
  }

  return (
    <section className="chat">
      <div className="chat-messages">
        {messages.map((m) => {
          const isMe = m.user === user?.email
          return (
            <div key={m.id} className={`chat-message ${isMe ? 'self' : ''}`}>
              <div className="chat-meta">
                <strong>{m.user.split('@')[0]}</strong>
                <span>{m.time}</span>
              </div>
              <div className="chat-bubble">{m.text}</div>
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
