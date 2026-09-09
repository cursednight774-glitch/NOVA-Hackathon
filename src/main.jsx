// src/main.jsx — the entry point. Order matters: theme.css before app.css.

import React from "react"
import ReactDOM from "react-dom/client"
import "./theme.css"
import "./app.css"
import App from "./App.jsx"
import { loadMe } from "./api.js"

const root = ReactDOM.createRoot(document.getElementById("root"))

// Show something immediately instead of a blank page while we work out
// who's logged in — loadMe() below still has to finish before the real
// app can render (it needs to know if ME is set).
root.render(
  <div className="bootload">
    <span className="spin" />
  </div>
)

// Work out who's signed in BEFORE the first render. If we render first,
// every screen loads with ME = null and thinks nobody is logged in.
loadMe().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
