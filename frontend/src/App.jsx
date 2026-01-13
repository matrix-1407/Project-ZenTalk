import { useEffect, useState } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Chat from './components/Chat'
import Auth from './components/Auth'
import { supabase } from './supabaseClient'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inChat, setInChat] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error during sign-out:', error)
    } finally {
      setSession(null)
      setInChat(false)
    }
  }

  if (loading) {
    return <div className="loading-screen">Loading…</div>
  }

  if (!session) {
    return <Auth onAuthSuccess={setSession} />
  }

  return (
    <div className="app-root">
      <Header isAuthenticated={!!session} onSignOut={handleSignOut} />
      <main className="app-main">
        {inChat ? (
          <Chat session={session} />
        ) : (
          <Welcome onGetStarted={() => setInChat(true)} />
        )}
      </main>
    </div>
  )
}

export default App
