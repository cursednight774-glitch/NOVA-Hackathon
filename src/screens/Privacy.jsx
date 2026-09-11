// src/screens/Privacy.jsx — Privacy Policy.
// Plain content page, no data fetching. Keep this in sync with what
// auth.js / api.js actually collect and store — this is a legal
// document, not just app copy.

import { AppBar, BackIcon } from "../components.jsx"

const UPDATED = "September 2026"
const CONTACT_EMAIL = "TODO@replace.me" // <-- put your real contact email here

// onBack: optional. Pass this when showing Privacy outside the router (e.g.
// from Login.jsx, which runs before any signed-in user/router exists) so it
// doesn't rely on BackIcon's useNavigate(). Inside the real app, leave it
// unset and the normal router-based back button is used.
export default function Privacy({ onBack }) {
  return (
    <>
      <AppBar title="Privacy Policy"
              left={onBack
                ? <button className="icon" onClick={onBack}>‹</button>
                : <BackIcon />} />
      <div className="page legal">
        <p className="muted">Last updated: {UPDATED}</p>

        <p>
          Show Up is an independent student project built for SJEC students.
          It is not an official college app and is not operated by SJEC. This
          page explains what information Show Up collects, why, and what
          choices you have about it.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li><b>Account info:</b> your name and password (used only to sign
            you in — see "How your password is handled" below).</li>
          <li><b>Profile info:</b> your course, year, an optional profile
            photo, and any interests you choose to add.</li>
          <li><b>Activity info:</b> activities you host or join, your
            check-ins, and your attendance history — this is how your
            "show-up record" is calculated.</li>
        </ul>
        <p>We do not collect your email address, phone number, or location.</p>

        <h2>How your password is handled</h2>
        <p>
          Passwords are managed by Supabase Authentication, our backend
          provider. We never see or store your password in plain text — it is
          hashed by Supabase before storage, the standard practice for
          handling passwords securely.
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To show your name, photo, and course/year to other students
            when you host or join an activity.</li>
          <li>To calculate and display your show-up record.</li>
          <li>To let other students see who's attending an activity before
            they join.</li>
        </ul>
        <p>We do not sell your data, and we do not share it with anyone
          outside of what's visible in the app itself.</p>

        <h2>Where your data is stored</h2>
        <p>
          Show Up is built on Supabase, a third-party backend service. Your
          data is stored on Supabase's servers, subject to
          {" "}<a href="https://supabase.com/privacy" target="_blank" rel="noreferrer">Supabase's own privacy policy</a>.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li><b>Edit or remove info</b> — you can update your course, year,
            photo, and interests any time from Edit Profile.</li>
          <li><b>Delete your account</b> — you can request full deletion of
            your account and all associated data at any time by emailing
            {" "}{CONTACT_EMAIL}. We will delete your data within a reasonable
            time of your request.</li>
        </ul>

        <h2>Changes to this policy</h2>
        <p>
          If this policy changes, we'll update the date at the top of this
          page. Continuing to use Show Up after a change means you accept the
          updated policy.
        </p>

        <h2>Contact</h2>
        <p>Questions about this policy or your data: {CONTACT_EMAIL}</p>
      </div>
    </>
  )
}
