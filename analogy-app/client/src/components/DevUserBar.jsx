import { useState, useEffect } from 'react'
import { http, setDevUser } from '../api/http'

export default function DevUserBar() {
  const [id, setId] = useState(localStorage.getItem('devUserId') || '')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (id) setDevUser(id)
  }, [id])

  const createUser = async (e) => {
    e.preventDefault()
    if (!name || !email) return
    const { data } = await http.post('/users', { name, email })
    setId(data._id)
    localStorage.setItem('devUserId', data._id)
    setDevUser(data._id)
    setName('')
    setEmail('')
    alert(`Dev user set: ${data.name}`)
  }

  const clearUser = () => {
    localStorage.removeItem('devUserId')
    setId('')
    setDevUser(null)
  }

  return (
    <div style={{ display:'flex', gap:8, alignItems:'center', padding:'6px 0', borderBottom:'1px solid #eee', marginBottom:12 }}>
      <strong>DevUser:</strong>
      {id ? (
        <>
          <code>{id}</code>
          <button onClick={clearUser}>Clear</button>
        </>
      ) : (
        <form onSubmit={createUser} style={{ display:'flex', gap:8 }}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <button type="submit">Create & Use</button>
        </form>
      )}
    </div>
  )
}
