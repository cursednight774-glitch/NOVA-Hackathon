import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadMe } from './api.js'

// Work out who's signed in BEFORE the first render. Without this,
// every screen loads thinking nobody is logged in.
loadMe().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})