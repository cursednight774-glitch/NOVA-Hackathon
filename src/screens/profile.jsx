// src/screens/Profile.jsx personal record, attended, hosted.
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProfile, getRecord, getAttended, getHosted, ME } from "../api.js"
import { AppBar, BackIcon, Avatar, RecordBlock, Poster, Empty } from "../components.jsx"
import { YEARS } from "../format.js"

export default function Profile() {
  const { id } = useParams()
  const nav = useNavigate()
  const personId = id || ME
  const isMe = personId === ME

  const [person, setPerson] = useState(null)
  const [record, setRecord] = useState(null)
  const [attended, setAttended] = useState([])
  const [hosted, setHosted] = useState([])
  const [tab, setTab] = useState("attended")

  async function load() {
    const [p, r, att, hst] = await Promise.all([
      getProfile(personId),
      getRecord(personId),
      getAttended(personId),
      getHosted(personId),
    ])
    setPerson(p)
    setRecord(r)
    setAttended(att)
    setHosted(hst)
  }

  useEffect(() => { load() }, [personId])

  if (!person) return <AppBar title="Profile" left={<BackIcon />} />

  const list = tab === "attended" ? attended : hosted

  return (
    <>
      <AppBar title={isMe ? "My profile" : person.name} left={<BackIcon />} />
      <div className="page">
        <div className="phead">
          <Avatar person={person} size="lg" />
          <div>
            <div className="nm">{person.name}</div>
            <div className="yr">{person.course} · {YEARS[person.year]}</div>
            <div className="muted">@{person.username}</div>
          </div>
        </div>

        <RecordBlock record={record} />

        <div className="tabs">
          <button
            className={`tab ${tab === "attended" ? "on" : ""}`}
            onClick={() => setTab("attended")}>
            Attended ({attended.length})
          </button>
          <button
            className={`tab ${tab === "hosted" ? "on" : ""}`}
            onClick={() => setTab("hosted")}>
            Hosted ({hosted.length})
          </button>
        </div>

        {list.length === 0 && (
          <Empty>
            {tab === "attended"
              ? "No attended activities yet."
              : "Hasn't hosted anything yet."}
          </Empty>
        )}

        <div className="list">
          {list.map(a => (
            <Poster
              key={a.id}
              activity={a}
              wide
              onOpen={() => nav(`/a/${a.id}`)}
            />
          ))}
        </div>
      </div>
    </>
  )
}