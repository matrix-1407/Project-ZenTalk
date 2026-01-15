import { useEffect, useState } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Chat from './components/Chat'
import Auth from './components/Auth'
import History from './components/History'
import { supabase } from './supabaseClient'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inChat, setInChat] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_e, session) => {
        setSession(session)
      })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!session) return <Auth onAuthSuccess={setSession} />

  return (
    <div className="app-root">
      <Header user={session.user} />

      <div style={{ padding: 12 }}>
        <button onClick={() => setShowHistory(true)}>
          View Chat History
        </button>
      </div>

      {showHistory && <History onClose={() => setShowHistory(false)} />}

      <main className="app-main">
        {inChat ? (
          <Chat />
        ) : (
          <Welcome onGetStarted={() => setInChat(true)} />
        )}
      </main>
    </div>
  )
}

export default App
