// src/screens/Host.jsx — the + icon. Full screen, not a modal.

import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { VENUES, createActivity, categoryOf } from "../api.js"
import { AppBar, BackIcon, Poster } from "../components.jsx"

const QUICK_GROUPS = [
  ["sport",  "Sport",  ["Basketball", "Football", "Badminton", "Volleyball", "Evening run"]],
  ["study",  "Study",  ["DSA revision", "Study session", "Project work"]],
  ["social", "Social", ["Club meeting", "Photography walk", "Jam session", "Movie night"]],
]

/** "2026-09-12T16:00" -> Date. Empty string -> null. */
const toDate = v => (v ? new Date(v) : null)

/** A datetime-local value for the next round half hour. */
function defaultStart() {
  const d = new Date(Date.now() + 60 * 60 * 1000)
  d.setMinutes(d.getMinutes() > 30 ? 0 : 30, 0, 0)
  if (d.getMinutes() === 0) d.setHours(d.getHours() + 1)
  return local(d)
}
function local(d) {
  const p = n => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function Host() {
  const nav = useNavigate()
  const [title, setTitle]   = useState("")
  const [venue, setVenue]   = useState("")
  const [point, setPoint]   = useState("")
  const [start, setStart]   = useState(defaultStart())
  const [end, setEnd]       = useState(local(new Date(new Date(defaultStart()).getTime() + 2 * 3600 * 1000)))
  const [cap, setCap]       = useState(10)
  const [strict, setStrict] = useState(false)
  const [cat, setCat]       = useState(null)
  const [busy, setBusy]     = useState(false)

  const category = cat ?? categoryOf(title)
  const ready = title.trim() && venue && start && end && toDate(end) > toDate(start)

  const preview = useMemo(() => ({
    title: title || "Your activity",
    category,
    startsAt: toDate(start) || new Date(),
    endsAt: toDate(end) || new Date(),
    venue: venue || "Pick a venue",
    meetingPoint: point,
    joined: null,
  }), [title, category, start, end, venue, point])

  async function post() {
    if (!ready || busy) return
    setBusy(true)
    const a = await createActivity({
      title: title.trim(),
      category,
      venue,
      meetingPoint: point.trim(),
      startsAt: toDate(start),
      endsAt: toDate(end),
      capacity: Number(cap),
      strictLimit: strict,
    })
    nav(`/a/${a.id}`)
  }

  return (
    <>
      <AppBar title="Host something" left={<BackIcon />} />
      <div className="page">

        <div className="field">
          <label>What are you doing</label>
          <input value={title} onChange={e => { setTitle(e.target.value); setCat(null) }}
                 placeholder="Basketball at Court B" />
        </div>

        {QUICK_GROUPS.map(([key, label, items]) => (
          <details key={key} className="intgroup">
            <summary className="sechead intgroup-head">{label} suggestions</summary>
            <div className="chips">
              {items.map(q => (
                <button key={q} className={`chip ${title === q ? key : ""}`}
                        onClick={() => { setTitle(q); setCat(null) }}>{q}</button>
              ))}
            </div>
          </details>
        ))}

        {/* we guessed a category — let the host correct it in one tap */}
        <div className="chips">
          {["sport", "study", "social"].map(c => (
            <button key={c} className={`chip ${category === c ? c : ""}`}
                    onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        <div className="field">
          <label>Venue</label>
          <select value={venue} onChange={e => setVenue(e.target.value)}>
            <option value="">Pick a venue…</option>
            {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Meeting point (optional)</label>
          <input value={point} onChange={e => setPoint(e.target.value)}
                 placeholder="By the nets" />
        </div>

        <div className="two">
          <div className="field"><label>Starts</label>
            <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} /></div>
          <div className="field"><label>Ends</label>
            <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} /></div>
        </div>

        <div className="field">
          <label>How many people</label>
          <div className="step">
            <button onClick={() => setCap(c => Math.max(2, c - 1))}>−</button>
            <span className="v">{cap}</span>
            <button onClick={() => setCap(c => Math.min(50, c + 1))}>+</button>
            <span className="hint">
              {strict
                ? <>Exactly {cap}.<br />No extras.</>
                : <>{cap + 2} can join.<br />2 extra in case<br />someone drops.</>}
            </span>
          </div>
        </div>

        <div className="tglrow">
          <div>
            <div className="lb">Strict limit</div>
            <div className="muted">Turn off the two spare places.</div>
          </div>
          <button className={`tgl ${strict ? "on" : ""}`}
                  onClick={() => setStrict(s => !s)} aria-label="Strict limit" />
        </div>

        <div className="sechead">Preview</div>
        <Poster activity={preview} wide />

        <button className="btn" disabled={!ready || busy} onClick={post}>
          {busy ? "Posting…" : "Post it"}
        </button>
      </div>
    </>
  )
}
