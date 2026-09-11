// src/screens/Terms.jsx — Terms of Service.
// Plain content page, no data fetching. Keep this in sync with the actual
// rules enforced in api.js (seatLimit, phaseOf, canLeaveFreely, disputes) —
// this describes real behavior, not aspirational copy.

import { AppBar, BackIcon } from "../components.jsx"

const UPDATED = "September 2026"
const CONTACT_EMAIL = "TODO@replace.me" // <-- put your real contact email here

// onBack: optional, same pattern as Privacy.jsx — pass this when showing
// Terms outside the router (e.g. from Login.jsx, before any router exists).
export default function Terms({ onBack }) {
  return (
    <>
      <AppBar title="Terms of Service"
              left={onBack
                ? <button className="icon" onClick={onBack}>‹</button>
                : <BackIcon />} />
      <div className="page legal">
        <p className="muted">Last updated: {UPDATED}</p>

        <p>
          Show Up is an independent student project built for SJEC students,
          used to organize and join real, in-person meetups. It is not an
          official college app and is not operated or endorsed by SJEC. By
          creating an account, you agree to the terms below.
        </p>

        <h2>What Show Up is for</h2>
        <p>
          Show Up lets students post activities (sport, study, or social),
          and lets other students join them. It's meant for organizing real
          meetups between SJEC students who already share a campus — treat
          people you meet through it the way you'd treat any other
          classmate.
        </p>

        <h2>Joining and leaving activities</h2>
        <ul>
          <li>Activities have a capacity, sometimes with a couple of extra
            spots included as buffer — unless the host sets a strict limit,
            in which case the stated capacity is final.</li>
          <li>You can leave an activity freely any time up until one hour
            before it starts. Leaving after that point, or not showing up
            after checking in, can affect your show-up record.</li>
          <li>Checking in is how you confirm you actually turned up — it's
            only available in the window around the activity's start and end
            time.</li>
        </ul>

        <h2>Your show-up record</h2>
        <p>
          Show Up tracks whether you turn up to things you've joined. This is
          shown to other students so they know who to expect. Hosts can flag
          someone as a no-show after an activity ends if that person checked
          in but didn't actually attend — this is reviewed by the host, not
          verified independently by Show Up.
        </p>

        <h2>Hosting an activity</h2>
        <p>
          If you host an activity, you're responsible for the details you
          post being accurate, and for reviewing no-shows honestly. You can
          cancel an activity you're hosting before it starts.
        </p>

        <h2>Meeting people in person</h2>
        <p>
          Show Up connects you with other students for real, in-person
          meetups. Use the same judgment you would meeting anyone new —
          meet in public places, especially the first time, and trust your
          own comfort level. Show Up does not run background checks on
          users and is not responsible for what happens at an activity or
          between users outside the app.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Post fake activities or misuse the "starting soon" or capacity
            system to mislead others.</li>
          <li>Harass, threaten, or misrepresent yourself to other students.</li>
          <li>Use Show Up for anything illegal or against SJEC's own student
            conduct policies.</li>
        </ul>
        <p>We can suspend or remove accounts that break these rules.</p>

        <h2>No guarantees</h2>
        <p>
          Show Up is a student-built project, provided as-is. We do our best
          to keep it working, but we don't guarantee it'll always be
          available, error-free, or that every activity posted is genuine.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          If these terms change, we'll update the date at the top of this
          page. Continuing to use Show Up after a change means you accept
          the updated terms.
        </p>

        <h2>Contact</h2>
        <p>Questions about these terms: {CONTACT_EMAIL}</p>
      </div>
    </>
  )
}
