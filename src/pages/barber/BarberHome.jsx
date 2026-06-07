import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SHOP_CONFIG as C } from './config'
import { useAuthStore } from '../../store/authStore'
import { getBarbers, getServices, createBooking, submitContact } from '../../lib/supabase'
import AddOnsDrawer from '../../components/barber/AddOnsDrawer'
import FloatingButtons from '../../components/barber/FloatingButtons'
import AuthModal from '../../components/barber/AuthModal'
import { scrollToSection } from '../../components/barber/scrollUtils'
import toast from 'react-hot-toast'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' }

function parseHourToken(tok) {
  const m = tok.trim().match(/^(\d{1,2})(am|pm)$/i)
  if (!m) return null
  let h = parseInt(m[1], 10)
  const mer = m[2].toLowerCase()
  if (mer === 'pm' && h !== 12) h += 12
  if (mer === 'am' && h === 12) h = 0
  return h
}

function buildTimeSlots(hoursStr, durationMin) {
  if (!hoursStr || /closed/i.test(hoursStr)) return []
  const [startTok, endTok] = hoursStr.split(/[–-]/).map(s => s.trim())
  const start = parseHourToken(startTok)
  const end = parseHourToken(endTok)
  if (start == null || end == null) return []
  const step = durationMin && durationMin <= 30 ? 30 : 30
  const slots = []
  for (let mins = start * 60; mins + (durationMin || 30) <= end * 60; mins += step) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    const hour12 = h % 12 === 0 ? 12 : h % 12
    slots.push(`${hour12}:${m === 0 ? '00' : '30'} ${h >= 12 ? 'PM' : 'AM'}`)
  }
  return slots
}

// deterministic pseudo-random "taken" slots for demo realism
function isSlotTaken(dateKey, barberName, slot) {
  let hash = 0
  const str = `${dateKey}|${barberName}|${slot}`
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  return hash % 5 === 0
}

function nextDays(n) {
  const out = []
  const today = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    out.push(d)
  }
  return out
}

function fmtDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
function dateKey(d) { return d.toISOString().split('T')[0] }

function buildICS({ title, description, start, durationMin }) {
  const pad = (n) => String(n).padStart(2, '0')
  const fmt = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
  const end = new Date(start.getTime() + durationMin * 60000)
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Demo Barbershop//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@demobarbershop.demo`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  return new Blob([ics], { type: 'text/calendar' })
}

function downloadICS(data) {
  const blob = buildICS(data)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'appointment.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const sectionLabel = (text) => (
  <span style={{
    display: 'inline-block', fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 3,
    textTransform: 'uppercase', fontWeight: 600, color: C.accentColor, marginBottom: 10,
  }}>{text}</span>
)

const sectionTitle = (text) => (
  <h2 style={{
    fontFamily: "'Playfair Display', serif", fontSize: 'clamp(34px, 6vw, 54px)', color: C.textPrimary,
    letterSpacing: 0.5, marginBottom: 16,
  }}>{text}</h2>
)

function Lightbox({ images, index, onClose, onChange }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [index, images.length, onClose, onChange])

  const navBtnStyle = {
    background: 'rgba(255,255,255,0.08)', border: `1px solid ${C.borderSubtle}`, color: '#fff', borderRadius: '50%',
    width: 44, height: 44, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <button type="button" onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 20, right: 20, ...navBtnStyle }}>✕</button>
      <button type="button" onClick={e => { e.stopPropagation(); onChange((index - 1 + images.length) % images.length) }} aria-label="Previous" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', ...navBtnStyle }}>←</button>
      <img src={images[index]} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, objectFit: 'contain' }} />
      <button type="button" onClick={e => { e.stopPropagation(); onChange((index + 1) % images.length) }} aria-label="Next" style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', ...navBtnStyle }}>→</button>
    </div>
  )
}

export default function BarberHome() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t) }, [])

  // ── Live barbers/services (fall back to config) ──
  const [barbers, setBarbers] = useState(C.barbers)
  const [services, setServices] = useState(C.services.map(s => ({ name: s.name, price_cents: s.price * 100, duration: s.duration })))
  useEffect(() => {
    getBarbers().then(({ data }) => { if (data && data.length) setBarbers(data) }).catch(() => {})
    getServices().then(({ data }) => { if (data && data.length) setServices(data) }).catch(() => {})
  }, [])

  const serviceList = useMemo(() => services.map(s => ({
    id: s.id,
    name: s.name,
    price: s.price_cents != null ? s.price_cents / 100 : s.price,
    duration: s.duration || '30 min',
  })), [services])

  // ── Booking flow state ───────────────────────────
  const [step, setStep] = useState(1)
  const [selBarber, setSelBarber] = useState(null)
  const [selService, setSelService] = useState(null)
  const [selDate, setSelDate] = useState(null)
  const [selTime, setSelTime] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  const days = useMemo(() => nextDays(7), [])

  const durationMin = useMemo(() => {
    if (!selService?.duration) return 30
    const m = String(selService.duration).match(/(\d+)/)
    return m ? parseInt(m[1], 10) : 30
  }, [selService])

  const dayKeyFor = (d) => DAY_KEYS[d.getDay()]
  const timeSlots = useMemo(() => {
    if (!selDate) return []
    const hours = C.hours[dayKeyFor(selDate)]
    return buildTimeSlots(hours, durationMin)
  }, [selDate, durationMin])

  const bookBarber = (barber) => {
    if (barber.available === false) return
    setSelBarber(barber)
    setStep(1)
    scrollToSection('book')
  }

  const goToStep = (n) => {
    if (n === 2 && !selBarber) return toast.error('Select a barber first')
    if (n === 3 && !selService) return toast.error('Select a service first')
    if (n === 4 && (!selDate || !selTime)) return toast.error('Pick a date and time')
    setStep(n)
  }

  const resetBooking = () => {
    setConfirmation(null); setStep(1); setSelBarber(null); setSelService(null); setSelDate(null); setSelTime(null)
    scrollToSection('book')
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    const confNumber = `BC-${Math.floor(1000 + Math.random() * 9000)}`
    const [time, meridiem] = selTime.split(' ')
    let [hh, mm] = time.split(':').map(Number)
    if (meridiem === 'PM' && hh !== 12) hh += 12
    if (meridiem === 'AM' && hh === 12) hh = 0
    const bookedAt = new Date(selDate)
    bookedAt.setHours(hh, mm, 0, 0)

    try {
      await createBooking({
        customer_id: user?.id ?? null,
        barber_id: selBarber?.id ?? null,
        service_id: selService?.id ?? null,
        booked_at: bookedAt.toISOString(),
        status: 'confirmed',
      })
    } catch { /* demo mode */ }

    setConfirmation({
      number: confNumber,
      barber: selBarber?.name,
      service: selService?.name,
      date: fmtDate(selDate),
      time: selTime,
      price: selService?.price,
      bookedAt,
    })
    setSubmitting(false)
  }

  // ── Contact form ─────────────────────────────────
  const [contact, setContact] = useState({ name: '', email: '', message: '' })
  const [contactErrors, setContactErrors] = useState({})
  const [contactSent, setContactSent] = useState(false)
  const [contactSubmitting, setContactSubmitting] = useState(false)

  const setContactField = (k, v) => {
    setContact(c => ({ ...c, [k]: v }))
    setContactErrors(errs => ({ ...errs, [k]: undefined }))
  }

  const validateContact = () => {
    const errs = {}
    if (!contact.name.trim()) errs.name = 'Name is required'
    if (!contact.email.trim()) errs.email = 'Email is required'
    else if (!EMAIL_RE.test(contact.email.trim())) errs.email = 'Enter a valid email address'
    if (!contact.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const submitContactForm = async (e) => {
    e.preventDefault()
    const errs = validateContact()
    setContactErrors(errs)
    if (Object.keys(errs).length > 0) return
    setContactSubmitting(true)
    try {
      await submitContact({ shop_id: C.shopId, ...contact })
      setContactSent(true)
      setContact({ name: '', email: '', message: '' })
    } catch { toast.error('Something went wrong — try again later') }
    setContactSubmitting(false)
  }

  const fieldStyle = (key) => ({ borderColor: contactErrors[key] ? '#ef4444' : C.borderSubtle })

  const todayKey = DAY_KEYS[new Date().getDay()]

  return (
    <div style={{ background: C.bgPrimary, color: C.textPrimary, fontFamily: "'Inter', sans-serif" }}>

      {/* ───────── HERO ───────── */}
      <section id="home" style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${C.heroImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{
          padding: '0 20px', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <span style={{
            display: 'inline-block', fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
            fontWeight: 700, color: '#0a0a0a', background: C.accentColor, borderRadius: 100, padding: '7px 18px', marginBottom: 22,
          }}>PREMIUM BARBERSHOP APP</span>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 800, color: '#fff',
            fontSize: 'clamp(48px, 11vw, 90px)', letterSpacing: 1, lineHeight: 1.02, margin: '6px 0',
          }}>{C.name}</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(14px, 2.2vw, 20px)', letterSpacing: 4, textTransform: 'uppercase', color: C.accentColor, fontWeight: 600 }}>
            Barbershop
          </p>
          <p style={{ fontStyle: 'italic', color: C.textSecondary, fontSize: 17, marginTop: 14 }}>
            {C.tagline}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
            <button type="button" onClick={() => scrollToSection('book')} className="brb-btn-gold">Book Your Cut</button>
            <button type="button" onClick={() => scrollToSection('barbers')} className="brb-btn-outline">Meet the Barbers</button>
          </div>
        </div>

        <button type="button" onClick={() => scrollToSection('barbers')} aria-label="Scroll down" style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'none', border: 'none',
          color: C.accentColor, fontSize: 26, cursor: 'pointer', animation: 'brbBounce 2s infinite',
        }}>↓</button>
      </section>

      {/* ───────── BARBERS ───────── */}
      <section id="barbers" style={{ background: C.bgPrimary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('Our Team')}
          {sectionTitle('Meet the Barbers')}
          <p style={{ color: C.textSecondary, maxWidth: 480, margin: '0 auto 36px' }}>
            Skilled hands, sharp tools, no shortcuts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, textAlign: 'left' }}>
            {barbers.map(b => {
              const initials = b.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
              const available = b.available !== false
              return (
                <div key={b.name} className="brb-barber-card" style={{
                  background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: 26,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6,
                  transition: 'transform 0.2s, border-color 0.2s', position: 'relative',
                }}>
                  {!available && (
                    <span style={{
                      position: 'absolute', top: 16, right: 16, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
                      fontWeight: 700, color: '#fca5a5', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)',
                      borderRadius: 100, padding: '4px 10px',
                    }}>Not Available</span>
                  )}
                  <div style={{
                    width: 84, height: 84, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1f1f1f, #2a2a2a)', border: `2px solid ${C.accentColor}`,
                    fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.accentColor, marginBottom: 6,
                  }}>{initials}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: C.textPrimary }}>{b.name}</h3>
                  <p style={{ color: C.accentColor, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{b.specialty}</p>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                    {C.services.slice(0, 4).map(s => (
                      <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.textSecondary, padding: '4px 0', borderBottom: `1px solid ${C.borderSubtle}` }}>
                        <span>{s.name}</span><span style={{ color: C.textPrimary }}>${s.price}</span>
                      </div>
                    ))}
                  </div>
                  {b.instagram && (
                    <a href={`https://instagram.com/${b.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: C.accentColor, fontSize: 13, textDecoration: 'none', marginBottom: 14 }}>
                      📸 {b.instagram}
                    </a>
                  )}
                  <button type="button" onClick={() => bookBarber(b)} disabled={!available} className={available ? 'brb-btn-gold' : ''} style={{
                    width: '100%', textAlign: 'center',
                    ...(available ? {} : {
                      background: '#2a2a2a', color: '#666', border: 'none', borderRadius: 8, padding: '13px 28px',
                      fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 1, cursor: 'not-allowed',
                    }),
                  }}>Book {b.name}</button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────── BOOK ───────── */}
      <section id="book" style={{ background: C.bgSecondary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('Book Online')}
          {sectionTitle('Reserve Your Spot')}

          {confirmation ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: '40px 28px', textAlign: 'center', animation: 'brbFadeIn 0.4s ease' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: C.accentColor, marginBottom: 10 }}>You're Booked ✂</h3>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, letterSpacing: 1, margin: '14px 0' }}>#{confirmation.number}</p>
              <p style={{ color: C.textSecondary, marginBottom: 4 }}>with {confirmation.barber} · {confirmation.service}</p>
              <p style={{ color: C.textPrimary, fontSize: 16, marginBottom: 4 }}>{confirmation.date} at {confirmation.time}</p>
              <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 24 }}>${confirmation.price?.toFixed ? confirmation.price.toFixed(2) : confirmation.price}</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => downloadICS({
                  title: `${confirmation.service} with ${confirmation.barber} — ${C.name}`,
                  description: `Appointment at ${C.name}. ${C.address}`,
                  start: confirmation.bookedAt,
                  durationMin,
                })} className="brb-btn-outline">📅 Add to Calendar</button>
                <button type="button" onClick={resetBooking} className="brb-btn-gold">Book Another</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32, flexWrap: 'wrap' }}>
                {['Barber', 'Service', 'Date & Time', 'Confirm'].map((label, i) => {
                  const n = i + 1
                  return (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                        background: step >= n ? C.accentColor : 'transparent', color: step >= n ? '#0a0a0a' : C.textSecondary,
                        border: `1px solid ${step >= n ? C.accentColor : C.borderSubtle}`,
                      }}>{n}</div>
                      <span style={{ fontSize: 12, color: step >= n ? C.textPrimary : C.textSecondary, letterSpacing: 0.5 }}>{label}</span>
                      {n < 4 && <span style={{ width: 20, height: 1, background: C.borderSubtle, margin: '0 2px' }} />}
                    </div>
                  )
                })}
              </div>

              <div style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: 28, textAlign: 'left' }}>
                {step === 1 && (
                  <>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Select your barber</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 18 }}>
                      {barbers.map(b => {
                        const available = b.available !== false
                        const selected = selBarber?.name === b.name
                        return (
                          <button key={b.name} type="button" disabled={!available} onClick={() => setSelBarber(b)} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 10px',
                            borderRadius: 10, cursor: available ? 'pointer' : 'not-allowed',
                            background: selected ? `${C.accentColor}22` : 'transparent',
                            border: `1px solid ${selected ? C.accentColor : C.borderSubtle}`,
                            opacity: available ? 1 : 0.45, transition: 'all 0.2s',
                          }}>
                            <span style={{
                              width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: '#222', border: `1px solid ${C.accentColor}`, fontFamily: "'Playfair Display', serif", color: C.accentColor, fontSize: 16,
                            }}>{b.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</span>
                            <span style={{ fontSize: 14, color: C.textPrimary }}>{b.name}</span>
                            <span style={{ fontSize: 11, color: C.textSecondary }}>{available ? b.specialty : 'Not Available'}</span>
                          </button>
                        )
                      })}
                    </div>
                    <button type="button" onClick={() => goToStep(2)} className="brb-btn-gold">Continue →</button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Select a service</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                      {serviceList.map(s => {
                        const selected = selService?.name === s.name
                        return (
                          <button key={s.name} type="button" onClick={() => setSelService(s)} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left',
                            padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                            background: selected ? `${C.accentColor}22` : 'transparent',
                            border: `1px solid ${selected ? C.accentColor : C.borderSubtle}`, transition: 'all 0.2s',
                          }}>
                            <span>
                              <span style={{ display: 'block', color: C.textPrimary, fontSize: 15 }}>{s.name}</span>
                              <span style={{ fontSize: 12, color: C.textSecondary }}>{s.duration}</span>
                            </span>
                            <span style={{ color: C.accentColor, fontWeight: 700 }}>${s.price.toFixed(2)}</span>
                          </button>
                        )
                      })}
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button type="button" onClick={() => setStep(1)} className="brb-btn-outline">← Back</button>
                      <button type="button" onClick={() => goToStep(3)} className="brb-btn-gold">Continue →</button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Pick a date & time</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                      {days.map(d => {
                        const selected = selDate && dateKey(selDate) === dateKey(d)
                        const closed = /closed/i.test(C.hours[dayKeyFor(d)] || '')
                        return (
                          <button key={dateKey(d)} type="button" disabled={closed} onClick={() => { setSelDate(d); setSelTime(null) }} style={{
                            padding: '10px 16px', borderRadius: 100, fontSize: 13, cursor: closed ? 'not-allowed' : 'pointer',
                            background: selected ? C.accentColor : 'transparent', color: selected ? '#0a0a0a' : (closed ? '#555' : C.textPrimary),
                            border: `1px solid ${selected ? C.accentColor : C.borderSubtle}`, transition: 'all 0.2s',
                          }}>{fmtDate(d)}{closed ? ' · Closed' : ''}</button>
                        )
                      })}
                    </div>
                    {selDate && (
                      timeSlots.length === 0 ? (
                        <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 16 }}>No time slots available for this day.</p>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8, marginBottom: 18 }}>
                          {timeSlots.map(slot => {
                            const taken = isSlotTaken(dateKey(selDate), selBarber?.name || '', slot)
                            const selected = selTime === slot
                            return (
                              <button key={slot} type="button" disabled={taken} onClick={() => setSelTime(slot)} style={{
                                padding: '10px 6px', borderRadius: 8, fontSize: 12, cursor: taken ? 'not-allowed' : 'pointer',
                                background: selected ? C.accentColor : 'transparent',
                                color: selected ? '#0a0a0a' : (taken ? '#666' : C.textPrimary),
                                border: `1px solid ${selected ? C.accentColor : C.borderSubtle}`,
                                textDecoration: taken ? 'line-through' : 'none', transition: 'all 0.2s',
                              }}>{slot}</button>
                            )
                          })}
                        </div>
                      )
                    )}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button type="button" onClick={() => setStep(2)} className="brb-btn-outline">← Back</button>
                      <button type="button" onClick={() => goToStep(4)} className="brb-btn-gold">Review →</button>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Confirm your booking</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, fontSize: 14, color: C.textSecondary }}>
                      <div>Barber: <span style={{ color: C.textPrimary }}>{selBarber?.name}</span></div>
                      <div>Service: <span style={{ color: C.textPrimary }}>{selService?.name}</span> ({selService?.duration})</div>
                      <div>Date: <span style={{ color: C.textPrimary }}>{selDate && fmtDate(selDate)}</span></div>
                      <div>Time: <span style={{ color: C.textPrimary }}>{selTime}</span></div>
                      <div style={{ borderTop: `1px solid ${C.borderSubtle}`, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: C.textPrimary }}>
                        <span>Price</span><span style={{ color: C.accentColor }}>${selService?.price?.toFixed(2)}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: C.accentColor, marginBottom: 16 }}>💳 Stripe deposit at booking — Coming Soon</p>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button type="button" onClick={() => setStep(3)} className="brb-btn-outline">← Back</button>
                      <button type="button" onClick={handleConfirm} disabled={submitting} className="brb-btn-gold" style={{ opacity: submitting ? 0.6 : 1 }}>
                        {submitting ? 'Booking...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ───────── GALLERY ───────── */}
      <section id="gallery" style={{ background: C.bgPrimary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('A Look Inside')}
          {sectionTitle('The Shop')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {C.galleryImages.map((src, i) => (
              <div key={i} className="brb-gallery-item" onClick={() => setLightboxIndex(i)} style={{
                borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.borderSubtle}`, aspectRatio: '4/3', position: 'relative', cursor: 'pointer',
              }}>
                <img src={src} alt={`${C.name} ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s' }} />
                <div className="brb-gallery-overlay" style={{ position: 'absolute', inset: 0, border: `2px solid ${C.accentColor}`, borderRadius: 12, opacity: 0, transition: 'opacity 0.25s' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── VISIT ───────── */}
      <section id="visit" style={{ background: C.bgSecondary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            {sectionLabel('Visit Us')}
            {sectionTitle('Stop By')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="brb-visit-grid">
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 14 }}>Hours</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
                {DAY_KEYS.map(day => {
                  const isToday = day === todayKey
                  const closed = /closed/i.test(C.hours[day] || '')
                  return (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: `1px solid ${C.borderSubtle}` }}>
                      <span style={{ color: isToday ? C.accentColor : C.textPrimary, fontWeight: isToday ? 700 : 400 }}>{DAY_NAMES[day]}{isToday && ' · Today'}</span>
                      <span style={{ color: isToday ? C.accentColor : (closed ? '#555' : C.textSecondary) }}>{C.hours[day]}</span>
                    </div>
                  )
                })}
              </div>
              <p style={{ fontSize: 14, color: C.textPrimary, marginBottom: 4 }}>{C.address}</p>
              <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 18 }}>{C.phone}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={C.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="brb-btn-outline">Get Directions on Google</a>
                <a href={C.appleMapsUrl} target="_blank" rel="noopener noreferrer" className="brb-btn-outline">Open in Apple Maps</a>
                <a href={`https://instagram.com/${C.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="brb-btn-outline">📸 {C.instagram}</a>
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 14, textAlign: 'center' }}>Send Us a Message</h3>
              {contactSent ? (
                <p style={{ color: C.accentColor, fontSize: 15, textAlign: 'center', animation: 'brbFadeIn 0.4s ease' }}>Message sent! We'll be in touch soon.</p>
              ) : (
                <form onSubmit={submitContactForm} style={{ display: 'flex', flexDirection: 'column', gap: 4, animation: 'brbFadeIn 0.4s ease' }}>
                  <div>
                    <input className="brb-input" placeholder="Name" value={contact.name} onChange={e => setContactField('name', e.target.value)} style={fieldStyle('name')} />
                    {contactErrors.name && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{contactErrors.name}</span>}
                  </div>
                  <div>
                    <input className="brb-input" type="email" placeholder="Email" value={contact.email} onChange={e => setContactField('email', e.target.value)} style={fieldStyle('email')} />
                    {contactErrors.email && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{contactErrors.email}</span>}
                  </div>
                  <div>
                    <textarea className="brb-input" rows={4} placeholder="Message" value={contact.message} onChange={e => setContactField('message', e.target.value)} style={fieldStyle('message')} />
                    {contactErrors.message && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{contactErrors.message}</span>}
                  </div>
                  <button type="submit" disabled={contactSubmitting} className="brb-btn-gold" style={{ marginTop: 10 }}>{contactSubmitting ? 'Sending...' : 'Send Message'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <AddOnsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <FloatingButtons onOpenAddOns={() => setDrawerOpen(true)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {lightboxIndex !== null && (
        <Lightbox images={C.galleryImages} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} />
      )}

      <style>{`
        @keyframes brbBounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        @keyframes brbFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .brb-btn-gold {
          display: inline-block; background: ${C.accentColor}; color: #0a0a0a; border: none; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1px;
          padding: 13px 28px; cursor: pointer; text-decoration: none; transition: transform 0.2s, filter 0.2s;
        }
        .brb-btn-gold:hover { transform: scale(1.03); filter: brightness(1.1); }
        .brb-btn-gold:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
        .brb-btn-outline {
          display: inline-block; background: transparent; color: #fff; border: 1px solid ${C.accentColor}; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 1px;
          padding: 12px 26px; cursor: pointer; text-decoration: none; transition: transform 0.2s, background 0.2s;
        }
        .brb-btn-outline:hover { transform: scale(1.03); background: rgba(201,162,39,0.1); }
        .brb-barber-card:hover { transform: translateY(-4px); border-color: ${C.accentColor}66; }
        .brb-input, .brb-select {
          width: 100%; background: #0f0f0f; color: ${C.textPrimary}; border: 1px solid ${C.borderSubtle};
          border-radius: 8px; padding: 11px 14px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none;
          margin-top: 6px; color-scheme: dark; transition: border-color 0.2s;
        }
        .brb-input:focus, .brb-select:focus { border-color: ${C.accentColor}; }
        .brb-gallery-item:hover img { transform: scale(1.06); }
        .brb-gallery-item:hover .brb-gallery-overlay { opacity: 1; }
        @media (max-width: 860px) {
          .brb-visit-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
