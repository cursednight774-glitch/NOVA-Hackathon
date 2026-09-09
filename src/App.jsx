// src/App.jsx — every route in the app. Six screens plus edit.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home        from "./screens/Home.jsx"
import Activity    from "./screens/Activity.jsx"
import Profile     from "./screens/Profile.jsx"
import Host        from "./screens/Host.jsx"
import Stubs       from "./screens/Stubs.jsx"
import Disputes    from "./screens/Disputes.jsx"
import EditProfile from "./screens/EditProfile.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/a/:id"     element={<Activity />} />
          <Route path="/p/:id"     element={<Profile />} />
          <Route path="/host"      element={<Host />} />
          <Route path="/stubs"     element={<Stubs />} />
          <Route path="/disputes"  element={<Disputes />} />
          <Route path="/edit"      element={<EditProfile />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
