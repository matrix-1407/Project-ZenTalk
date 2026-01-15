// History.jsx
// Final: modal-style history panel with backdrop, Esc to close, and accessible close button.

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function History({ onClose }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('email, content, created_at')
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data) {
        setMessages(data)
      } else if (error) {
        console.error('Error loading history', error)
      }
      setLoading(false)
    }

    loadHistory()
  }, [])

  // Close on Esc
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Click backdrop to close
  return (
    <div className="history-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="history-panel" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h3 id="history-title" className="history-title">Chat History (last 20)</h3>
          <button
            type="button"
            className="history-close-button"
            onClick={onClose}
            aria-label="Close history"
          >
            ×
          </button>
        </div>

        <div className="history-body">
          {loading && <p>Loading history...</p>}

          {!loading && messages.length === 0 && <p>No messages yet.</p>}

          {!loading && messages.length > 0 && (
            <div>
              {messages.map((m, i) => {
                const displayName = m.email?.split('@')?.[0] || 'user'
                const ts = new Date(m.created_at).toLocaleString()
                return (
                  <div className="history-item" key={i}>
                    <div className="history-item-meta">
                      <span>{displayName}</span>
                      <span>{ts}</span>
                    </div>
                    <div className="history-item-text">{m.content}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History
