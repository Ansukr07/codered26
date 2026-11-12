import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const initialTeamPage = window.location.pathname.replace(/^\/+|\/+$/g, '') === 'team'
  ? (await import('./TeamPage.jsx')).default
  : undefined
const app = (
  <StrictMode>
    <App initialTeamPage={initialTeamPage} />
    <Analytics />
  </StrictMode>
)
if (root.hasChildNodes() && !window.location.hash.startsWith('#/')) hydrateRoot(root, app)
else createRoot(root).render(app)
