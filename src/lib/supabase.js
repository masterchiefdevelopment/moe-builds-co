import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
})

export const signUp = ({ email, password, fullName }) =>
  supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })

export const signIn = ({ email, password }) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getBarbers = () =>
  supabase.from('barbers').select('*').eq('is_active', true).order('name')

export const getServices = () =>
  supabase.from('services').select('*').eq('is_active', true).order('price_cents')

export const createBooking = (booking) =>
  supabase.from('bookings').insert(booking).select().single()

export const getCustomerBookings = (customerId) =>
  supabase
    .from('bookings')
    .select('*, barbers(name), services(name, price_cents)')
    .eq('customer_id', customerId)
    .order('booked_at', { ascending: false })
