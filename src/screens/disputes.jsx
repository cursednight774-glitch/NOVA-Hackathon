// src/screens/Disputes.jsx — host only. From your own profile.
//
// Default is TRUST: everyone who checked in counts as present.
// The host only taps the people who did NOT show up.

import { useEffect, useState } from "react"
import { getDisputes, submitDispute, ME } from "../api.js"
import { AppBar, BackIcon, PersonRow, Empty } from "../components.jsx"
import { time, whenLine } from "../format.js"

export default function Disputes() {
  const [queue, setQueue]   = useState([])
  const [pick, setPick]     = useState(0)      // which square is selected
  const [absent, setAbsent] = useState([])     // ids flagged as no-shows

  async function load() {
    const q = await getDisputes(ME)
    setQueue(q); setPick(0); setAbsent([])
  }
  useEffect(() => { load() }, [])

  const a = queue[pick]

  function toggle(id) {
    setAbsent(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  }

  async function done() {
    await submitDispute(a.id, absent)
    load()
  }

  if (queue.length === 0) {
    return (
      <>
        <AppBar title="Dispute show-ups" left={<BackIcon />} />
        <Empty>Nothing to review. Nice.</Empty>
      </>
    )
  }

  const checkedIn = a.going.filter(p => p.join.checkedIn)

  return (
    <>
      <AppBar title="Dispute show-ups" left={<BackIcon />} />
      <div className="page">
        <p className="muted">You hosted these. Anything look wrong?</p>

        {/* the queue: one small square per activity waiting to be reviewed */}
        <div className="sqs">
          {queue.map((q, i) => (
            <button key={q.id}
                    className={`sq ${i === pick ? "sel" : ""}`}
                    onClick={() => { setPick(i); setAbsent([]) }}
                    aria-label={q.title} />
          ))}
        </div>

        <div className="field" style={{ borderColor: "var(--warn)" }}>
          <label style={{ color: "var(--warn)" }}>Reviewing</label>
          <div style={{ fontWeight: 700 }}>{a.title}</div>
          <div className="muted">{whenLine(a)}</div>
        </div>

        <div className="sechead">
          Checked in — {checkedIn.length} {checkedIn.length === 1 ? "person" : "people"}
        </div>

        <div>
          {checkedIn.map(p => (
            <PersonRow
              key={p.id}
              person={p}
              sub={`Checked in ${time(p.join.checkedIn)}`}
              onClick={() => toggle(p.id)}
              right={
                <span className={`chip ${absent.includes(p.id) ? "warn" : "ok"}`}>
                  {absent.includes(p.id) ? "Didn't show" : "Was there"}
                </span>
              }
            />
          ))}
        </div>

        {checkedIn.length === 0 && (
          <p className="muted">Nobody checked in to this one. Nothing to review.</p>
        )}

        <button className="btn" onClick={done}>
          Done{absent.length ? ` · ${absent.length} flagged` : ""}
        </button>
        <p className="muted center">Everyone counts as present unless you flag them.</p>
      </div>
    </>
  )
}
