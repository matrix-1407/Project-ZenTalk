// frontend/src/components/Auth.jsx
import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let result
      if (isSignup) {
        result = await supabase.auth.signUp({ email, password })
      } else {
        result = await supabase.auth.signInWithPassword({ email, password })
      }

      const { data, error } = result

      if (error) {
        setError(error.message)
      } else if (!data.session) {
        setError('Please check your email to confirm your account, then sign in.')
      } else {
        onAuthSuccess(data.session)
      }
    } catch (err) {
      console.error('Auth submit error:', err)
      setError('Unexpected authentication error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-app-name">ZenTalk</h1>
        <h2 className="auth-title">{isSignup ? 'Create account' : 'Sign in to ZenTalk'}</h2>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="Password (min 6 chars)"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="auth-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="auth-toggle-button"
            onClick={() => {
              setIsSignup(!isSignup)
              setError(null)
            }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Auth
