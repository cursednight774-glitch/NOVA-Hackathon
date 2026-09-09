// src/screens/Home.jsx the activity home. The only feed in the app.
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getActivities, getStartingSoon, getProfile, getRecord, joinActivity, ME } from "../api.js"
import { AppBar, ProfileIcon, AddIcon, HostLine, Poster, PersonRow, Empty } from "../components.jsx"
import { countdown } from "../format.js"

const FILTERS = [
  { key: null, label: "All" },
  { key: "sport", label: "Sport" },
  { key: "study", label: "Study" },
  { key: "social", label: "Social" },
]

export default function Home() {
  const nav = useNavigate()
  const railRef = useRef(null)
  const [me, setMe] = useState(null)
  const [filter, setFilter] = useState(null)
  const [list, setList] = useState([])
  const [soon, setSoon] = useState([])
  const [index, setIndex] = useState(0)
  const [records, setRecords] = useState({}) // {personId: record }

  // load everything for the current filter
  async function load() {
    const [acts, sn, myself] = await Promise.all([
      getActivities({ category: filter }),
      getStartingSoon(),
      getProfile(ME),
    ])
    setList(acts); setSoon(sn); setMe(myself); setIndex(0)

    // the host records shown above each poster
    const recs = {}
    for (const a of acts) recs[a.hostId] = await getRecord(a.hostId)
    setRecords(recs)
  }

  useEffect(() => { load() }, [filter])

  // which card is centred right now drives the host line and the dots
  function onScroll() {
    const el = railRef.current
    if (!el) return
    const card = el.scrollWidth / Math.max(list.length, 1)
    setIndex(Math.round(el.scrollLeft / card))
  }

  async function join(a) {
    const res = await joinActivity(a.id)
    if (res.error) return alert(res.error)
    load()
  }

  const current = list[Math.min(index, list.length - 1)]

  return (
    <>
      <AppBar
        title="Today"
        sub={`${list.length} ${list.length === 1 ? "thing" : "things"} happening`}
        left={<ProfileIcon me={me} />}
        right={<AddIcon />}
      />
      <div className="page">
        <div className="chips">
          {FILTERS.map(f => (
            <button key={f.label}
              className={`chip ${filter === f.key ? "on" : ""}`}
              onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        {list.length === 0 && <Empty>Nothing on today. You start it.</Empty>}
        {list.length > 0 && (
          <>
            {/* host name sits ABOVE the poster and changes as you swipe */}
            <HostLine host={current?.host} record={records[current?.hostId]} />
            <div className="rail" ref={railRef} onScroll={onScroll}>
              {list.map(a => (
                <div key={a.id}>
                  <Poster activity={a} showJoin
                    onJoin={() => join(a)}
                    onOpen={() => nav(`/a/${a.id}`)} />
                </div>
              ))}
            </div>
            <div className="dots">
              {list.map((a, i) => <i key={a.id} className={i === index ? "on" : ""} />)}
            </div>
          </>
        )}
        {soon.length > 0 && (
          <>
            <div className="sechead">Starting soon</div>
            <div>
              {soon.map(a => (
                <PersonRow
                  key={a.id}
                  person={{ id: a.id, name: a.title }}
                  sub={`${countdown(a.startsAt)} · ${a.host.name}`}
                  right={<span className="recchip">{a.joined} going</span>}
                  onClick={() => nav(`/a/${a.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}