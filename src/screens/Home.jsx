// src/screens/Home.jsx — the activity home. The only feed in the app.

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getActivities, getStartingSoon, getProfile, getRecord, joinActivity, ME } from "../api.js"
import { AppBar, ProfileIcon, AddIcon, SignInIcon, Poster, PersonRow, Empty, CATEGORY_BG } from "../components.jsx"
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

  // scroll the rail to a given card index — used by the arrow buttons and
  // the keyboard left/right handler, since dragging/swiping isn't available
  // on a laptop trackpad the way it is on a phone.
  function goTo(i) {
    const el = railRef.current
    if (!el || !list.length) return
    const clamped = Math.max(0, Math.min(i, list.length - 1))
    const card = el.scrollWidth / list.length
    el.scrollTo({ left: card * clamped, behavior: "smooth" })
  }

  // left/right arrow keys browse the rail, same as swiping on a phone.
  // Skipped while a real input/textarea has focus so typing isn't hijacked.
  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return
      if (e.key === "ArrowLeft")  goTo(index - 1)
      if (e.key === "ArrowRight") goTo(index + 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, list.length])

  async function join(a) {
    // browsing is public, but joining needs an account
    if (!ME) return nav("/login", { state: { reason: "Log in to join this activity." } })
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
        right={ME ? <AddIcon /> : <SignInIcon />}
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
            <div className="railwrap">
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
              {index > 0 && list.length > 1 && (
                <button className="railnav prev" aria-label="Previous activity"
                        onClick={() => goTo(index - 1)}>‹</button>
              )}
              {list.length > 1 && index < list.length - 1 && (
                <button className="railnav next" aria-label="Next activity"
                        onClick={() => goTo(index + 1)}>›</button>
              )}
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
                  person={{ id: a.id, name: a.title, avatar: a.image || CATEGORY_BG[a.category] }}
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
