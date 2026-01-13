import React from 'react'

function Welcome({ onGetStarted }) {
  return (
    <section className="welcome-container">
      <div className="welcome">
        <p className="welcome-app-name">ZenTalk</p>
        <h1 className="welcome-headline">Simple Chat. Powerful Connection.</h1>
        <p className="welcome-subheadline">
          ZenTalk lets you connect instantly with people — simple, fast, and always connected.
        </p>
        <button className="primary-cta" type="button" onClick={onGetStarted}>
          Get Started
        </button>
      </div>
    </section>
  )
}

export default Welcome
