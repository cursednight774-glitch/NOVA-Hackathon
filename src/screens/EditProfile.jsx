// src/screens/EditProfile.jsx — pencil icon on your own profile.
// Course and year are MANDATORY. Picture is optional.

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile, updateProfile, INTERESTS, ME } from "../api.js"
import { AppBar, BackIcon, Avatar } from "../components.jsx"
import { COURSES, YEARS } from "../format.js"

const GROUPS = [
  ["studies", "Studies", "study"],
  ["sports",  "Sports",  "sport"],
  ["hobbies", "Hobbies", "social"],
]
const MAX = 12

export default function EditProfile() {
  const nav = useNavigate()
  const [p, setP] = useState(null)
  const [q, setQ] = useState("")

  useEffect(() => { getProfile(ME).then(setP) }, [])
  if (!p) return <AppBar title="Edit profile" left={<BackIcon />} />

  const chosen = Object.values(p.interests).flat()

  function toggle(group, item) {
    setP(prev => {
      const has = prev.interests[group].includes(item)
      if (!has && Object.values(prev.interests).flat().length >= MAX) return prev
      return {
        ...prev,
        interests: {
          ...prev.interests,
          [group]: has
            ? prev.interests[group].filter(x => x !== item)
            : [...prev.interests[group], item],
        },
      }
    })
  }

  function addCustom(group) {
    const raw = q.trim()
    if (!raw) return
    const clean = raw[0].toUpperCase() + raw.slice(1)
    if (chosen.some(c => c.toLowerCase() === clean.toLowerCase())) return setQ("")
    toggle(group, clean)
    setQ("")
  }

  // reading a picked file as a data URL keeps this working with no storage bucket
  function pickPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const r = new FileReader()
    r.onload = () => setP(prev => ({ ...prev, avatar: r.result }))
    r.readAsDataURL(file)
  }

  async function save() {
    if (!p.course || !p.year) return alert("Course and year are required.")
    await updateProfile({
      avatar: p.avatar, course: p.course, year: Number(p.year), interests: p.interests,
    })
    nav(`/p/${ME}`)
  }

  return (
    <>
      <AppBar title="Edit profile" left={<BackIcon />} />
      <div className="page">

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Avatar person={p} size="lg" />
          <label className="btn ghost btn sm" style={{ width: "auto" }}>
            Change photo
            <input type="file" accept="image/*" hidden onChange={pickPhoto} />
          </label>
        </div>

        <div className="two">
          <div className="field"><label>Course *</label>
            <select value={p.course || ""} onChange={e => setP({ ...p, course: e.target.value })}>
              <option value="">Pick…</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field"><label>Year *</label>
            <select value={p.year || ""} onChange={e => setP({ ...p, year: e.target.value })}>
              <option value="">Pick…</option>
              {Object.entries(YEARS).map(([n, label]) =>
                <option key={n} value={n}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Search interests ({chosen.length}/{MAX})</label>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Type to filter…" />
        </div>

        {GROUPS.map(([key, label, cls]) => {
          const list = INTERESTS[key].filter(
            i => !q || i.toLowerCase().includes(q.toLowerCase()))
          const pickedCount = p.interests[key].length
          if (q && !list.length) return null
          return (
            <details key={key} className="intgroup" open={!!q || undefined}>
              <summary className="sechead intgroup-head">
                {label}{pickedCount > 0 ? ` · ${pickedCount}` : ""}
              </summary>
              <div className="chips">
                {list.map(i => (
                  <button key={i}
                          className={`chip ${p.interests[key].includes(i) ? cls : ""}`}
                          onClick={() => toggle(key, i)}>{i}</button>
                ))}
                {q && !list.some(i => i.toLowerCase() === q.toLowerCase()) && (
                  <button className="chip" onClick={() => addCustom(key)}>+ add "{q}"</button>
                )}
              </div>
            </details>
          )
        })}

        <button className="btn" onClick={save}>Save</button>
      </div>
    </>
  )
}
