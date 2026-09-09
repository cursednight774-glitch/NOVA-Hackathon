import { supabase } from './supabaseClient.js'

// ============================================================
//  src/api.js  —  THE ONLY FILE THAT KNOWS WHERE DATA COMES FROM.
//  Fully wired to Supabase. Screens never import `supabase` directly.
// ============================================================

// ------------------------------------------------------------
// 0. WHO IS LOGGED IN
// ------------------------------------------------------------
export const DEMO_MODE = false
export let ME = null

/** Work out who is signed in. main.jsx calls this ONCE before rendering —
 *  if it doesn't, every screen loads thinking you're a stranger. */
export async function loadMe() {
  const { getMe } = await import("./auth.js")
  const me = await getMe()
  ME = me?.id ?? null
  return me
}

// ------------------------------------------------------------
// 1. THE VENUE LIST — fallback only. getVenues() reads the real table.
// ------------------------------------------------------------
export const VENUES = [
  "Aero Clubroom", "Amphitheatre", "Badminton court", "Basketball court",
  "Football ground", "Idea Lab", "Kalam Auditorium", "Library",
  "Robotics Clubroom", "Sceptix Clubroom", "Student Square", "Volleyball court",
]

export async function getVenues() {
  const { data, error } = await supabase.from('venues').select('name').order('name')
  if (error || !data) { console.error(error); return VENUES }
  return data.map(v => v.name)
}

// ------------------------------------------------------------
// 2. THE INTEREST LIBRARY
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
// 3. CATEGORY MATCHING
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
// 4. PROFILE CACHE — avoids re-fetching the same person repeatedly
// ------------------------------------------------------------
let cache = {}
function person(id) { return cache[id] }

async function loadPeople(ids) {
  const missing = [...new Set(ids)].filter(id => id && !cache[id])
  if (!missing.length) return
  const { data } = await supabase.from('profiles').select('*').in('id', missing)
  ;(data || []).forEach(p => { cache[p.id] = p })
}

/** database snake_case -> screen camelCase */
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

/** Takes raw activity rows, fetches their joins + people, returns
 *  fully decorated activities. Every list query uses this. */
async function hydrate(acts) {
  if (!acts || !acts.length) return []
  const { data: joins } = await supabase.from('joins').select('*')
    .in('activity_id', acts.map(a => a.id))
  await loadPeople([...acts.map(a => a.host_id), ...(joins || []).map(j => j.profile_id)])
  return acts.map(a =>
    decorate(fromRow(a, (joins || []).filter(j => j.activity_id === a.id))))
}

function serialFor(activityId, personId) {
  const n = String(personId).split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  return String((activityId * 137 + n) % 10000).padStart(4, '0')
}

// ------------------------------------------------------------
// 5. RULES
// ------------------------------------------------------------
export function seatLimit(a) {
  return a.strictLimit ? a.capacity : a.capacity + 2
}

export function phaseOf(a, now = new Date()) {
  const opens  = new Date(a.startsAt.getTime() - 10 * 60 * 1000)
  const closes = new Date(a.endsAt.getTime()   + 10 * 60 * 1000)
  if (now < opens)  return "before"
  if (now <= closes) return "window"
  return "closed"
}

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
    joined,
    capacity: a.capacity,
    seats:    seatLimit(a),
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
  return hydrate(acts)
}

export async function getActivity(id) {
  const { data: a, error } = await supabase.from('activities')
    .select('*').eq('id', id).single()
  if (error || !a) return null
  const [one] = await hydrate([a])
  return one ?? null
}

export async function getProfile(id) {
  if (!id) return null

  let p = cache[id]
  if (!p) {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (!data) return null
    cache[id] = data
    p = data
  }

  return {
    ...p,
    avatar: p.avatar_url,
    interests: p.interests || { studies: [], sports: [], hobbies: [] },
    record: await getRecord(id),
    isMe: id === ME,
  }
}

/** THE RECORD. Always computed, never stored — so it can't drift.
 *  Rolling last 10 finished activities. Hidden under 3. */
export async function getRecord(personId) {
  if (!personId) return { newHere: true, of: 0 }

  const { data: joins } = await supabase.from('joins')
    .select('activity_id, checked_in_at, flagged_absent')
    .eq('profile_id', personId)
  if (!joins || !joins.length) return { newHere: true, of: 0 }

  const { data: acts } = await supabase.from('activities')
    .select('id, ends_at')
    .in('id', joins.map(j => j.activity_id))
    .eq('cancelled', false)
    .lt('ends_at', new Date().toISOString())
    .order('ends_at', { ascending: true })

  const finished = (acts || []).slice(-10)
  if (finished.length < 3) return { newHere: true, of: finished.length }

  const pips = finished.map(a => {
    const j = joins.find(x => x.activity_id === a.id)
    return Boolean(j.checked_in_at && !j.flagged_absent)
  })
  return { newHere: false, showed: pips.filter(Boolean).length, of: pips.length, pips }
}

export async function getStartingSoon() {
  const { data: acts } = await supabase.from('activities').select('*')
    .eq('cancelled', false)
    .gt('starts_at', new Date().toISOString())
    .lt('starts_at', new Date(Date.now() + 3600 * 1000).toISOString())
    .order('starts_at', { ascending: true })
  return hydrate(acts)
}

export async function getStubs(personId = ME) {
  const empty = { available: [], collected: [] }
  if (!personId) return empty

  const { data: mine } = await supabase.from('joins')
    .select('activity_id, checked_in_at, flagged_absent')
    .eq('profile_id', personId)
    .not('checked_in_at', 'is', null)
  const good = (mine || []).filter(j => !j.flagged_absent)
  if (!good.length) return empty

  const { data: acts } = await supabase.from('activities').select('*')
    .in('id', good.map(j => j.activity_id))
    .eq('cancelled', false)
    .lt('ends_at', new Date().toISOString())
    .order('ends_at', { ascending: false })
  if (!acts || !acts.length) return empty

  const { data: allJoins } = await supabase.from('joins').select('*')
    .in('activity_id', acts.map(a => a.id))
  await loadPeople([personId, ...(allJoins || []).map(j => j.profile_id)])

  const cutoff = Date.now() - 24 * 3600 * 1000
  const make = a => stub(fromRow(a, (allJoins || []).filter(j => j.activity_id === a.id)), personId)

  return {
    available: acts.filter(a => new Date(a.ends_at).getTime() >= cutoff).map(make),
    collected: acts.filter(a => new Date(a.ends_at).getTime() <  cutoff).map(make),
  }
}

function stub(a, personId) {
  const me = person(personId)
  return {
    id: a.id,
    title: a.title,
    category: a.category,
    venue: a.venue,
    date: a.endsAt,
    username: me?.username || 'you',
    turnedUp: a.joins
      .filter(x => x.checkedIn && !x.flaggedAbsent)
      .map(x => person(x.personId))
      .filter(Boolean),
    serial: serialFor(a.id, personId),
  }
}

export async function getDisputes(personId = ME) {
  if (!personId) return []
  const { data: acts } = await supabase.from('activities').select('*')
    .eq('host_id', personId)
    .eq('cancelled', false)
    .eq('reviewed', false)
    .lt('ends_at', new Date().toISOString())
    .gt('ends_at', new Date(Date.now() - 48 * 3600 * 1000).toISOString())
    .order('ends_at', { ascending: false })
  return hydrate(acts)
}

// ------------------------------------------------------------
// 7. WRITES — every one returns either the object or { error }
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

  await supabase.from('joins').insert({ activity_id: data.id, profile_id: ME })
  return getActivity(data.id)
}

export async function joinActivity(id) {
  const a = await getActivity(id)
  if (!a) return { error: "Activity not found" }
  if (a.iJoined) return { error: "You've already joined" }
  if (a.joined >= seatLimit(a)) return { error: "This one's full" }

  const { error } = await supabase.from('joins')
    .insert({ activity_id: id, profile_id: ME })
  if (error) { console.error(error); return { error: "Could not join. Try again." } }
  return getActivity(id)
}

export async function leaveActivity(id) {
  const a = await getActivity(id)
  if (!a) return { error: "Activity not found" }
  if (!canLeaveFreely(a)) return { error: "Too late to leave without a no-show" }

  const { error } = await supabase.from('joins').delete()
    .eq('activity_id', id).eq('profile_id', ME)
  if (error) { console.error(error); return { error: "Could not leave. Try again." } }
  return getActivity(id)
}

export async function checkIn(id) {
  const a = await getActivity(id)
  if (!a) return { error: "Activity not found" }
  const phase = phaseOf(a)
  if (phase === "before") return { error: "Check-in opens 10 minutes before the start" }
  if (phase === "closed") return { error: "The check-in window has closed" }
  if (!a.iJoined) return { error: "You haven't joined this" }

  const { error } = await supabase.from('joins')
    .update({ checked_in_at: new Date().toISOString() })
    .eq('activity_id', id).eq('profile_id', ME)
  if (error) { console.error(error); return { error: "Could not check in. Try again." } }
  return getActivity(id)
}

export async function cancelActivity(id) {
  const a = await getActivity(id)
  if (!a) return { error: "Activity not found" }
  if (a.hostId !== ME) return { error: "Only the host can cancel" }
  const { error } = await supabase.from('activities').update({ cancelled: true }).eq('id', id)
  if (error) { console.error(error); return { error: "Could not cancel. Try again." } }
  return getActivity(id)
}

export async function submitDispute(activityId, absentIds = []) {
  const a = await getActivity(activityId)
  if (!a) return { error: "Activity not found" }
  if (a.hostId !== ME) return { error: "Only the host can review this" }

  await supabase.from('joins').update({ flagged_absent: false }).eq('activity_id', activityId)
  if (absentIds.length) {
    await supabase.from('joins').update({ flagged_absent: true })
      .eq('activity_id', activityId).in('profile_id', absentIds)
  }
  await supabase.from('activities').update({ reviewed: true }).eq('id', activityId)
  return getActivity(activityId)
}

export async function updateProfile(fields) {
  if (!ME) return { error: "Not signed in" }
  const row = {}
  if (fields.avatar    !== undefined) row.avatar_url = fields.avatar
  if (fields.course    !== undefined) row.course     = fields.course
  if (fields.year      !== undefined) row.year       = fields.year
  if (fields.interests !== undefined) row.interests  = fields.interests

  const { data, error } = await supabase.from('profiles')
    .update(row).eq('id', ME).select().single()
  if (error) { console.error(error); return { error: "Could not save. Try again." } }
  cache[ME] = data
  return data
}
