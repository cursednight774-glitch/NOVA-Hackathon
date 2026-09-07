import { supabase } from './supabaseClient.js'

// ============================================================
//  src/api.js  —  THE ONLY FILE THAT KNOWS WHERE DATA COMES FROM.
//
//  Screens import functions from here and NEVER touch Supabase
//  directly. Right now these functions return fake arrays that
//  live in memory. Later, their INSIDES get swapped for Supabase
//  queries — and not a single screen has to change.
//
//  Rule: if a screen imports `supabase`, something has gone wrong.
// ============================================================

// ------------------------------------------------------------
// 0. WHO IS LOGGED IN
//
//    DEMO_MODE = true   → pretend person 3 is signed in. Fake data.
//                         Works with no Supabase and no auth.js.
//    DEMO_MODE = false  → real login. Needs src/auth.js to exist and
//                         someone to have signed up.
//
//    Flip this ONE line when login is built. Nothing else changes.
// ------------------------------------------------------------
export const DEMO_MODE = false

export let ME = DEMO_MODE ? 3 : null

/** Work out who is signed in. main.jsx calls this ONCE before rendering —
 *  if it doesn't, every screen loads thinking you're a stranger. */
export async function loadMe() {
  if (DEMO_MODE) return people.find(p => p.id === ME)
  // imported here, not at the top, so this file still works before
  // auth.js exists
  const { getMe } = await import("./auth.js")
  const me = await getMe()
  ME = me?.id ?? null
  return me
}

// ------------------------------------------------------------
// 1. THE VENUE LIST
//    Must stay IDENTICAL to the `venues` table in Supabase.
//    Add a venue → add it in both places, until day 3–5 when this
//    array is deleted and replaced by getVenues().
//    Free-text venues are NOT allowed anywhere in the app: this list
//    is the only thing keeping the app on campus.
// ------------------------------------------------------------
export const VENUES = [
  "Aero Clubroom",
  "Amphitheatre",
  "Badminton court",
  "Basketball court",
  "Football ground",
  "Idea Lab",
  "Kalam Auditorium",
  "Library",
  "Robotics Clubroom",
  "Sceptix Clubroom",
  "Student Square",
  "Volleyball court",
]

// ------------------------------------------------------------
// 2. THE INTEREST LIBRARY  — three groups, searchable, extendable.
// ------------------------------------------------------------
export const INTERESTS = {
  studies: [
    "AI", "Aptitude", "Blockchain", "CAD", "Case studies", "Circuits", "Cloud",
    "Competitive programming", "Cybersecurity", "Data science", "DevOps", "DSA",
    "Embedded systems", "Entrepreneurship", "Finance", "GATE prep", "GRE prep",
    "IoT", "Machine learning", "Mobile app dev", "Placement prep", "Power systems",
    "Public speaking", "Research papers", "Robotics", "Structural design",
    "Surveying", "Thermodynamics", "VLSI", "Web dev",
  ],
  sports: [
    "Archery", "Athletics", "Badminton", "Basketball", "Boxing", "Calisthenics",
    "Carrom", "Chess", "Cricket", "Cycling", "Football", "Frisbee", "Gym",
    "Hockey", "Kabaddi", "Kho kho", "Long distance running", "Marathon training",
    "Martial arts", "Rock climbing", "Skating", "Sprinting", "Swimming",
    "Table tennis", "Tennis", "Throwball", "Trekking", "Volleyball",
    "Weightlifting", "Yoga",
  ],
  hobbies: [
    "3D printing", "Animation", "Anime", "Baking", "BGMI", "Board games",
    "Café hopping", "Cooking", "Dance", "Drums", "Film editing", "Gaming",
    "Gardening", "Graphic design", "Guitar", "Modding", "Movies",
    "Music production", "Painting", "PC building", "Pets", "Photography",
    "Piano", "Poetry", "Rap", "Reading", "Singing", "Sketching", "Stand-up",
    "Theatre", "Travel", "UI design", "Valorant", "Videography", "Volunteering",
    "Writing",
  ],
}

// ------------------------------------------------------------
// 3. CATEGORY MATCHING  — turns a free-text title into a colour.
//    Host can override; this is only the first guess.
// ------------------------------------------------------------
const WORDS = {
  sport: ["basketball", "football", "cricket", "badminton", "volleyball", "tennis",
          "throwball", "kabaddi", "hockey", "run", "jog", "gym", "swim", "cycle",
          "trek", "match", "5v5", "5-a-side", "athletics", "yoga", "workout", "sports"],
  study: ["study", "dsa", "revision", "exam", "assignment", "project", "lab",
          "coding", "prep", "doubt", "seminar", "class", "notes", "viva",
          "presentation", "aptitude", "placement", "interview"],
}
export function categoryOf(title = "") {
  const t = title.toLowerCase()
  if (WORDS.sport.some(w => t.includes(w))) return "sport"
  if (WORDS.study.some(w => t.includes(w))) return "study"
  return "social"
}

// ------------------------------------------------------------
// 4. FAKE DATA  — deleted once Supabase is wired in.
// ------------------------------------------------------------

/** n hours from now, rounded to the nearest half hour so the demo
 *  never shows times like "1:26 PM". */
function h(n) {
  const d = new Date(Date.now() + n * 3600 * 1000)
  d.setMinutes(d.getMinutes() < 30 ? 0 : 30, 0, 0)
  return d
}

let people = [
  { id: 1, name: "Rohan M",   username: "rohan_m",   course: "CSE", year: 2, avatar: null,
    interests: { studies: ["DSA"], sports: ["Basketball", "Gym"], hobbies: ["Gaming"] } },
  { id: 2, name: "Aisha K",   username: "aisha.k",   course: "ECE", year: 3, avatar: null,
    interests: { studies: ["Machine learning"], sports: ["Badminton"], hobbies: ["Photography", "Movies"] } },
  { id: 3, name: "Nihal A",   username: "nihal_a",   course: "CSE", year: 3, avatar: null,
    interests: { studies: ["DSA", "Robotics"], sports: ["Basketball", "Swimming"], hobbies: ["3D printing", "Guitar"] } },
  { id: 4, name: "Meghana R", username: "meghana_r", course: "AIML", year: 1, avatar: null,
    interests: { studies: ["Web dev"], sports: ["Badminton"], hobbies: ["Sketching"] } },
  { id: 5, name: "Karan P",   username: "karan.p",   course: "ME",  year: 4, avatar: null,
    interests: { studies: ["CAD"], sports: ["Football"], hobbies: ["PC building"] } },
]

// --- three things happening now, so the home rail has content ---
let activities = [
  { id: 1, hostId: 1, title: "Basketball at Court B", category: "sport",
    startsAt: h(2), endsAt: h(4), venue: "Basketball court", meetingPoint: "by the nets",
    capacity: 10, strictLimit: false, cancelled: false,
    joins: [ j(1), j(2), j(5) ] },

  { id: 2, hostId: 2, title: "DSA revision before the test", category: "study",
    startsAt: h(6), endsAt: h(8), venue: "Library", meetingPoint: "2nd floor, back tables",
    capacity: 6, strictLimit: true, cancelled: false,
    joins: [ j(2), j(4), j(3) ] },

  { id: 3, hostId: 3, title: "Robotics build night", category: "study",
    startsAt: h(5), endsAt: h(7), venue: "Robotics Clubroom", meetingPoint: "workbench 2",
    capacity: 8, strictLimit: false, cancelled: false,
    joins: [ j(3) ] },
]

// --- ten finished ones, so records, stubs and disputes are real ---
// [ title, category, venue, meeting point, hours ago it started,
//   who joined (first id = host), who actually turned up ]
const PAST = [
  ["Morning run",         "sport",  "Football ground",    "by the gate",       -240, [1,3],     [1,3]],
  ["Football 5-a-side",   "sport",  "Football ground",    "near the goalpost", -216, [1,3,5],   [1,3,5]],
  ["DSA doubt clearing",  "study",  "Library",            "2nd floor",         -192, [2,3,4],   [2,4]],
  ["Badminton doubles",   "sport",  "Badminton court",    "court 1",           -168, [2,3,4],   [2,3,4]],
  ["Open mic night",      "social", "Amphitheatre",       "front steps",       -144, [5,3,2,4], [5,2,4]],
  ["Project sprint",      "study",  "Idea Lab",           "back bench",        -120, [4,3],     [4]],
  ["Basketball practice", "sport",  "Basketball court",   "by the nets",       -96,  [1,3,5],   [1,3,5]],
  ["Movie night",         "social", "Kalam Auditorium",   "back row",          -72,  [5,3,2,4], [5,3,4]],
  ["Photography walk",    "social", "Student Square",     "main steps",        -40,  [3,2,4],   [3,2]],
  ["Volleyball, 3 sets",  "sport",  "Volleyball court",   "court side",        -20,  [3,1],     [3,1]],
]

let nextId = 4
PAST.forEach(([title, category, venue, meetingPoint, start, joined, showed]) => {
  activities.push({
    id: nextId++, hostId: joined[0], title, category, venue, meetingPoint,
    startsAt: h(start), endsAt: h(start + 2),
    capacity: 10, strictLimit: false, cancelled: false,
    joins: joined.map(id => j(id, showed.includes(id) ? start + 0.1 : null)),
  })
})

function j(personId, checkedInHoursAgo) {
  return {
    personId,
    checkedIn: checkedInHoursAgo == null ? null : h(checkedInHoursAgo),
    flaggedAbsent: false,
  }
}

// ------------------------------------------------------------
// 4b. SUPABASE HELPERS  — used by every swapped function
// ------------------------------------------------------------

// While you're mid-swap, some functions read Supabase and some still read
// the fake arrays. `person()` checks the cache first, then falls back to
// the fake `people` array. Delete the fallback once everything is swapped.
let cache = {}
function person(id) { return cache[id] || people.find(p => p.id === id) }

/** Fetch any profiles we don't already have, once. */
async function loadPeople(ids) {
  const missing = [...new Set(ids)].filter(id => id && !cache[id])
  if (!missing.length) return
  const { data } = await supabase.from('profiles').select('*').in('id', missing)
  ;(data || []).forEach(p => { cache[p.id] = p })
}

/** THE TRANSLATOR: database snake_case -> screen camelCase.
 *  This function existing is why your teammate never has to know
 *  the database exists. */
function fromRow(a, joinRows = []) {
  return {
    id: a.id,
    hostId: a.host_id,
    title: a.title,
    category: a.category,
    startsAt: new Date(a.starts_at),
    endsAt: new Date(a.ends_at),
    venue: a.venue,
    meetingPoint: a.meeting_point,
    capacity: a.capacity,
    strictLimit: a.strict_limit,
    cancelled: a.cancelled,
    reviewed: a.reviewed,
    joins: joinRows.map(j => ({
      personId: j.profile_id,
      checkedIn: j.checked_in_at ? new Date(j.checked_in_at) : null,
      flaggedAbsent: j.flagged_absent,
    })),
  }
}

// ------------------------------------------------------------
// 5. RULES  — used by both the UI and (later) the database layer.
// ------------------------------------------------------------

/** How many people the app will actually let in.
 *  Buffer of +2 unless the host switched on Strict limit. */
export function seatLimit(a) {
  return a.strictLimit ? a.capacity : a.capacity + 2
}

/** Where an activity is in its life. Drives the big button. */
export function phaseOf(a, now = new Date()) {
  const opens  = new Date(a.startsAt.getTime() - 10 * 60 * 1000)  // 10 min BEFORE start
  const closes = new Date(a.endsAt.getTime()   + 10 * 60 * 1000)  // 10 min AFTER end
  if (now < opens)  return "before"
  if (now <= closes) return "window"
  return "closed"
}

/** Leaving is free until one hour before the start. */
export function canLeaveFreely(a, now = new Date()) {
  return now < new Date(a.startsAt.getTime() - 60 * 60 * 1000)
}

// ------------------------------------------------------------
// 6. READS
// ------------------------------------------------------------

function decorate(a) {
  const joined = a.joins.length
  return {
    ...a,
    host:    person(a.hostId),
    going:   a.joins.map(x => ({ ...person(x.personId), join: x })),
    joined,                                   // real number of people coming
    capacity: a.capacity,                     // the host's number — what everyone sees
    seats:    seatLimit(a),                   // internal, includes the buffer
    isFull:   joined >= seatLimit(a),
    iJoined:  a.joins.some(x => x.personId === ME),
    iCheckedIn: a.joins.some(x => x.personId === ME && x.checkedIn),
    phase:   phaseOf(a),
  }
}

export async function getActivities({ category } = {}) {
  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString()

  let q = supabase.from('activities').select('*')
    .eq('cancelled', false)
    .gt('ends_at', cutoff)
    .order('starts_at', { ascending: true })
    .limit(15)
  if (category) q = q.eq('category', category)

  const { data: acts, error } = await q
  if (error) { console.error(error); return [] }
  if (!acts.length) return []

  const { data: joins } = await supabase.from('joins').select('*')
    .in('activity_id', acts.map(a => a.id))

  await loadPeople([...acts.map(a => a.host_id), ...(joins || []).map(j => j.profile_id)])

  return acts.map(a =>
    decorate(fromRow(a, (joins || []).filter(j => j.activity_id === a.id))))
}

export async function getActivity(id) {
  const { data: a, error } = await supabase.from('activities')
    .select('*').eq('id', id).single()
  if (error || !a) return null

  const { data: joins } = await supabase.from('joins').select('*').eq('activity_id', a.id)
  await loadPeople([a.host_id, ...(joins || []).map(j => j.profile_id)])
  return decorate(fromRow(a, joins || []))
}

export async function getProfile(id) {
  const p = people.find(x => x.id === Number(id))
  if (!p) return null
  return { ...p, record: await getRecord(p.id), isMe: p.id === ME }
}

/** THE RECORD. Always computed, never stored — so it can't drift.
 *  Rolling last 10 finished activities. Hidden under 3. */
export async function getRecord(personId) {
  const id = Number(personId)
  const now = new Date()
  const finished = activities
    .filter(a => !a.cancelled && a.endsAt < now)
    .filter(a => a.joins.some(x => x.personId === id))
    .sort((x, y) => x.endsAt - y.endsAt)
    .slice(-10)

  if (finished.length < 3) return { newHere: true, of: finished.length }

  const pips = finished.map(a => {
    const mine = a.joins.find(x => x.personId === id)
    return Boolean(mine.checkedIn && !mine.flaggedAbsent)
  })
  return { newHere: false, showed: pips.filter(Boolean).length, of: pips.length, pips }
}

/** Everything within the next hour — the "starting soon" strip. */
export async function getStartingSoon() {
  const now = new Date(), hour = new Date(Date.now() + 3600 * 1000)
  return activities
    .filter(a => !a.cancelled && a.startsAt > now && a.startsAt < hour)
    .sort((x, y) => x.startsAt - y.startsAt)
    .map(decorate)
}

/** A stub exists ONLY if you checked in and weren't flagged.
 *  available = checked in within the last 24h. collected = older. */
export async function getStubs(personId = ME) {
  const id = Number(personId)
  const cutoff = new Date(Date.now() - 24 * 3600 * 1000)
  const mine = activities
    .filter(a => !a.cancelled && a.endsAt < new Date())
    .map(a => ({ a, join: a.joins.find(x => x.personId === id) }))
    .filter(x => x.join && x.join.checkedIn && !x.join.flaggedAbsent)
    .sort((x, y) => y.a.endsAt - x.a.endsAt)

  return {
    available: mine.filter(x => x.a.endsAt >= cutoff).map(x => stub(x.a, id)),
    collected: mine.filter(x => x.a.endsAt <  cutoff).map(x => stub(x.a, id)),
  }
}

function stub(a, personId) {
  const me = people.find(p => p.id === personId)
  return {
    id: a.id,
    title: a.title,
    category: a.category,
    venue: a.venue,
    date: a.endsAt,
    username: me.username,
    turnedUp: a.joins
      .filter(x => x.checkedIn && !x.flaggedAbsent)
      .map(x => people.find(p => p.id === x.personId))
      .filter(Boolean),
    serial: String(a.id * 37 + personId).padStart(4, "0"),
  }
}

/** Finished activities I hosted that I haven't reviewed yet.
 *  Auto-expires after 48h — after that everyone is simply accepted. */
export async function getDisputes(personId = ME) {
  const id = Number(personId), now = new Date()
  return activities
    .filter(a => a.hostId === id && !a.cancelled && a.endsAt < now)
    .filter(a => now - a.endsAt < 48 * 3600 * 1000)
    .filter(a => !a.reviewed)
    .sort((x, y) => y.endsAt - x.endsAt)
    .map(decorate)
}

// ------------------------------------------------------------
// 7. WRITES  — every one returns either the object or { error }
// ------------------------------------------------------------

export async function createActivity(fields) {
  const { data, error } = await supabase.from('activities').insert({
    host_id:       ME,
    title:         fields.title,
    category:      fields.category,
    venue:         fields.venue,
    meeting_point: fields.meetingPoint,
    starts_at:     fields.startsAt.toISOString(),
    ends_at:       fields.endsAt.toISOString(),
    capacity:      fields.capacity,
    strict_limit:  fields.strictLimit,
  }).select().single()

  if (error) { console.error(error); return { error: 'Could not post it. Try again.' } }

  // the host is automatically going to their own activity
  await supabase.from('joins').insert({ activity_id: data.id, profile_id: ME })
  return getActivity(data.id)
}

export async function joinActivity(id) {
  const a = activities.find(x => x.id === Number(id))
  if (!a) return { error: "Activity not found" }
  if (a.joins.some(x => x.personId === ME)) return { error: "You've already joined" }
  if (a.joins.length >= seatLimit(a))       return { error: "This one's full" }
  a.joins.push({ personId: ME, checkedIn: null, flaggedAbsent: false })
  return decorate(a)
}

export async function leaveActivity(id) {
  const a = activities.find(x => x.id === Number(id))
  if (!a) return { error: "Activity not found" }
  if (!canLeaveFreely(a)) return { error: "Too late to leave without a no-show" }
  a.joins = a.joins.filter(x => x.personId !== ME)
  return decorate(a)
}

export async function checkIn(id) {
  const a = activities.find(x => x.id === Number(id))
  if (!a) return { error: "Activity not found" }
  const phase = phaseOf(a)
  if (phase === "before") return { error: "Check-in opens 10 minutes before the start" }
  if (phase === "closed") return { error: "The check-in window has closed" }
  const mine = a.joins.find(x => x.personId === ME)
  if (!mine) return { error: "You haven't joined this" }
  mine.checkedIn = new Date()
  return decorate(a)
}

export async function cancelActivity(id) {
  const a = activities.find(x => x.id === Number(id))
  if (!a) return { error: "Activity not found" }
  if (a.hostId !== ME) return { error: "Only the host can cancel" }
  a.cancelled = true
  return decorate(a)
}

/** Host review. absentIds = the people who did NOT show up.
 *  Default is trust: anyone not in this list stays counted as present. */
export async function submitDispute(activityId, absentIds = []) {
  const a = activities.find(x => x.id === Number(activityId))
  if (!a) return { error: "Activity not found" }
  if (a.hostId !== ME) return { error: "Only the host can review this" }
  a.joins.forEach(x => { x.flaggedAbsent = absentIds.includes(x.personId) })
  a.reviewed = true
  return decorate(a)
}

export async function updateProfile(fields) {
  const p = people.find(x => x.id === ME)
  Object.assign(p, fields)
  return { ...p }
}