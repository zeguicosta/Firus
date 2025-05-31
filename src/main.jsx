import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './index.css'
import Home from './routes/Home'
import Error from './routes/Error'
import Notificacoes from './routes/Notificacoes'
import Chat from './routes/Chat'
import Suporte from './routes/Suporte'
import ReportarIncendio from './routes/ReportarIncendio'

const router = createBrowserRouter ([
  {
    path: '/', element: <App />,
    errorElement: <Error />,

    children: [
      { path: '/', element: <Home /> },
      { path: '/chat', element: <Chat /> },
      { path: '/reportar-incendio', element: <ReportarIncendio /> },
      { path: '/suporte', element: <Suporte /> },
      { path: '/notificacoes', element: <Notificacoes /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
