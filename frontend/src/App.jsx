import React, { useState } from 'react'
import Header from './components/Header.jsx'
import Welcome from './components/Welcome.jsx'
import Chat from './components/Chat.jsx'

// TODO: connect to backend socket server here when backend ready

function App() {
  const [inChat, setInChat] = useState(false)

  const handleGetStarted = () => {
    setInChat(true)
  }

  return (
    <div className="app-root">
      <Header />
      <main className="app-main">
        {inChat ? <Chat /> : <Welcome onGetStarted={handleGetStarted} />}
      </main>
    </div>
  )
}

export default App
