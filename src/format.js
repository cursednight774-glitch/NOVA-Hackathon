// src/format.js turning dates and numbers into words. No logic lives here.
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const YEARS = {
  1: "1st year (Freshman)",
  2: "2nd year (Sophomore)",
  3: "3rd year (Junior)",
  4: "4th year (Senior)",
}

export const COURSES = [
  "CSE",
  "ISE",
  "AIML",
  "ECE",
  "EEE",
  "ME",
  "CV",
  "MBA",
  "MCA",
]

export function time(d) {
  let hrs = d.getHours(),
    m = d.getMinutes()
  const ap = hrs >= 12 ? "PM" : "AM"
  hrs = hrs % 12 || 12
  return m === 0 ? `${hrs} ${ap}` : `${hrs}:${String(m).padStart(2, "0")} ${ap}`
}

export function dayLabel(d) {
  const now = new Date()
  const same = (a, b) => a.toDateString() === b.toDateString()
  if (same(d, now)) return "Today"
  const tom = new Date(now.getTime() + 86400000)
  if (same(d, tom)) return "Tomorrow"
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function shortDate(d) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** "Today 4:00-6:00 PM" */
export function whenLine(a) {
  return `${dayLabel(a.startsAt)} ${time(a.startsAt)}-${time(a.endsAt)}`
}

/** "in 26m" / "in 3h" / "started" */
export function countdown(target, now = new Date()) {
  const mins = Math.round((target - now) / 60000)
  if (mins <= 0) return "now"
  if (mins < 60) return `in ${mins}m`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `in ${hrs}h`
  return `in ${Math.round(hrs / 24)}d`
}

/** The one place that decides how a join count is worded.
Under the host's number: "6 of 10 joined"
Over it (buffer in play): "12 going"
never "12 of 10". */
export function joinLine(a) {
  return a.joined < a.capacity
    ? `${a.joined} of ${a.capacity} joined`
    : `${a.joined} going`
}

/* Colour a fallback avatar from the name, deterministically. */
export function avatarColor(name = "") {
  const vars = ["--brand", "--study", "--social", "--ok", "--warn"]
  let sum = 0
  for (const ch of name) sum += ch.charCodeAt(0)
  return `var(${vars[sum % vars.length]})`
}