// src/screens/Stubs.jsx — the trophy shelf. Reached from your profile.
//
// npm install html-to-image   <-- needed for the download

import { useEffect, useRef, useState } from "react"
import { toPng } from "html-to-image"
import { getStubs, ME } from "../api.js"
import { AppBar, BackIcon, ShareStub, Empty } from "../components.jsx"
import { shortDate } from "../format.js"

export default function Stubs() {
  const [data, setData] = useState({ available: [], collected: [] })
  const [open, setOpen] = useState(null)     // the stub being shown full size
  const cardRef = useRef(null)

  useEffect(() => { getStubs(ME).then(setData) }, [])

  async function download() {
    if (!cardRef.current) return
    // pixelRatio 3 so a 320px card exports near 1080px wide
    const url = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true })
    const a = document.createElement("a")
    a.href = url
    a.download = `showup-${open.serial}.png`
    a.click()
  }

  const total = data.available.length + data.collected.length

  return (
    <>
      <AppBar title="Your stubs" sub={`${total} collected`} left={<BackIcon />} />
      <div className="page">

        {total === 0 && <Empty>Turn up to something. You'll get one.</Empty>}

        {data.available.length > 0 && (
          <>
            <div className="sechead live">Available · share now</div>
            <Cells list={data.available} onOpen={setOpen} />
          </>
        )}

        {data.collected.length > 0 && (
          <>
            <div className="sechead">Collected</div>
            <Cells list={data.collected} onOpen={setOpen} gone />
          </>
        )}
      </div>

      {open && (
        <div className="sheet" onClick={e => { if (e.target === e.currentTarget) setOpen(null) }}>
          <ShareStub stub={open} innerRef={cardRef} />
          <button className="btn" style={{ maxWidth: 320 }} onClick={download}>Save image</button>
          <button className="btn ghost" style={{ maxWidth: 320 }} onClick={() => setOpen(null)}>Close</button>
        </div>
      )}
    </>
  )
}

function Cells({ list, onOpen, gone = false }) {
  return (
    <div className="cells">
      {list.map(s => (
        <button key={s.id} className={`cell ${s.category} ${gone ? "gone" : ""}`}
                onClick={() => onOpen(s)}>
          <div className="strip"><span>{gone ? shortDate(s.date) : "Showed up"}</span></div>
          <div className="in">
            <div className="t">{s.title}</div>
            <div className="d">{shortDate(s.date)} · {s.venue}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
