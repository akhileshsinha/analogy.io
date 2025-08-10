import { useQuery } from '@tanstack/react-query'
import { http } from '../api/http'
import { Link, useSearchParams } from 'react-router-dom'

function useTopics(params) {
  return useQuery({
    queryKey: ['topics', params.toString()],
    queryFn: async () => {
      const { data } = await http.get(`/topics?${params.toString()}`)
      return data
    },
    keepPreviousData: true,
  })
}

export default function TopicsPage() {
  const [sp, setSp] = useSearchParams({
    q: '', category: '', purposes: '', sort: 'popularityScore', order: 'desc', page: '1', limit: '10'
  })

  const { data, isLoading } = useTopics(sp)

  const onChange = (e) => setSp(prev => {
    const p = new URLSearchParams(prev)
    p.set(e.target.name, e.target.value)
    p.set('page','1')
    return p
  })

  return (
    <div>
      <form style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8, marginBottom:12 }}>
        <input name="q" placeholder="Search title/description" defaultValue={sp.get('q')||''} onChange={onChange} />
        <input name="category" placeholder="Category" defaultValue={sp.get('category')||''} onChange={onChange} />
        <input name="purposes" placeholder="purposes (csv)" defaultValue={sp.get('purposes')||''} onChange={onChange} />
        <select name="sort" defaultValue={sp.get('sort')||'popularityScore'} onChange={onChange}>
          <option value="popularityScore">Popularity</option>
          <option value="responsesCount">Responses</option>
          <option value="createdAt">Created</option>
        </select>
      </form>

      {isLoading && <p>Loading…</p>}
      {data?.items?.map(t => (
        <div key={t._id} style={{ padding:12, border:'1px solid #ddd', borderRadius:8, marginBottom:8 }}>
          <Link to={`/topics/${t._id}`}><strong>{t.title}</strong></Link>
          <div style={{ fontSize:12, color:'#555' }}>
            <span>Category: {t.category || '-'}</span> · <span>Responses: {t.responsesCount}</span> · <span>Pop: {t.popularityScore}</span>
          </div>
        </div>
      ))}

      {data && (
        <div style={{ display:'flex', gap:8, marginTop:8 }}>
          <button disabled={Number(sp.get('page')||1) <= 1}
            onClick={() => setSp(p => { const q=new URLSearchParams(p); q.set('page', String(Number(q.get('page')||1)-1)); return q })}>Prev</button>
          <span>Page {data.page} / {Math.ceil(data.total/data.limit)||1}</span>
          <button disabled={data.page * data.limit >= data.total}
            onClick={() => setSp(p => { const q=new URLSearchParams(p); q.set('page', String(Number(q.get('page')||1)+1)); return q })}>Next</button>
        </div>
      )}
    </div>
  )
}
