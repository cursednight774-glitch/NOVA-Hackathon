// src/auth.js
import { supabase } from './supabaseClient.js'

// "Nihal A" -> "nihal a@sjec.local"  — never shown to anyone
const fakeEmail = name => `${name.trim().toLowerCase().replace(/\s+/g, '.')}@sjec.local`

export async function signUp(name, password, course, year) {
  const { data, error } = await supabase.auth.signUp({
    email: fakeEmail(name),
    password,
  })
  if (error) return { error: error.message }

  // create their profile row straight away
  const { error: e2 } = await supabase.from('profiles').insert({
    id: data.user.id,
    name,
    username: name.trim().toLowerCase().replace(/\s+/g, '_'),
    course,
    year,
    interests: { studies: [], sports: [], hobbies: [] },
  })
  if (e2) return { error: e2.message }
  return { ok: true }
}

export async function signIn(name, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email: fakeEmail(name),
    password,
  })
  return error ? { error: 'Wrong name or password' } : { ok: true }
}

export async function signOut() {
  await supabase.auth.signOut()
}

/** The logged-in person's profile row, or null. */
export async function getMe() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data
}