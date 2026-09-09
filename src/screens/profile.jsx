// src/screens/Profile.jsx — reachable from every face in the app.

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { getProfile, getActivities, getDisputes, ME } from "../api.js"
import { AppBar, BackIcon, Avatar, RecordBlock } from "../components.jsx"
import { YEARS, whenLine } from "../format.js"
import { signOut } from "../auth.js"

export default function Profile() {
  const { id } = useParams()
  const nav = useNavigate()
  const [p, setP] = useState(null)
  const [theirs, setTheirs] = useState([])
  const [disputes, setDisputes] = useState([])

  useEffect(() => {
    (async () => {
      const person = await getProfile(id)
      setP(person)
      const all = await getActivities()
      // ids are compared as strings: activity ids are numbers but
      // profile ids are uuids. Never wrap a profile id in Number().
      const mine = String(id) === String(ME)
      setTheirs(all.filter(a => String(a.hostId) === String(id) || (mine && a.iJoined)))
      if (mine) setDisputes(await getDisputes(ME))
    })()
  }, [id])

  if (!p) return <AppBar title="Profile" left={<BackIcon />} />

  const groups = [
    ["Studies", p.interests.studies, "study"],
    ["Sports",  p.interests.sports,  "sport"],
    ["Hobbies", p.interests.hobbies, "social"],
  ]

  return (
    <>
      <AppBar
  title="Profile"
  left={<BackIcon />}
  right={p.isMe ? (
    <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <Link className="icon" to="/edit">✎</Link>
      <button
        className="icon"
        onClick={async () => { await signOut(); window.location.href = "/" }}
        style={{ fontSize: 13, fontWeight: 700, width: "auto", padding: "0 8px" }}
      >
        Sign out
      </button>
    </span>
  ) : undefined}
/>
      <div className="page">

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Avatar person={p} size="lg" />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>{p.name}</div>
            <div className="muted">@{p.username}</div>
            <div className="muted" style={{ marginTop: 2 }}>
              {p.course} · {YEARS[p.year]}
            </div>
          </div>
        </div>

        {/* the biggest thing on the screen, on purpose */}
        <RecordBlock record={p.record} />

        {groups.map(([label, items, cls]) => (
          items?.length ? (
            <div key={label}>
              <div className="sechead" style={{ marginBottom: 8 }}>{label}</div>
              <div className="chips">
                {items.map(i => <span key={i} className={`chip ${cls}`}>{i}</span>)}
              </div>
            </div>
          ) : null
        ))}

        {theirs.length > 0 && (
          <>
            <div className="sechead">Coming up</div>
            <div>
              {theirs.map(a => (
                <button key={a.id} className="prow" onClick={() => nav(`/a/${a.id}`)}>
                  <span>
                    <span className="nm">{a.title}</span><br />
                    <span className="yr">
                      {a.hostId === p.id ? "Hosting · " : "Going · "}{whenLine(a)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {p.isMe && (
          <>
            <Link className="btn ghost" to="/stubs">Your stubs</Link>
            {disputes.length > 0 && (
              <Link className="btn ghost" to="/disputes">
                Dispute show-ups · {disputes.length}
              </Link>
            )}
          </>
        )}
      </div>
    </>
  )
}
