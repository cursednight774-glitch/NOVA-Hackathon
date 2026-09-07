// src/screens/Login.jsx
// Nihal's file. Rough but working — your teammate restyles it later.

import { useState } from "react"
import { signIn, signUp } from "../auth.js"
import { loadMe } from "../api.js"

const COURSES = ["CSE", "ISE", "AIML", "ECE", "EEE", "ME", "CV", "MBA", "MCA"]
const YEARS = {
  1: "1st year (Freshman)",
  2: "2nd year (Sophomore)",
  3: "3rd year (Junior)",
  4: "4th year (Senior)",
}

// Plain inline styles so this works before app.css exists.
// Your teammate will replace these with className="field" / "btn" etc.
const S = {
  page:  { maxWidth: 420, margin: "0 auto", padding: 24, minHeight: "100dvh",
           display: "flex", flexDirection: "column", justifyContent: "center",
           gap: 12, fontFamily: "system-ui, sans-serif" },
  logo:  { fontSize: 34, fontWeight: 800, letterSpacing: "-.03em", margin: 0 },
  sub:   { color: "#7C7C8C", margin: "0 0 8px", fontSize: 14 },
  label: { display: "block", fontSize: 11, letterSpacing: ".08em",
           textTransform: "uppercase", color: "#7C7C8C", fontWeight: 700,
           marginBottom: 4 },
  field: { border: "1px solid #DCDCE4", borderRadius: 9, padding: "10px 12px",
           background: "#fff" },
  input: { width: "100%", border: 0, outline: "none", fontSize: 16,
           fontWeight: 600, background: "transparent" },
  two:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  btn:   { width: "100%", padding: 14, borderRadius: 9, border: 0,
           background: "#C7264F", color: "#fff", fontSize: 16, fontWeight: 800,
           cursor: "pointer" },
  link:  { width: "100%", padding: 8, background: "none", border: 0,
           color: "#7C7C8C", fontSize: 14, cursor: "pointer" },
  err:   { color: "#B4531B", fontSize: 14, margin: 0 },
  hint:  { color: "#7C7C8C", fontSize: 12, margin: "2px 0 4px", lineHeight: 1.4 },
}

export default function Login() {
  const [mode, setMode]     = useState("in")   // "in" = sign in, "up" = sign up
  const [name, setName]     = useState("")
  const [pw, setPw]         = useState("")
  const [course, setCourse] = useState("")
  const [year, setYear]     = useState("")
  const [msg, setMsg]       = useState("")
  const [busy, setBusy]     = useState(false)

  async function go() {
    if (!name.trim() || !pw) return setMsg("Fill in both fields.")
    if (pw.length < 6) return setMsg("Password needs at least 6 characters.")
    if (mode === "up" && (!course || !year))
      return setMsg("Course and year are required.")

    setBusy(true); setMsg("")

    const res = mode === "in"
      ? await signIn(name, pw)
      : await signUp(name, pw, course, Number(year))

    if (res.error) { setMsg(res.error); setBusy(false); return }

    await loadMe()
    // A FULL RELOAD, not a router navigate. This is what makes every screen
    // pick up the new ME. Don't change it to navigate().
    window.location.href = "/"
  }

  return (
    <div style={S.page}>
      <h1 style={S.logo}>Show Up</h1>
      <p style={S.sub}>Post what you're doing. See who turns up.</p>

            <div style={S.field}>
        <label style={S.label}>Your name</label>
        <input style={S.input} value={name}
               onChange={e => setName(e.target.value)}
               onKeyDown={e => e.key === "Enter" && go()} />
      </div>

      <div style={S.field}>
        <label style={S.label}>Password</label>
        <input style={S.input} type="password" value={pw}
               onChange={e => setPw(e.target.value)}
               onKeyDown={e => e.key === "Enter" && go()} />
      </div>

      <p style={S.hint}>
        Password is case sensitive. Your name isn't — but spacing is,
        so "Rohan M" and "RohanM" are different accounts.
      </p>

      {mode === "up" && (
        <div style={S.two}>
          <div style={S.field}>
            <label style={S.label}>Course</label>
            <select style={S.input} value={course}
                    onChange={e => setCourse(e.target.value)}>
              <option value="">Pick…</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={S.field}>
            <label style={S.label}>Year</label>
            <select style={S.input} value={year}
                    onChange={e => setYear(e.target.value)}>
              <option value="">Pick…</option>
              {Object.entries(YEARS).map(([n, l]) =>
                <option key={n} value={n}>{l}</option>)}
            </select>
          </div>
        </div>
      )}

      {msg && <p style={S.err}>{msg}</p>}

      <button style={{ ...S.btn, opacity: busy ? .6 : 1 }}
              disabled={busy} onClick={go}>
        {busy ? "…" : mode === "in" ? "Sign in" : "Create account"}
      </button>

      <button style={S.link}
              onClick={() => { setMode(m => (m === "in" ? "up" : "in")); setMsg("") }}>
        {mode === "in"
          ? "New here? Create an account"
          : "Already have an account? Sign in"}
      </button>
    </div>
  )
}