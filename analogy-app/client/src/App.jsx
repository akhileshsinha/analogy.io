import { Link, Outlet, useNavigate } from 'react-router-dom'
import { setDevUser } from './api/http'
import DevUserBar from './components/DevUserBar'


export default function App() {
  const nav = useNavigate()
  // (Optional) set once with a valid user id from your backend
  // setDevUser('PASTE_USER_ID_HERE')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
            <DevUserBar />

      <header style={{ display:'flex', gap:16, alignItems:'center', marginBottom:16 }}>
        <h2 style={{ marginRight:'auto' }}>Analogies</h2>
        <Link to="/">Topics</Link>
        <Link to="/topics/new">New Topic</Link>
        <Link to="/leaderboards">Leaderboards</Link>
      </header>
      <Outlet />
    </div>
  )
}
