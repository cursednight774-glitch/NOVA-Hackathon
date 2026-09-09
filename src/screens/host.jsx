// src/screens/Host.jsx host a new activity card.
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createActivity } from "../api.js"
import { AppBar, BackIcon } from "../components.jsx"

const CATEGORIES = [
  { key: "sport", label: "Sport" },
  { key: "study", label: "Study" },
  { key: "social", label: "Social" },
]

export default function Host() {
  const nav = useNavigate()
  const [category, setCategory] = useState("sport")
  const [title, setTitle] = useState("")
  const [venue, setVenue] = useState("")
  const [meetingPoint, setMeetingPoint] = useState("")
  const [capacity, setCapacity] = useState(4)
  const [startsAt, setStartsAt] = useState("")
  const [durationMins, setDurationMins] = useState(60)
  const [image, setImage] = useState("")
  const [msg, setMsg] = useState("")

  async function onSubmit(e) {
    e.preventDefault()
    if (!title || !venue || !startsAt) {
      return setMsg("Title, venue, and start time are required.")
    }
    const start = new Date(startsAt)
    const end = new Date(start.getTime() + durationMins * 60000)

    const res = await createActivity({
      category,
      title,
      venue,
      meetingPoint,
      capacity: Number(capacity),
      startsAt: start,
      endsAt: end,
      image,
    })

    if (res?.error) setMsg(res.error)
    else nav(`/a/${res.id}`)
  }

  return (
    <>
      <AppBar title="Host activity" left={<BackIcon />} />
      <div className="page">
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label>Category</label>
            <div className="chips" style={{ padding: 0 }}>
              {CATEGORIES.map(c => (
                <button
                  type="button"
                  key={c.key}
                  className={`chip ${category === c.key ? "on" : ""}`}
                  onClick={() => setCategory(c.key)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Badminton 2v2"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="two">
            <div className="field">
              <label>Venue</label>
              <input
                type="text"
                placeholder="e.g. Indoor Court"
                value={venue}
                onChange={e => setVenue(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Meeting point</label>
              <input
                type="text"
                placeholder="e.g. Gate 2"
                value={meetingPoint}
                onChange={e => setMeetingPoint(e.target.value)}
              />
            </div>
          </div>

          <div className="two">
            <div className="field">
              <label>Spots (capacity)</label>
              <input
                type="number"
                min="2"
                max="50"
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Duration (mins)</label>
              <input
                type="number"
                step="15"
                min="15"
                value={durationMins}
                onChange={e => setDurationMins(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Start time</label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={e => setStartsAt(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Cover image URL (optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={image}
              onChange={e => setImage(e.target.value)}
            />
          </div>

          {msg && <p className="muted" style={{ color: "var(--warn)" }}>{msg}</p>}

          <button className="btn" type="submit">Publish activity</button>
        </form>
      </div>
    </>
  )
}
