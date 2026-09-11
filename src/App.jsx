import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ME } from "./api.js"
import Login       from "./screens/Login.jsx"
import Home        from "./screens/Home.jsx"
import Activity    from "./screens/Activity.jsx"
import Profile     from "./screens/Profile.jsx"
import Host        from "./screens/Host.jsx"
import Stubs       from "./screens/Stubs.jsx"
import Disputes    from "./screens/Disputes.jsx"
import EditProfile from "./screens/EditProfile.jsx"
import Privacy     from "./screens/Privacy.jsx"
import Terms       from "./screens/Terms.jsx"

// Wrap any route that actually needs an account (hosting, editing your
// profile, your stubs, your disputes) — everything else is public so
// people can browse what's happening before they ever sign in.
function RequireAuth({ children, reason }) {
  if (!ME) return <Navigate to="/login" replace state={{ reason }} />
  return children
}

export default function App() {
  // main.jsx runs loadMe() before rendering, so ME is already settled here.
  // No blanket gate anymore — Home (and activity/profile pages) are public.
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/a/:id"     element={<Activity />} />
          <Route path="/p/:id"     element={<Profile />} />
          <Route path="/host" element={
            <RequireAuth reason="Log in to host an activity.">
              <Host />
            </RequireAuth>
          } />
          <Route path="/stubs" element={
            <RequireAuth reason="Log in to see your stubs.">
              <Stubs />
            </RequireAuth>
          } />
          <Route path="/disputes" element={
            <RequireAuth reason="Log in to review your activities.">
              <Disputes />
            </RequireAuth>
          } />
          <Route path="/edit" element={
            <RequireAuth reason="Log in to edit your profile.">
              <EditProfile />
            </RequireAuth>
          } />
          <Route path="/privacy"   element={<Privacy />} />
          <Route path="/terms"     element={<Terms />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
