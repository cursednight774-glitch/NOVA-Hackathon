// src/components.jsx the nine pieces every screen is built from.
import { Link, useNavigate } from "react-router-dom"
import { avatarColor, whenLine, time, YEARS } from "./format.js"

/*
1. Avatar  
*/
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

/*
2. Record chip (the small xx/10)
*/
export function RecordChip({ record }) {
  if (!record) return null
  if (record.newHere) return <span className="recchip new">New</span>
  return <span className="recchip">{record.showed}/{record.of}</span>
}

/*
3. Record block (profile hero)
*/
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
      <div className="lab">Showed up last {record.of} activities</div>
    </div>
  )
}

/*
4. Person row
*/
export function PersonRow({ person, record, right, onClick, sub }) {
  const nav = useNavigate()
  const go = onClick || (() => nav(`/p/${person.id}`))
  return (
    <button className="prow" onClick={go}>
      <Avatar person={person} />
      <span>
        <span className="nm">{person.name}</span>
        <br />
        <span className="yr">{sub ?? `${person.course} ${YEARS[person.year]?.slice(0, 8)}`}</span>
      </span>
      <span className="right">{right ?? <RecordChip record={record} />}</span>
    </button>
  )
}

/*
5. Host line (sits ABOVE the poster)
*/
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

/*
6. Poster card
*/
export function Poster({ activity, wide = false, showJoin = false, onJoin, onOpen }) {
  const a = activity
  return (
    <div className={`poster ${wide ? "wide" : ""}`} onClick={onOpen}>
      {/* background: a category image when we have one, gradient otherwise */}
      <div className={`bg ${a.category}`}
        style={a.image ? { backgroundImage: `url(${a.image})` } : undefined} />
      <div className="scrim" />
      <div className="top">
        <span className="cat">{a.category}</span>
        {a.joined != null && (
          <span className="cnt">
            {a.joined >= a.capacity ? `${a.joined}/${a.capacity}` : `${a.joined} going`}
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

/*
7. App bar
*/
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
  return <button className="icon" onClick={() => nav(-1)}>&lt;</button>
}

export function ProfileIcon({ me }) {
  return (
    <Link className="icon" to={`/p/${me?.id ?? ""}`}>
      {me?.avatar ? <img src={me.avatar} alt="" /> : (me?.name?.[0] ?? ".")}
    </Link>
  )
}

export function AddIcon() {
  return <Link className="icon brand" to="/host">+</Link>
}

/*
8. Empty state 
*/
export function Empty({ children }) {
  return (
    <div className="empty">
      <span className="glyph" />
      <p>{children}</p>
    </div>
  )
}

/*
9. Share stub (9:16 export card)
*/
export function ShareStub({ stub, innerRef }) {
  return (
    <div className={`stub ${stub.category}`} ref={innerRef}>
      <div className="head">
        <div className="brand"><span>Show Up</span><span>SJEC</span></div>
        <div className="big">{stub.title}</div>
        <div className="meta">
          {stub.date.toDateString().slice(0, 10)} · {time(stub.date)}<br />
          {stub.venue}
        </div>
      </div>
      <div className="perf" />
      <div className="bot">
        <div className="lbl">Turned up</div>
        <div className="faces">
          {stub.turnedUp.slice(0, 6).map(p => <i key={p.id} />)}
        </div>
        <div className="names">
          {stub.turnedUp.map(p => p.username === stub.username ? "you" : p.name.split(" ")[0]).join(" · ")}
        </div>
        <div className="mine"><span>Collected by</span>@{stub.username}</div>
        <div className="code" />
        <div className="serial"><span>NO. {stub.serial}</span><span>SHOW UP</span></div>
      </div>
    </div>
  )
}