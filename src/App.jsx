import { useEffect, useState } from 'react'
import { getActivities } from './api.js'

export default function App() {
  const [activities, setActivities] = useState([])
  useEffect(() => { getActivities().then(setActivities) }, [])

  return (
    <div>
      {activities.map(a => (
        <div key={a.id}>
          <b>{a.title}</b> — {a.venue} — hosted by {a.host.name} — {a.going.length} going
        </div>
      ))}
    </div>
  )
}