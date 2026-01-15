// Welcome.jsx
// Final: centered hero with refined headline and CTA animation.

import React from 'react'

function Welcome({ onGetStarted }) {
  return (
    <section className="welcome-container" aria-labelledby="welcome-heading">
      <div className="welcome">
        <p className="welcome-app-name">ZenTalk</p>
        <h1 id="welcome-heading" className="welcome-headline">
          Simple Chat. Powerful Connection.
        </h1>
        <p className="welcome-subheadline">
          ZenTalk lets you connect instantly with people — simple, fast, and always connected.
        </p>
        <button
          className="primary-cta"
          type="button"
          onClick={onGetStarted}
          aria-label="Get started"
        >
          Get Started
        </button>
      </div>
    </section>
  )
}

export default Welcome
