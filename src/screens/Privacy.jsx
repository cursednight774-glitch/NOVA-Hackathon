// src/screens/Privacy.jsx — Privacy Policy.
// Plain content page, no data fetching. Keep this in sync with what
// auth.js / api.js actually collect and store — this is a legal
// document, not just app copy.

import { AppBar, BackIcon } from "../components.jsx"

const UPDATED = "September 2026"
const CONTACT_EMAIL = "mnihalayoob@gmail.com"

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

        <h2>How we use your account identifier</h2>
        <p>
          To support sign-in, the app creates an internal account identifier
          from the name you provide. This identifier is used by the
          authentication system and is not displayed to other students as an
          email address. Please do not enter someone else's name or any
          sensitive information into your profile.
        </p>

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

        <h2>Who can see your information</h2>
        <p>
          Other signed-in users may see the profile and activity information
          that the app displays, including your name, photo, course, year,
          interests, activities you join, and attendance record. Information
          submitted through the app may also be accessible to the project
          administrators and the service providers that operate the app.
        </p>

        <h2>Cookies and local storage</h2>
        <p>
          The app may use browser storage and authentication session data to
          keep you signed in and remember the current app session. We do not
          use this app to serve third-party advertising or sell advertising
          profiles.
        </p>

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

        <h2>How long we keep information</h2>
        <p>
          We keep account, profile, activity, and attendance information while
          your account is active or while it is reasonably needed to operate
          the service, resolve disputes, prevent abuse, or meet legal
          obligations. You may request deletion at any time using the contact
          address below. Some information may remain where retention is
          required by law or needed to establish, exercise, or defend legal
          claims.
        </p>

        <h2>Third-party services</h2>
        <p>
          We rely on Supabase for authentication, database hosting, and
          related infrastructure. Those services process information on our
          behalf and may have their own terms and privacy practices. Review
          <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer"> Supabase's privacy policy</a>.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If this policy changes, we'll update the date at the top of this
          page. Continuing to use Show Up after a change means you accept the
          updated policy.
        </p>

        <h2>Contact</h2>
        <p>Questions about this policy or your data: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
      </div>
    </>
  )
}
