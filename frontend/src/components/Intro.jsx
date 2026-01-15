// Intro.jsx
// One-time animated intro. Calls onDone() when finished or when user clicks Skip.
// Stores a flag in localStorage so intro shows only on first visit.

import { useEffect } from 'react'

export default function Intro({ onDone, duration = 2800 }) {
  useEffect(() => {
    // play intro once then call onDone
    const t = setTimeout(() => {
      try {
        localStorage.setItem('zentalk_seen_intro', '1')
      } catch (e) {
        // ignore storage errors
      }
      onDone && onDone()
    }, duration)

    return () => clearTimeout(t)
  }, [onDone, duration])

  return (
    <div className="intro-backdrop" role="dialog" aria-modal="true" aria-label="Welcome to ZenTalk">
      <div className="intro-card">
        <div className="intro-logo">ZenTalk</div>

        <h2 className="intro-title">Welcome to ZenTalk</h2>
        <p className="intro-sub">Simple Chat. Powerful Connection.</p>

        <div className="intro-visual" aria-hidden="true">
          {/* simple animated dots / bars — purely decorative */}
          <div className="intro-bars">
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </div>
        </div>

        <div className="intro-actions">
          <button
            type="button"
            className="primary-cta"
            onClick={() => {
              try { localStorage.setItem('zentalk_seen_intro', '1') } catch (e) {}
              onDone && onDone()
            }}
            aria-label="Continue to ZenTalk"
          >
            Continue
          </button>

          <button
            type="button"
            className="auth-button"
            onClick={() => {
              try { localStorage.setItem('zentalk_seen_intro', '1') } catch (e) {}
              onDone && onDone()
            }}
            aria-label="Skip intro"
            style={{ marginLeft: 12, opacity: 0.85, background: 'transparent', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
