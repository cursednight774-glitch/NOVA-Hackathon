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
  const [imgUrl, setImgUrl] = useState(null) // the rendered PNG of the open stub
  const [rendering, setRendering] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => { getStubs(ME).then(setData) }, [])

  // ShareStub is rendered off-screen (see hidden wrapper below) purely so
  // html-to-image has real DOM to rasterize. The visible card is always
  // the resulting <img> — that's what makes long-press "save/copy image"
  // work on phones, instead of the browser's text-selection menu.
  useEffect(() => {
    if (!open) { setImgUrl(null); return }
    setRendering(true)
    // let the hidden ShareStub paint first, then rasterize it
    const t = setTimeout(async () => {
      if (!cardRef.current) return
      const url = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true })
      setImgUrl(url)
      setRendering(false)
    }, 50)
    return () => clearTimeout(t)
  }, [open])

  function download() {
    if (!imgUrl) return
    const a = document.createElement("a")
    a.href = imgUrl
    a.download = `showup-${open.serial}.png`
    a.click()
  }

  // true only where the browser can actually share an image file (most
  // mobile browsers) — on desktop this stays false and the button hides,
  // since navigator.share with files isn't supported there.
  const canShareFile = typeof navigator !== "undefined" && !!navigator.canShare

  async function share() {
    if (!imgUrl) return
    const res = await fetch(imgUrl)
    const blob = await res.blob()
    const file = new File([blob], `showup-${open.serial}.png`, { type: "image/png" })
    if (!navigator.canShare?.({ files: [file] })) return
    try {
      // Instagram (if installed) shows up as one of the share targets here —
      // there's no web API to jump straight into its Story composer, this
      // is the closest a website can get.
      await navigator.share({ files: [file], title: open.title })
    } catch {
      // user cancelled the share sheet — nothing to do
    }
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
          {/* hidden — exists only so toPng has a real card to rasterize */}
          <div style={{ position: "fixed", top: -9999, left: -9999 }}>
            <ShareStub stub={open} innerRef={cardRef} />
          </div>

          {rendering && (
            <div className="bootload" style={{ minHeight: 200 }}><span className="spin" /></div>
          )}
          {!rendering && imgUrl && (
            <img src={imgUrl} alt={open.title} style={{ width: "auto", maxWidth: "100%", maxHeight: "55vh", borderRadius: 26, objectFit: "contain" }} />
          )}

          <button className="btn" style={{ maxWidth: 320 }} onClick={download} disabled={!imgUrl}>
            Save image
          </button>
          {canShareFile && (
            <button className="btn ghost" style={{ maxWidth: 320 }} onClick={share} disabled={!imgUrl}>
              Share
            </button>
          )}
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
