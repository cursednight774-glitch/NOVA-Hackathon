// src/App.jsx - Router configuration connecting all screens
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./screens/Home.jsx"
import Activity from "./screens/Activity.jsx"
import Profile from "./screens/profile.jsx"
import Host from "./screens/host.jsx"
import Stubs from "./screens/stubs.jsx"
import Disputes from "./screens/disputes.jsx"
import EditProfile from "./screens/EditProfile.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/a/:id" element={<Activity />} />
        <Route path="/p/:id?" element={<Profile />} />
        <Route path="/host" element={<Host />} />
        <Route path="/stubs/:id?" element={<Stubs />} />
        <Route path="/disputes" element={<Disputes />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  )
}