import { useQuery } from '@tanstack/react-query'
import { http } from '../api/http'
import { useState } from 'react'

export default function LeaderboardsPage() {
  const [tab, setTab] = useState('users')
  const [period, setPeriod] = useState('all')

  const { data } = useQuery({
    queryKey: ['lb', tab, period],
    queryFn: async () => {
      const url = tab === 'users'
        ? `/leaderboard/users?period=${period}&limit=10`
        : `/leaderboard/topics?period=${period}&limit=10`
      return (await http.get(url)).data
    }
  })

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <button onClick={()=>setTab('users')} disabled={tab==='users'}>Users</button>
        <button onClick={()=>setTab('topics')} disabled={tab==='topics'}>Topics</button>
        <select value={period} onChange={e=>setPeriod(e.target.value)}>
          <option value="all">All</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <ol>
        {data?.items?.map((it, i) => (
          <li key={it._id} style={{ marginBottom:8 }}>
            {tab==='users'
              ? <span>{i+1}. {it.name} — score {it.popularityScore} (resp {it.responsesCount}, up {it.upvotesReceived})</span>
              : <span>{i+1}. {it.title} — score {it.popularityScore} (resp {it.responsesCount}, up {it.upvotesCount})</span>}
          </li>
        ))}
      </ol>
    </div>
  )
}
