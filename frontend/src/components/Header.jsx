import React from 'react'

function Header({ isAuthenticated, onSignOut }) {
  return (
    <header className="app-header">
      <div className="app-logo">ZenTalk</div>
      {isAuthenticated && (
        <button
          className="header-button signout-button"
          type="button"
          onClick={onSignOut}
        >
          Sign Out
        </button>
      )}
    </header>
  )
}

export default Header
