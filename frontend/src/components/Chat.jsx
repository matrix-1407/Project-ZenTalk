// Chat.jsx
// Final: modern bubbles, Enter to send (Shift+Enter newline), scroll + "new messages" indicator,
// quick send spinner, autofocus, and safe socket handling.

import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { supabase } from '../supabaseClient'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [user, setUser] = useState(null)

  const socketRef = useRef(null)
  const messagesRef = useRef(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  // Helper: are we near bottom of scroll area?
  const isNearBottom = () => {
    const el = messagesRef.current
    if (!el) return true
    const threshold = 200 // px
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    return distanceFromBottom < threshold
  }

  // Load current logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  // Socket connection and listeners
  useEffect(() => {
    const socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected', socket.id)
    })

    // Append incoming message; if user scrolled up show indicator
    socket.on('message', (msg) => {
      setMessages((prev) => {
        const next = [...prev, msg]
        // Scroll behavior handled below (we check near-bottom)
        return next
      })

      // If user is not near bottom, show indicator
      if (!isNearBottom()) {
        setHasNewMessages(true)
      } else {
        // scroll to bottom if near
        requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }))
        setHasNewMessages(false)
      }
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    socket.on('connect_error', (err) => {
      console.error('Socket error', err)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  // Auto-focus the textarea when Chat mounts
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Scroll to bottom when messages change and user is near bottom
  useEffect(() => {
    if (isNearBottom()) {
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }))
      setHasNewMessages(false)
    }
  }, [messages.length])

  const handleSend = () => {
    if (!input.trim() || !user || !socketRef.current) return

    const msg = {
      id: Date.now(),
      user: user.email,
      user_id: user.id,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setIsSending(true)
    socketRef.current.emit('message', msg)
    setInput('')

    // quick simulated send completion
    setTimeout(() => setIsSending(false), 120)

    // ensure we scroll down to the latest message we just sent
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setHasNewMessages(false)
    })
  }

  // Key handling: Enter sends, Shift+Enter inserts newline (do not block Shift+Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // When user manually scrolls, if they reach bottom hide new-message indicator
  const handleScroll = () => {
    if (isNearBottom()) setHasNewMessages(false)
  }

  const disabled = !input.trim() || !user || isSending

  return (
    <section className="chat" aria-label="Chat area">
      <div
        className="chat-messages"
        ref={messagesRef}
        onScroll={handleScroll}
        aria-live="polite"
      >
        {messages.map((m) => {
          const isMe = m.user && user && m.user === user.email
          const displayName = m.user === 'ZenTalk' ? 'ZenTalk' : (m.user?.split('@')?.[0] || 'user')

          return (
            <div key={m.id} className={`chat-message ${isMe ? 'self' : ''}`}>
              <div className="chat-meta">
                <strong>{displayName}</strong>
                <span className="chat-time">{m.time}</span>
              </div>
              <div className="chat-bubble">{m.text}</div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {hasNewMessages && (
        <button
          type="button"
          className="new-messages-indicator"
          onClick={() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
            setHasNewMessages(false)
          }}
          aria-label="Scroll to newest messages"
        >
          New messages
        </button>
      )}

      <form className="chat-input-bar" onSubmit={(e) => { e.preventDefault(); handleSend() }}>
        <textarea
          ref={textareaRef}
          className="chat-input"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          aria-label="Type a message"
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={disabled}
          aria-label="Send message"
        >
          {isSending && <span className="chat-send-spinner" aria-hidden="true" />}
          <span>Send</span>
        </button>
      </form>
    </section>
  )
}

export default Chat
