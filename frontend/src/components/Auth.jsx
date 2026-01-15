// frontend/src/components/Auth.jsx
import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'

  const isSignup = mode === 'signup'

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
        setError('Check your email to confirm your account.')
      } else {
        onAuthSuccess(data.session)
      }
    } catch (err) {
      console.error(err)
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className={`auth-card ${isSignup ? 'signup' : 'signin'}`}>
        <p className="auth-app-name">ZENTALK</p>

        <h2 className="auth-title">
          {isSignup ? 'Create your account' : 'Sign in to ZenTalk'}
        </h2>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading
              ? 'Please wait…'
              : isSignup
              ? 'Create account'
              : 'Sign In'}
          </button>
        </form>

        <p className="auth-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="auth-toggle-button"
            onClick={() => {
              setMode(isSignup ? 'signin' : 'signup')
              setError(null)
            }}
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Auth
