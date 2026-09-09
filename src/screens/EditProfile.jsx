// src/screens/EditProfile.jsx edit personal profile details.
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile, updateProfile, ME } from "../api.js"
import { AppBar, BackIcon, Avatar } from "../components.jsx"
import { YEARS } from "../format.js"

export default function EditProfile() {
  const nav = useNavigate()
  const [name, setName] = useState("")
  const [course, setCourse] = useState("")
  const [year, setYear] = useState(1)
  const [avatar, setAvatar] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    getProfile(ME).then(p => {
      if (p) {
        setName(p.name || "")
        setCourse(p.course || "")
        setYear(p.year || 1)
        setAvatar(p.avatar || "")
      }
    })
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    if (!name || !course) {
      return setMsg("Name and course are required.")
    }

    const res = await updateProfile({ name, course, year: Number(year), avatar })
    if (res?.error) setMsg(res.error)
    else nav(`/p/${ME}`)
  }

  return (
    <>
      <AppBar title="Edit profile" left={<BackIcon />} />
      <div className="page">
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <Avatar person={{ name, avatar }} size="lg" />
          </div>

          <div className="field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Course</label>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={course}
              onChange={e => setCourse(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Year</label>
            <select value={year} onChange={e => setYear(e.target.value)}>
              {Object.entries(YEARS).map(([y, label]) => (
                <option key={y} value={y}>{label}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Avatar URL (optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
            />
          </div>

          {msg && <p className="muted" style={{ color: "var(--warn)" }}>{msg}</p>}

          <button className="btn" type="submit">Save changes</button>
        </form>
      </div>
    </>
  )
}