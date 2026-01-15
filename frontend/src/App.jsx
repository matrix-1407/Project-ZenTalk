// App.jsx
// Shows Intro on first visit, then Welcome. If user clicks Get Started:
//  - if authenticated -> open Chat
//  - if not authenticated -> open Auth modal
// Auth success now opens Chat automatically.

import { useEffect, useState } from 'react'
import Header from './components/Header'
import Welcome from './components/Welcome'
import Chat from './components/Chat'
import Auth from './components/Auth'
import History from './components/History'
import Intro from './components/Intro'
import { supabase } from './supabaseClient'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inChat, setInChat] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    // decide whether to show intro (only first-time)
    const seen = (() => {
      try {
        return localStorage.getItem('zentalk_seen_intro') === '1'
      } catch (e) {
        return false
      }
    })()
    if (!seen) setShowIntro(true)

    // load session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error signing out', err)
    } finally {
      setSession(null)
      setInChat(false)
      setShowAuth(false)
    }
  }

  const handleGetStarted = () => {
    // If user already signed in -> open chat
    if (session && session.user) {
      setInChat(true)
    } else {
      // otherwise, show Auth modal
      setShowAuth(true)
    }
  }

  const handleAuthSuccess = (sessionObject) => {
    // Called by Auth component after successful sign-in/up
    // some Auth implementations return { user, session } or data.session
    // Accept both shapes.
    const userSession = sessionObject?.session || sessionObject
    setSession(userSession)
    setShowAuth(false)
    // after successful sign-in, directly open chat
    setInChat(true)
  }

  // When intro finishes we simply hide it and continue showing Welcome / Auth
  const onIntroDone = () => {
    setShowIntro(false)
  }

  if (loading) return <div className="loading-screen">Loading…</div>

  // Render intro overlay if not seen
  if (showIntro) {
    return <Intro onDone={onIntroDone} />
  }

  return (
    <div className="app-root">
      <Header user={session?.user} onSignOut={handleSignOut} onHistoryClick={() => setShowHistory(true)} />

      {showHistory && <History onClose={() => setShowHistory(false)} />}

      {/* If showAuth is true render Auth as modal/centered card */}
      {showAuth && (
        <div className="auth-modal">
          <Auth onAuthSuccess={handleAuthSuccess} />
        </div>
      )}

      <main className="app-main" role="main">
        {inChat ? (
          <Chat />
        ) : (
          <Welcome onGetStarted={handleGetStarted} />
        )}
      </main>
    </div>
  )
}

export default App
