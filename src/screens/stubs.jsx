// src/screens/Stubs.jsx collection of shareable ticket stubs.
import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { getStubs, ME } from "../api.js"
import { AppBar, BackIcon, ShareStub, Empty } from "../components.jsx"

export default function Stubs() {
  const { id } = useParams()
  const personId = id || ME
  const [stubs, setStubs] = useState([])
  const stubRef = useRef(null)

  async function load() {
    const data = await getStubs(personId)
    setStubs(data || [])
  }

  useEffect(() => { load() }, [personId])

  return (
    <>
      <AppBar title="Collected Stubs" left={<BackIcon />} />
      <div className="page">
        {stubs.length === 0 && (
          <Empty>No stubs collected yet. Check in to activities to earn stubs.</Empty>
        )}
        <div className="stub-grid">
          {stubs.map(stub => (
            <ShareStub key={stub.serial} stub={stub} innerRef={stubRef} />
          ))}
        </div>
      </div>
    </>
  )
}