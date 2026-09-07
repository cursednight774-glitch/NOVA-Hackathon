// src/api.js
// Every bit of data the app uses comes from this file.
// Screens import from here and nowhere else.

// ---------- WHO IS LOGGED IN (temporary) ----------
const ME = 3   // pretend Nihal is logged in until real login exists

// ---------- FAKE DATA ----------

let people = [
  { id: 1, name: "Rohan M",   year: 2, branch: "CSE",
    interests: ["Basketball", "Photography"], lookingFor: "Games most evenings" },
  { id: 2, name: "Aisha K",   year: 3, branch: "ECE",
    interests: ["Photography", "Music"],      lookingFor: "People to shoot with" },
  { id: 3, name: "Nihal A",   year: 3, branch: "CSE",
    interests: ["Basketball", "3D printing"], lookingFor: "Evening games" },
  { id: 4, name: "Meghana R", year: 1, branch: "CSE",
    interests: ["Badminton", "Photography"],  lookingFor: "A badminton partner" },
]

let activities = [
  {
    id: 1,
    hostId: 1,
    title: "Basketball at the main court",
    startsAt: new Date("2026-09-12T16:00:00"),
    endsAt:   new Date("2026-09-12T18:00:00"),
    venue: "Court B",
    meetingPoint: "By the nets",
    capacity: 10,
    tag: "sport",
    cancelled: false,
    joins: [
      { personId: 1, checkedIn: null, flaggedAbsent: false },
      { personId: 2, checkedIn: null, flaggedAbsent: false },
    ],
  },
  {
    id: 2,
    hostId: 2,
    title: "Photography walk, golden hour",
    startsAt: new Date("2026-09-13T06:30:00"),
    endsAt:   new Date("2026-09-13T08:00:00"),
    venue: "Front lawn",
    meetingPoint: "Main gate",
    capacity: 6,
    tag: "social",
    cancelled: false,
    joins: [{ personId: 4, checkedIn: null, flaggedAbsent: false }],
  },
  // add about 12 more once your venue list is done
]

let nextId = 3

// ---------- HELPER ----------

function decorate(a) {
  return {
    ...a,
    host:  people.find(p => p.id === a.hostId),
    going: a.joins.map(j => people.find(p => p.id === j.personId)),
    spots: a.capacity ? a.capacity - a.joins.length : null,
    iJoined: a.joins.some(j => j.personId === ME),
  }
}

// ---------- READING ----------

export async function getActivities() {
  return activities
    .filter(a => !a.cancelled)
    .sort((x, y) => x.startsAt - y.startsAt)
    .map(decorate)
}

export async function getActivity(id) {
  const a = activities.find(a => a.id === Number(id))
  return a ? decorate(a) : null
}

export async function getPeople() {
  const me = people.find(p => p.id === ME)
  return people
    .filter(p => p.id !== ME)
    .map(p => ({
      ...p,
      shared: p.interests.filter(i => me.interests.includes(i)).length,
    }))
    .sort((x, y) => y.shared - x.shared)
}

export async function getProfile(id) {
  return people.find(p => p.id === Number(id))
}

// ---------- WRITING (with our rules) ----------

export async function createActivity(fields) {
  const a = {
    id: nextId++,
    hostId: ME,
    cancelled: false,
    joins: [{ personId: ME, checkedIn: null, flaggedAbsent: false }],
    ...fields,
  }
  activities.push(a)
  return decorate(a)
}

export async function joinActivity(id) {
  const a = activities.find(a => a.id === Number(id))
  if (!a) return { error: "Activity not found" }
  if (a.joins.some(j => j.personId === ME)) return { error: "You've already joined" }
  if (a.capacity && a.joins.length >= a.capacity) return { error: "This one's full" }

  a.joins.push({ personId: ME, checkedIn: null, flaggedAbsent: false })
  return decorate(a)
}

export async function leaveActivity(id) {
  const a = activities.find(a => a.id === Number(id))
  if (!a) return { error: "Activity not found" }

  const hourBefore = new Date(a.startsAt.getTime() - 60 * 60 * 1000)
  if (new Date() > hourBefore) return { error: "Too late to leave without a no-show" }

  a.joins = a.joins.filter(j => j.personId !== ME)
  return decorate(a)
}

export async function checkIn(id) {
  const a = activities.find(a => a.id === Number(id))
  if (!a) return { error: "Activity not found" }

  const now = new Date()
  const opens = new Date(a.startsAt.getTime() - 10 * 60 * 1000)
  if (now < opens)    return { error: "Check-in opens 10 minutes before the start" }
  if (now > a.endsAt) return { error: "This one's already over" }

  const mine = a.joins.find(j => j.personId === ME)
  if (!mine) return { error: "You haven't joined this" }

  mine.checkedIn = now
  return decorate(a)
}

// ---------- THE SHOW-UP RECORD ----------

export async function getRecord(personId) {
  const id = Number(personId)
  const finished = activities
    .filter(a => !a.cancelled && a.endsAt < new Date())
    .filter(a => a.joins.some(j => j.personId === id))
    .slice(-10)

  if (finished.length < 3) return { newHere: true }

  const showed = finished.filter(a =>
    a.joins.some(j => j.personId === id && j.checkedIn && !j.flaggedAbsent)
  ).length

  return { showed, of: finished.length }
}