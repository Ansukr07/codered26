import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
)
if (root.hasChildNodes() && !window.location.hash.startsWith('#/')) hydrateRoot(root, app)
else createRoot(root).render(app)
