// src/screens/Disputes.jsx screen to view and resolve attendance disputes.
import { useEffect, useState } from "react"
import { getDisputes, resolveDispute } from "../api.js"
import { AppBar, BackIcon, Empty } from "../components.jsx"

export default function Disputes() {
  const [disputes, setDisputes] = useState([])
  const [msg, setMsg] = useState("")

  async function load() {
    const data = await getDisputes()
    setDisputes(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleResolve(id, approved) {
    const res = await resolveDispute(id, approved)
    if (res?.error) setMsg(res.error)
    else load()
  }

  return (
    <>
      <AppBar title="Disputes" left={<BackIcon />} />
      <div className="page">
        {disputes.length === 0 && (
          <Empty>No pending disputes.</Empty>
        )}
        <div className="list">
          {disputes.map(d => (
            <div key={d.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
              <div style={{ fontWeight: 700 }}>{d.activityTitle}</div>
              <p className="muted" style={{ margin: "4px 0 10px" }}>
                Reported by {d.reporterName}: {d.reason}
              </p>
              <div className="two">
                <button className="btn ok" onClick={() => handleResolve(d.id, true)}>
                  Approve
                </button>
                <button className="btn ghost" onClick={() => handleResolve(d.id, false)}>
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
        {msg && <p className="muted" style={{ color: "var(--warn)" }}>{msg}</p>}
      </div>
    </>
  )
}