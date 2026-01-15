// Header.jsx
// Final: sticky polished header that shows app title, history button, email prefix and sign-out action.

import { supabase } from '../supabaseClient'

function Header({ user, onSignOut, onHistoryClick }) {
  // Prefer parent-provided sign-out handler; otherwise use Supabase signOut
  const handleSignOut = async () => {
    if (typeof onSignOut === 'function') {
      await onSignOut()
      return
    }
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Sign out error', err)
    } finally {
      window.location.reload()
    }
  }

  const email = user?.email || ''
  const emailPrefix = email.split('@')[0] || ''

  return (
    <header className="app-header" role="banner">
      <div className="app-logo">ZenTalk</div>

      <div className="header-user" role="navigation" aria-label="User controls">
        <button
          type="button"
          className="header-button"
          onClick={() => typeof onHistoryClick === 'function' ? onHistoryClick() : null}
          aria-label="Open chat history"
        >
          History
        </button>

        {user && (
          <>
            <span
              className="user-email"
              title={email}
              aria-label={`Signed in as ${email}`}
            >
              {emailPrefix}
            </span>

            <button
              type="button"
              className="signout-button"
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
