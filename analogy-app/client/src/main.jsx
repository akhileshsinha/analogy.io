import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import TopicsPage from './pages/TopicsPage.jsx'
import TopicDetailPage from './pages/TopicDetailPage.jsx'
import NewTopicPage from './pages/NewTopicPage.jsx'
import LeaderboardsPage from './pages/LeaderboardsPage.jsx'
import './index.css'

const qc = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <TopicsPage /> },
      { path: 'topics/new', element: <NewTopicPage /> },
      { path: 'topics/:id', element: <TopicDetailPage /> },
      { path: 'leaderboards', element: <LeaderboardsPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
