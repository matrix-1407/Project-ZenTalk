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
      }
      setLoading(false)
    }

    loadHistory()
  }, [])

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>Chat History (last 20)</h3>
        <button onClick={onClose}>Close</button>
      </div>

      {loading && <p>Loading history...</p>}

      {!loading && messages.length === 0 && <p>No messages yet.</p>}

      <ul className="history-list">
        {messages.map((m, i) => (
          <li key={i}>
            <strong>{m.email.split('@')[0]}</strong>: {m.content}
            <br />
            <small>
              {new Date(m.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default History
