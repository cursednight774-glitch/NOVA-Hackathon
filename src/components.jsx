// src/components.jsx — the nine pieces every screen is built from.

import { Link, useNavigate } from "react-router-dom"
import { avatarColor, whenLine, time, YEARS } from "./format.js"

import sportBg from "./assets/category-sport.jpg"
import studyBg from "./assets/category-study.jpg"
import socialBg from "./assets/category-social.jpg"
import stubBg from "./assets/stub-bg.jpg"

export const CATEGORY_BG = { sport: sportBg, study: studyBg, social: socialBg }

/* ---------- 1. Avatar ---------- */
export function Avatar({ person, size = "" }) {
  if (!person) return <span className={`av ${size}`} />
  if (person.avatar) {
    return <span className={`av ${size}`}><img src={person.avatar} alt="" /></span>
  }
  return (
    <span className={`av ${size}`} style={{ background: avatarColor(person.name) }}>
      {(person.name || "?")[0].toUpperCase()}
    </span>
  )
}

/* ---------- 2. Record chip (the small xx/10) ---------- */
export function RecordChip({ record }) {
  if (!record) return null
  if (record.newHere) return <span className="recchip new">New</span>
  return <span className="recchip">{record.showed}/{record.of}</span>
}

/* ---------- 3. Record block (profile hero) ---------- */
export function RecordBlock({ record }) {
  if (!record || record.newHere) {
    return (
      <div className="record new">
        <div className="big">New here</div>
        <div className="lab">No finished activities yet</div>
      </div>
    )
  }
  return (
    <div className="record">
      <div className="big">{record.showed}<small>/{record.of}</small></div>
      <div className="pips">
        {record.pips.map((ok, i) => <i key={i} className={ok ? "" : "miss"} />)}
      </div>
      <div className="lab">Showed up · last {record.of} activities</div>
    </div>
  )
}

/* ---------- 4. Person row ---------- */
export function PersonRow({ person, record, right, onClick, sub }) {
  const nav = useNavigate()
  const go = onClick || (() => nav(`/p/${person.id}`))
  return (
    <button className="prow" onClick={go}>
      <Avatar person={person} />
      <span>
        <span className="nm">{person.name}</span>
        <br />
        <span className="yr">{sub ?? `${person.course} · ${YEARS[person.year]?.slice(0, 8)}`}</span>
      </span>
      <span className="right">{right ?? <RecordChip record={record} />}</span>
    </button>
  )
}

/* ---------- 5. Host line (sits ABOVE the poster) ---------- */
export function HostLine({ host, record }) {
  if (!host) return null
  return (
    <Link className="hostline" to={`/p/${host.id}`}>
      <Avatar person={host} size="sm" />
      <span className="nm">{host.name}</span>
      {record && !record.newHere && <span className="rec">{record.showed}/{record.of}</span>}
      {record && record.newHere && <span className="rec" style={{ color: "var(--ink-3)" }}>New</span>}
    </Link>
  )
}

/* ---------- 6. Poster card ---------- */
export function Poster({ activity, wide = false, showJoin = false, record, onJoin, onOpen }) {
  const a = activity
  return (
    <div className={`poster ${wide ? "wide" : ""}`} onClick={onOpen}>
      {/* background: activity-specific image if set, else the category photo */}
      <div className={`bg ${a.category}`}
           style={{ backgroundImage: `url(${a.image || CATEGORY_BG[a.category]})` }} />
      <div className="scrim" />
      <div className="top">
        {a.host ? (
          <Link className="posterhost" to={`/p/${a.host.id}`} onClick={e => e.stopPropagation()}>
            <Avatar person={a.host} size="sm" />
            <span className="nm">{a.host.name}</span>
            {record && !record.newHere && <span className="rec">{record.showed}/{record.of}</span>}
            {record && record.newHere && <span className="rec" style={{ color: "var(--ink-3)" }}>New</span>}
          </Link>
        ) : <span className="cat">{a.category}</span>}
        {a.joined != null && (
          <span className="cnt">
            {a.joined <= a.capacity ? `${a.joined}/${a.capacity}` : `${a.joined} going`}
          </span>
        )}
      </div>
      <div className="txt">
        <div className="name">{a.title}</div>
        <div className="when">
          {whenLine(a)}<br />
          {a.venue}{a.meetingPoint ? ` · ${a.meetingPoint}` : ""}
        </div>
      </div>
      {showJoin && (
        <span className="go" onClick={e => { e.stopPropagation(); onJoin?.() }}>
          {a.iJoined ? "Going" : a.isFull ? "Full" : "Join"}
        </span>
      )}
    </div>
  )
}

/* ---------- 7. App bar ---------- */
export function AppBar({ title, sub, left, right }) {
  return (
    <div className="appbar">
      {left ?? <span className="icon" />}
      <div className="mid">
        <div className="ttl">{title}</div>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {right ?? <span className="icon" style={{ visibility: "hidden" }} />}
    </div>
  )
}

export function BackIcon() {
  const nav = useNavigate()
  return <button className="icon" onClick={() => nav(-1)}>‹</button>
}

export function ProfileIcon({ me }) {
  // not signed in — tell them plainly, and point at the login screen
  // instead of resolving to a bogus /p/ (no id) route.
  if (!me) {
    return (
      <Link className="icon" to="/login"
            state={{ reason: "You're not logged in. Please log in." }}
            aria-label="Not logged in — log in">
        ?
      </Link>
    )
  }
  return (
    <Link className="icon" to={`/p/${me?.id ?? ""}`}>
      {me?.avatar ? <img src={me.avatar} alt="" /> : (me?.name?.[0] ?? "·")}
    </Link>
  )
}

export function AddIcon() {
  return <Link className="icon brand" to="/host">+</Link>
}

/* shown instead of AddIcon on the home screen when nobody's signed in —
   hosting (and joining) needs an account, browsing doesn't. */
export function SignInIcon() {
  return (
    <Link className="icon brand signin" to="/login"
          state={{ reason: "Log in to host an activity." }}>
      Sign in
    </Link>
  )
}

/* ---------- 8. Empty state ---------- */
export function Empty({ children }) {
  return (
    <div className="empty">
      <span className="glyph" />
      <p>{children}</p>
    </div>
  )
}

/* ---------- 9. Share stub (9:16 export card) ---------- */
export function ShareStub({ stub, innerRef }) {
  return (
    <div className={`stub ${stub.category}`} ref={innerRef}>
      <img className="stubbg" src={stubBg} alt="" />
      <div className="head">
        <div className="big">{stub.title}</div>
      </div>
      <div className="bot">
        <div className="row2">
          <div><div className="lbl">Date</div>
               <div className="val">{stub.date.toDateString().slice(4, 10)}, {stub.date.getFullYear()}</div></div>
          <div><div className="lbl">Time</div>
               <div className="val">{time(stub.date)}</div></div>
        </div>
        <div>
          <div className="lbl">Location</div>
          <div className="val">{stub.venue}</div>
        </div>
        <div>
          <div className="lbl caps">Turned up</div>
          <div className="faces">
            {stub.turnedUp.slice(0, 6).map(p => <Avatar key={p.id} person={p} size="sm" />)}
          </div>
          <div className="names">
            {stub.turnedUp.map(p => p.username === stub.username ? <b key={p.id}>you</b> : p.name.split(" ")[0])
              .reduce((acc, n, i) => i === 0 ? [n] : [...acc, " · ", n], [])}
          </div>
        </div>
      </div>
      <div className="sign">
        <div className="handle">@{stub.username}</div>
      </div>
    </div>
  )
}
