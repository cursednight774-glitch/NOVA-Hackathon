// src/screens/Home.jsx — the activity home. The only feed in the app.

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getActivities, getStartingSoon, getProfile, getRecord, joinActivity, ME } from "../api.js"
import { AppBar, ProfileIcon, AddIcon, Poster, PersonRow, Empty } from "../components.jsx"
import { countdown } from "../format.js"

const FILTERS = [
  { key: null,     label: "All" },
  { key: "sport",  label: "Sport" },
  { key: "study",  label: "Study" },
  { key: "social", label: "Social" },
]

export default function Home() {
  const nav = useNavigate()
  const railRef = useRef(null)

  const [me, setMe]           = useState(null)
  const [filter, setFilter]   = useState(null)
  const [list, setList]       = useState([])
  const [soon, setSoon]       = useState([])
  const [index, setIndex]     = useState(0)
  const [records, setRecords] = useState({})   // { personId: record }
  const [loading, setLoading] = useState(true)

  // load everything for the current filter
  async function load() {
    setLoading(true)
    const [acts, sn, myself] = await Promise.all([
      getActivities({ category: filter }),
      getStartingSoon(),
      getProfile(ME),
    ])
    setList(acts); setSoon(sn); setMe(myself); setIndex(0)

    // the host records shown above each poster — dedupe hosts and fetch
    // them all at once instead of one request after another
    const hostIds = [...new Set(acts.map(a => a.hostId))]
    const recEntries = await Promise.all(hostIds.map(async id => [id, await getRecord(id)]))
    setRecords(Object.fromEntries(recEntries))
    setLoading(false)
  }
  useEffect(() => { load() }, [filter])

  // which card is centred right now — drives the host line and the dots
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

        {loading && (
          <div className="bootload" style={{ minHeight: 240 }}>
            <span className="spin" />
          </div>
        )}

        {!loading && list.length === 0 && <Empty>Nothing on today. You start it.</Empty>}

        {!loading && list.length > 0 && (
          <>
            <div className="rail" ref={railRef} onScroll={onScroll}>
              {list.map(a => (
                <div key={a.id}>
                  <Poster activity={a} showJoin
                          record={records[a.hostId]}
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
