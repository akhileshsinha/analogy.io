import { useMutation, useQueryClient } from '@tanstack/react-query'
import { http } from '../api/http'
import { useNavigate } from 'react-router-dom'

export default function NewTopicPage() {
  const nav = useNavigate()
  const qc = useQueryClient()

  const createTopic = useMutation({
    mutationFn: (body) => http.post('/topics', body),
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: ['topics'] })
      nav(`/topics/${data._id}`)
    }
  })

  return (
    <form style={{ display:'grid', gap:8, maxWidth:700 }} onSubmit={(e)=>{
      e.preventDefault()
      const f = new FormData(e.currentTarget)
      const body = {
        title: f.get('title'),
        description: f.get('description'),
        category: f.get('category'),
        purposes: String(f.get('purposes')||'').split(',').map(s=>s.trim()).filter(Boolean),
      }
      createTopic.mutate(body)
    }}>
      <input name="title" placeholder="Title" required />
      <textarea name="description" rows={4} placeholder="Description (optional)" />
      <input name="category" placeholder="Category" />
      <input name="purposes" placeholder="Purposes (csv e.g., teaching,interview-prep)" />
      <button disabled={createTopic.isPending}>Create Topic</button>
    </form>
  )
}
