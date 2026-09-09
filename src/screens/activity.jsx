// src/screens/Activity.jsx opens when you tap a poster.
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getActivity, getRecord, joinActivity, leaveActivity, checkIn,
  cancelActivity, canLeaveFreely, ME,
} from "../api.js"
import { AppBar, BackIcon, Poster, PersonRow, Avatar } from "../components.jsx"
import { time, joinLine, countdown, YEARS } from "../format.js"

export default function Activity() {
  const { id } = useParams()
  const nav = useNavigate()
  const [a, setA] = useState(null)
  const [records, setRecords] = useState({})
  const [msg, setMsg] = useState("")

  async function load() {
    const act = await getActivity(id)
    setA(act)
    if (!act) return
    const r = {}
    for (const p of act.going) r[p.id] = await getRecord(p.id)
    setRecords(r)
  }

  useEffect(() => { load() }, [id])

  // re-check the phase every 30s so the button flips on its own
  useEffect(() => {
    const t = setInterval(load, 30000)
    return () => clearInterval(t)
  }, [id])

  if (!a) return <AppBar title="Activity" left={<BackIcon />} />

  async function run(fn) {
    const res = await fn()
    if (res?.error) setMsg(res.error)
    else { setMsg(""); load() }
  }

  //---- the one button, six states
  function Action() {
    if (a.cancelled) return <button className="btn off" disabled>Cancelled</button>
    if (a.phase === "closed") {
      return <button className="btn off" disabled>
        {a.iCheckedIn ? "Checked in" : "Check-in window closed"}
      </button>
    }
    if (a.phase === "window") {
      if (!a.iJoined) return <button className="btn off" disabled>Already started</button>
      if (a.iCheckedIn) return <button className="btn ok" disabled>Checked in</button>
      return <button className="btn ok" onClick={() => run(() => checkIn(a.id))}>I'm here</button>
    }
    // phase === "before"
    if (a.iJoined) {
      return canLeaveFreely(a)
        ? <button className="btn ghost" onClick={() => run(() => leaveActivity(a.id))}>
            Leave · free until {time(new Date(a.startsAt.getTime() - 3600000))}
          </button>
        : <button className="btn off" disabled>
            check in {countdown(new Date(a.startsAt.getTime() - 600000))}<br/>
            You're going
          </button>
    }
    if (a.isFull) return <button className="btn off" disabled>Full</button>
    return <button className="btn" onClick={() => run(() => joinActivity(a.id))}>Join</button>
  }

  const spotsLeft = Math.max(a.capacity - a.joined, 0)

  return (
    <>
      <AppBar title="Activity" left={<BackIcon />} />
      <div className="page">
        <Poster activity={a} wide />
        <div className="two">
          <div className="field"><label>Starts</label>
            <div style={{ fontWeight: 700 }}>{time(a.startsAt)}</div></div>
          <div className="field"> <label>Ends</label>
            <div style={{ fontWeight: 700 }}>{time(a.endsAt)}</div></div>
        </div>
        <div className="field"><label>Venue</label>
          <div style={{ fontWeight: 700 }}>
            {a.venue}{a.meetingPoint ? ` · meet ${a.meetingPoint}` : ""}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="sechead">{joinLine(a)}</span>
          <span style={{ marginLeft: "auto" }}
            className={`chip ${a.isFull ? "warn" : "ok"}`}>
            {a.isFull ? "Full" : `${spotsLeft} spots left`}
          </span>
        </div>
        <div>
          {a.going.map(p => (
            <PersonRow
              key={p.id}
              person={p}
              record={records[p.id]}
              right={p.id === a.hostId
                ? <span className="recchip host">Host</span>
                : undefined}
            />
          ))}
        </div>
        {msg && <p className="muted" style={{ color: "var(--warn)" }}>{msg}</p>}
        <Action />
        {a.phase === "before" && (
          <p className="muted center">Check in opens 10 minutes before the start.</p>
        )}
        {a.phase === "window" && (
          <p className="muted center">Check-in closes 10 minutes after it ends.</p>
        )}
        {a.hostId === ME && !a.cancelled && a.phase === "before" && (
          <button className="muted center"
            style={{ color: "var(--warn)", width: "100%" }}
            onClick={() => run(() => cancelActivity(a.id)).then(() => nav("/"))}>
            Cancel this activity
          </button>
        )}
      </div>
    </>
  )
}