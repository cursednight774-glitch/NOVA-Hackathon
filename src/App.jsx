// src/App.jsx — temporary. Your teammate replaces this with the real routes.

import { useEffect, useState } from "react"
import { ME, getActivities } from "./api.js"
import { signOut } from "./auth.js"
import Login from "./screens/Login.jsx"

export default function App() {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    if (ME) getActivities().then(setActivities)
  }, [])

  // main.jsx runs loadMe() before rendering, so ME is already settled here
  if (!ME) return <Login />

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20,
                  fontFamily: "system-ui, sans-serif" }}>
      <button onClick={async () => { await signOut(); window.location.href = "/" }}
              style={{ float: "right", border: "1px solid #DCDCE4", background: "none",
                       borderRadius: 20, padding: "6px 12px", cursor: "pointer" }}>
        Sign out
      </button>

      <h2>Today</h2>

      {activities.length === 0 && <p>Nothing on today.</p>}

      {activities.map(a => (
        <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
          <b>{a.title}</b> — {a.venue} — hosted by {a.host?.name} — {a.joined} going
        </div>
      ))}
    </div>
  )
}