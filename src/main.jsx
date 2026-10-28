import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// The site routes by hash ("#/planner"). A path link like /presentations is
// turned into its hash route before the app reads the URL. On static hosts
// public/presentations/index.html does the same for a fresh page load.
const PATH_ROUTES = { '/presentations': '#/presentations' }
const pathRoute = PATH_ROUTES[window.location.pathname.replace(/\/+$/, '')]
if (pathRoute) window.history.replaceState(null, '', '/' + pathRoute)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
