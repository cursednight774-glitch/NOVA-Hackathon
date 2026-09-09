// src/main.jsx — the entry point. Order matters: theme.css before app.css.

import React from "react"
import ReactDOM from "react-dom/client"
import "./theme.css"
import "./App.css"
import App from "./App.jsx"
import { loadMe } from "./api.js"

// Work out who's signed in BEFORE the first render. If we render first,
// every screen loads with ME = null and thinks nobody is logged in.
loadMe().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
