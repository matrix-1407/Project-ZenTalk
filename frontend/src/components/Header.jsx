import { supabase } from '../supabaseClient'

function Header({ user }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <header className="header">
      <h1>ZenTalk</h1>

      {user && (
        <div className="header-user">
          <span className="user-email">{user.email}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </header>
  )
}

export default Header
