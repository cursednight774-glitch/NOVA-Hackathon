// src/screens/Terms.jsx — Terms of Service.
// Plain content page, no data fetching. Keep this in sync with the actual
// rules enforced in api.js (seatLimit, phaseOf, canLeaveFreely, disputes) —
// this describes real behavior, not aspirational copy.

import { AppBar, BackIcon } from "../components.jsx"

const UPDATED = "September 2026"
const CONTACT_EMAIL = "mnihalayoob@gmail.com"

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

        <h2>Eligibility and your account</h2>
        <p>
          You may use Show Up only if you are eligible to participate in the
          student community for which it is provided and can legally agree to
          these terms. You are responsible for providing accurate information,
          keeping your account secure, and all activity that occurs through
          your account. Do not share your sign-in details or create an account
          for someone else.
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

        <h2>User content and feedback</h2>
        <p>
          You keep ownership of the information and content you submit. You
          give Show Up permission to host, store, display, and format that
          content as needed to provide the service. You promise that your
          content is accurate enough for its purpose, does not violate another
          person's rights, and is not unlawful or harmful. We may remove
          content that violates these terms or creates a safety, legal, or
          operational risk.
        </p>

        <h2>Reporting problems</h2>
        <p>
          Report harassment, impersonation, unsafe activity, inaccurate
          attendance flags, or other misuse to {CONTACT_EMAIL}. We may review
          reports and take action, but we cannot guarantee that every report
          will result in a particular outcome or that every user-provided
          statement can be independently verified.
        </p>

        <h2>No guarantees</h2>
        <p>
          Show Up is a student-built project, provided as-is. We do our best
          to keep it working, but we don't guarantee it'll always be
          available, error-free, or that every activity posted is genuine.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, the people who build and
          maintain Show Up are not liable for indirect, incidental, special,
          consequential, or punitive losses, or for injury, loss, or damage
          arising from interactions, activities, or arrangements between
          users. Nothing in these terms excludes liability that cannot legally
          be excluded.
        </p>

        <h2>Suspension and ending your use</h2>
        <p>
          You may stop using Show Up at any time. We may suspend or end access
          when reasonably necessary to protect users, investigate misuse,
          comply with law, or operate the project. Ending access does not
          remove terms that are intended to continue, including provisions
          about content, liability, and disputes.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws applicable in India, without
          giving effect to conflict-of-law rules. Any dispute that cannot be
          resolved informally will be handled by a court with appropriate
          jurisdiction, unless applicable law requires another forum.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          If these terms change, we'll update the date at the top of this
          page. Continuing to use Show Up after a change means you accept
          the updated terms.
        </p>

        <h2>Contact</h2>
        <p>Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
      </div>
    </>
  )
}
