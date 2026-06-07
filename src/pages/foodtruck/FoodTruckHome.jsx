import { useEffect, useMemo, useState } from 'react'
import { TRUCK_CONFIG as C } from './config'
import { useAuthStore } from '../../store/authStore'
import { createOrder, getCustomerOrders, getProfile, submitContact } from '../../lib/supabase'
import AddOnsDrawer from '../../components/foodtruck/AddOnsDrawer'
import FloatingButtons from '../../components/foodtruck/FloatingButtons'
import AuthModal from '../../components/foodtruck/AuthModal'
import { scrollToSection } from '../../components/foodtruck/scrollUtils'
import toast from 'react-hot-toast'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CATEGORIES = Object.keys(C.menu)
const STAMPS = 10
const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' }

function parseHourToken(tok) {
  // e.g. "11am" "3pm" "12pm"
  const m = tok.trim().match(/^(\d{1,2})(am|pm)$/i)
  if (!m) return null
  let h = parseInt(m[1], 10)
  const mer = m[2].toLowerCase()
  if (mer === 'pm' && h !== 12) h += 12
  if (mer === 'am' && h === 12) h = 0
  return h
}

function buildTimeSlotsFromHours(hoursStr) {
  if (!hoursStr || /closed/i.test(hoursStr)) return []
  const [startTok, endTok] = hoursStr.split(/[–-]/).map(s => s.trim())
  const start = parseHourToken(startTok)
  const end = parseHourToken(endTok)
  if (start == null || end == null) return []
  const slots = []
  for (let h = start; h < end; h++) {
    for (const m of [0, 30]) {
      const hour12 = h % 12 === 0 ? 12 : h % 12
      slots.push(`${hour12}:${m === 0 ? '00' : '30'} ${h >= 12 ? 'PM' : 'AM'}`)
    }
  }
  return slots
}

const sectionLabel = (text) => (
  <span style={{
    display: 'inline-block', fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 3,
    textTransform: 'uppercase', fontWeight: 600, color: C.accentAmber, marginBottom: 10,
  }}>{text}</span>
)

const sectionTitle = (text) => (
  <h2 style={{
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(34px, 6vw, 54px)', color: C.textPrimary,
    letterSpacing: 1.5, marginBottom: 16,
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

export default function FoodTruckHome() {
  const { user, profile, setProfile } = useAuthStore()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t) }, [])

  const [activeCategory, setActiveCategory] = useState('All')
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return CATEGORIES.flatMap(cat => C.menu[cat])
    return C.menu[activeCategory] || []
  }, [activeCategory])

  // ── Order / cart state ───────────────────────────
  const [cart, setCart] = useState([])
  const [step, setStep] = useState(1)
  const [pickupTime, setPickupTime] = useState('')
  const [form, setForm] = useState({ name: '', phone: '' })
  const [confirmation, setConfirmation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const todayKey = DAY_KEYS[new Date().getDay()]
  const todaySchedule = C.schedule[todayKey]
  const TIME_SLOTS = useMemo(() => buildTimeSlotsFromHours(todaySchedule?.hours), [todaySchedule])

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name)
      if (existing) return prev.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
    toast.success(`Added ${item.name}`)
    setCartOpen(true)
  }
  const changeQty = (name, delta) => setCart(prev => prev
    .map(c => c.name === name ? { ...c, qty: c.qty + delta } : c)
    .filter(c => c.qty > 0))

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)

  const goToStep = (n) => {
    if (n === 2 && cart.length === 0) return toast.error('Add at least one item first')
    if (n === 3 && !pickupTime) return toast.error('Select a pickup time')
    setStep(n)
  }

  const handleConfirm = async () => {
    if (!form.name || !form.phone) return toast.error('Enter your name and phone')
    setSubmitting(true)
    const orderNumber = `FT-${Math.floor(1000 + Math.random() * 9000)}`
    try {
      await createOrder({
        restaurant_id: C.restaurantId,
        user_id: user?.id ?? null,
        items: cart,
        pickup_time: pickupTime,
        status: 'pending',
        total: subtotal,
      })
    } catch { /* demo mode */ }
    setConfirmation({ orderNumber, name: form.name, pickupTime, total: subtotal })
    setCart([]); setStep(1); setPickupTime(''); setForm({ name: '', phone: '' })
    setSubmitting(false)
  }

  const resetOrder = () => { setConfirmation(null); setStep(1); setCartOpen(false); scrollToSection('menu') }

  // ── Loyalty ──────────────────────────────────────
  const [orderCount, setOrderCount] = useState(0)
  useEffect(() => {
    if (!user) return
    Promise.all([getCustomerOrders(C.restaurantId, user.id), profile ? Promise.resolve({ data: profile }) : getProfile(user.id)])
      .then(([ordersRes, profileRes]) => {
        setOrderCount(ordersRes.data?.length ?? 0)
        if (profileRes.data) setProfile(profileRes.data)
      }).catch(() => {})
  }, [user])
  const earnedStamps = Math.min(orderCount, STAMPS)

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
      await submitContact({ restaurant_id: C.restaurantId, ...contact })
      setContactSent(true)
      setContact({ name: '', email: '', message: '' })
    } catch { toast.error('Something went wrong — try again later') }
    setContactSubmitting(false)
  }

  const fieldStyle = (key) => ({ borderColor: contactErrors[key] ? '#ef4444' : C.borderSubtle })

  return (
    <div style={{ background: C.bgPrimary, color: C.textPrimary, fontFamily: "'Inter', sans-serif" }}>

      {/* ───────── HERO ───────── */}
      <section id="home" style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.75)), url(${C.heroImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{
          padding: '0 20px', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <span style={{
            display: 'inline-block', fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
            fontWeight: 700, color: '#0d0d0d', background: C.accentColor, borderRadius: 100, padding: '7px 18px', marginBottom: 22,
          }}>🔥 Now Taking Orders</span>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, color: '#fff',
            fontSize: 'clamp(56px, 12vw, 100px)', letterSpacing: 3, lineHeight: 0.98, margin: '6px 0',
          }}>{C.name.toUpperCase()}</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(14px, 2.2vw, 20px)', letterSpacing: 4, textTransform: 'uppercase', color: C.accentAmber, fontWeight: 600 }}>
            Food Truck
          </p>
          <p style={{ fontStyle: 'italic', color: C.textSecondary, fontSize: 17, marginTop: 14 }}>
            {C.tagline}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
            <button type="button" onClick={() => scrollToSection('order')} className="ft-btn-orange">Order Now</button>
            <button type="button" onClick={() => scrollToSection('schedule')} className="ft-btn-outline">See Today's Location</button>
          </div>
        </div>

        <button type="button" onClick={() => scrollToSection('menu')} aria-label="Scroll down" style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'none', border: 'none',
          color: C.accentAmber, fontSize: 26, cursor: 'pointer', animation: 'ftBounce 2s infinite',
        }}>↓</button>
      </section>

      {/* ───────── MENU ───────── */}
      <section id="menu" style={{ background: C.bgPrimary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('Fresh Daily')}
          {sectionTitle('Today\'s Menu')}
          <p style={{ color: C.textSecondary, maxWidth: 480, margin: '0 auto 36px' }}>{C.tagline}</p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            {['All', ...CATEGORIES].map(cat => (
              <button key={cat} type="button" onClick={() => setActiveCategory(cat)} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                padding: '10px 22px', borderRadius: 100, cursor: 'pointer', transition: 'all 0.2s',
                background: activeCategory === cat ? C.accentColor : 'transparent',
                color: activeCategory === cat ? '#0d0d0d' : C.textPrimary,
                border: `1px solid ${activeCategory === cat ? C.accentColor : C.borderSubtle}`,
              }}
                onMouseEnter={e => { if (activeCategory !== cat) e.currentTarget.style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >{cat}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, textAlign: 'left' }}>
            {filteredItems.map(item => (
              <div key={item.name} className="ft-menu-card" style={{
                background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 22,
                display: 'flex', flexDirection: 'column', gap: 10, transition: 'transform 0.2s, border-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 21, color: C.textPrimary, letterSpacing: 1 }}>{item.name}</h3>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: C.accentAmber, whiteSpace: 'nowrap' }}>${item.price.toFixed(2)}</span>
                </div>
                <p style={{ color: C.textSecondary, fontSize: 14, lineHeight: 1.6, flex: 1 }}>{item.desc}</p>
                <button type="button" onClick={() => addToCart(item)} className="ft-add-btn" style={{
                  alignSelf: 'flex-start', background: 'transparent', color: C.accentColor, border: `1px solid ${C.accentColor}`,
                  borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1,
                  textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.accentColor; e.currentTarget.style.color = '#0d0d0d' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.accentColor }}
                >+ Add to Order</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ORDER ───────── */}
      <section id="order" style={{ background: C.bgSecondary, padding: '80px 20px', position: 'relative' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('Order Ahead')}
          {sectionTitle('Build Your Order')}

          {confirmation ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: '40px 28px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: C.accentAmber, marginBottom: 10, letterSpacing: 1 }}>Your order is being prepared 🔥</h3>
              <p style={{ color: C.textSecondary, marginBottom: 6 }}>Thanks, {confirmation.name} — we're firing it up.</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 3, margin: '14px 0' }}>#{confirmation.orderNumber}</p>
              <p style={{ color: C.textSecondary, fontSize: 14 }}>Pickup: {confirmation.pickupTime} · Estimated wait: 15–25 min</p>
              <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 24 }}>Total: ${confirmation.total.toFixed(2)}</p>
              <button type="button" onClick={resetOrder} className="ft-btn-outline" style={{ display: 'inline-block' }}>Place Another Order</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                {['Build Order', 'Your Info', 'Confirm'].map((label, i) => {
                  const n = i + 1
                  return (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                        background: step >= n ? C.accentColor : 'transparent', color: step >= n ? '#0d0d0d' : C.textSecondary,
                        border: `1px solid ${step >= n ? C.accentColor : C.borderSubtle}`,
                      }}>{n}</div>
                      <span style={{ fontSize: 13, color: step >= n ? C.textPrimary : C.textSecondary, letterSpacing: 1 }}>{label}</span>
                      {n < 3 && <span style={{ width: 28, height: 1, background: C.borderSubtle, margin: '0 4px' }} />}
                    </div>
                  )
                })}
              </div>

              <div style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: 28, textAlign: 'left' }}>
                {step === 1 && (
                  <>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, marginBottom: 16, letterSpacing: 1 }}>Pick your items</h3>
                    {cart.length === 0 ? (
                      <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 18 }}>
                        Your order is empty — browse the menu above and tap “+ Add to Order”.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                        {cart.map(c => (
                          <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 14 }}>{c.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <button type="button" onClick={() => changeQty(c.name, -1)} className="ft-qty-btn">−</button>
                              <span style={{ minWidth: 18, textAlign: 'center', fontSize: 14 }}>{c.qty}</span>
                              <button type="button" onClick={() => changeQty(c.name, 1)} className="ft-qty-btn">+</button>
                              <span style={{ minWidth: 56, textAlign: 'right', color: C.accentAmber, fontSize: 14 }}>${(c.price * c.qty).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                        <div style={{ borderTop: `1px solid ${C.borderSubtle}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                          <span>Subtotal</span><span style={{ color: C.accentAmber }}>${subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: C.textSecondary }}>Pickup Time (today: {todaySchedule?.hours || 'closed'})</label>
                    <select value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="ft-select">
                      <option value="">Select a time...</option>
                      {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                    {TIME_SLOTS.length === 0 && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>We're closed today — pick a time for your next visit!</p>}
                    <button type="button" onClick={() => goToStep(2)} className="ft-btn-orange" style={{ marginTop: 20, display: 'inline-block' }}>Continue →</button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, marginBottom: 16, letterSpacing: 1 }}>Your info</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: C.textSecondary }}>Name</label>
                        <input className="ft-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: C.textSecondary }}>Phone</label>
                        <input className="ft-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(210) 555-0100" />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: C.textSecondary }}>Pickup Time</label>
                        <select value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="ft-select">
                          <option value="">Select a time...</option>
                          {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
                      <button type="button" onClick={() => setStep(1)} className="ft-btn-outline">← Back</button>
                      <button type="button" onClick={() => goToStep(3)} className="ft-btn-orange">Review Order →</button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, marginBottom: 16, letterSpacing: 1 }}>Confirm your order</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, fontSize: 14, color: C.textSecondary }}>
                      {cart.map(c => (
                        <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{c.qty}× {c.name}</span><span style={{ color: C.accentAmber }}>${(c.price * c.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: `1px solid ${C.borderSubtle}`, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: C.textPrimary }}>
                        <span>Subtotal</span><span style={{ color: C.accentAmber }}>${subtotal.toFixed(2)}</span>
                      </div>
                      <div>Pickup: <span style={{ color: C.textPrimary }}>{pickupTime}</span></div>
                      <div>Name: <span style={{ color: C.textPrimary }}>{form.name}</span> · Phone: <span style={{ color: C.textPrimary }}>{form.phone}</span></div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button type="button" onClick={() => setStep(2)} className="ft-btn-outline">← Back</button>
                      <button type="button" onClick={handleConfirm} disabled={submitting} className="ft-btn-orange" style={{ opacity: submitting ? 0.6 : 1 }}>
                        {submitting ? 'Placing...' : 'Confirm Order'}
                      </button>
                    </div>
                  </>
                )}
              </div>
              <p style={{ marginTop: 18, fontSize: 13, color: C.accentAmber }}>
                💳 Stripe payment integration — $300 add-on
              </p>
            </>
          )}
        </div>

        {/* Cart drawer */}
        {!confirmation && cart.length > 0 && (
          <div style={{
            position: 'fixed', top: '50%', right: cartOpen ? 20 : -300, transform: 'translateY(-50%)',
            width: 260, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14,
            padding: 18, zIndex: 80, transition: 'right 0.35s ease', boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          }} className="ft-cart-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, fontSize: 18 }}>Your Cart</strong>
              <button type="button" onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: C.textSecondary, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 8 }}>{cart.reduce((s, c) => s + c.qty, 0)} items</div>
            <div style={{ fontWeight: 700, color: C.accentAmber, marginBottom: 12 }}>${subtotal.toFixed(2)}</div>
            <button type="button" onClick={() => { setCartOpen(false); goToStep(2) }} className="ft-btn-orange" style={{ display: 'block', width: '100%', textAlign: 'center' }}>Checkout →</button>
          </div>
        )}
        {!confirmation && cart.length > 0 && !cartOpen && (
          <button type="button" onClick={() => setCartOpen(true)} className="ft-cart-tab" style={{
            position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 79,
            background: C.accentColor, color: '#0d0d0d', border: 'none', borderRadius: '10px 0 0 10px',
            padding: '14px 10px', fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', writingMode: 'vertical-rl',
          }}>Cart ({cart.reduce((s, c) => s + c.qty, 0)})</button>
        )}
      </section>

      {/* ───────── SCHEDULE ───────── */}
      <section id="schedule" style={{ background: C.bgPrimary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('Where We At')}
          {sectionTitle('Weekly Schedule')}
          <p style={{ color: C.textSecondary, maxWidth: 480, margin: '0 auto 36px' }}>We move daily — find us at one of these spots.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, textAlign: 'left' }}>
            {DAY_KEYS.map(day => {
              const sch = C.schedule[day]
              const isToday = day === todayKey
              const closed = !sch || /closed/i.test(sch.location)
              return (
                <div key={day} style={{
                  background: isToday ? `linear-gradient(135deg, ${C.accentColor}22, ${C.bgCard})` : C.bgCard,
                  border: `1px solid ${isToday ? C.accentColor : C.borderSubtle}`, borderRadius: 14, padding: 20,
                  opacity: closed && !isToday ? 0.55 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1 }}>{DAY_NAMES[day]}</span>
                    {isToday && <span style={{
                      fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, color: '#0d0d0d',
                      background: C.accentColor, borderRadius: 100, padding: '4px 10px',
                    }}>Here Today</span>}
                  </div>
                  {closed ? (
                    <p style={{ color: C.textSecondary, fontSize: 14 }}>Closed</p>
                  ) : (
                    <>
                      <p style={{ color: C.textPrimary, fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{sch.location}</p>
                      <p style={{ color: C.textSecondary, fontSize: 13, marginBottom: 6 }}>{sch.address}</p>
                      <p style={{ color: C.accentAmber, fontSize: 13, marginBottom: 12 }}>{sch.hours}</p>
                      <a href={`${C.googleMapsUrl}/?q=${encodeURIComponent(sch.address || sch.location)}`} target="_blank" rel="noopener noreferrer" className="ft-btn-outline" style={{ display: 'inline-block', padding: '8px 16px', fontSize: 12 }}>Get Directions</a>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────── LOYALTY ───────── */}
      <section id="loyalty" style={{ background: C.bgSecondary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('Member Perks')}
          {sectionTitle('Punch Card Rewards')}
          <div style={{
            background: `linear-gradient(135deg, ${C.bgCard}, ${C.bgSecondary})`, border: `1px solid ${C.borderSubtle}`,
            borderRadius: 16, padding: 32, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, border: `1px solid ${C.accentColor}33`, borderRadius: 16, pointerEvents: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, maxWidth: 360, margin: '0 auto 18px' }}>
              {Array.from({ length: STAMPS }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${i < earnedStamps ? C.accentColor : '#3a3a3a'}`,
                  background: i < earnedStamps ? `${C.accentColor}33` : 'transparent',
                  color: i < earnedStamps ? C.accentColor : '#444', fontSize: 18,
                  animation: i < earnedStamps ? `ftPunchPop 0.4s ease backwards ${i * 0.1}s` : 'none',
                }}>{i < earnedStamps ? '🔥' : '○'}</div>
              ))}
            </div>
            <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: user ? 0 : 14 }}>10 punches = 1 free meal</p>
            {!user && (
              <button type="button" onClick={() => setAuthOpen(true)} className="ft-btn-orange" style={{ marginTop: 6 }}>Join to Start Earning</button>
            )}
            {user && (
              <p style={{ fontSize: 13, color: C.textPrimary, marginTop: 8 }}>
                {earnedStamps} / {STAMPS} punches {earnedStamps >= STAMPS ? '— free meal unlocked! 🎉' : `— ${STAMPS - earnedStamps} more to a free meal`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ───────── GALLERY ───────── */}
      <section id="gallery" style={{ background: C.bgPrimary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('A Look Inside')}
          {sectionTitle('On the Truck')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {C.galleryImages.map((src, i) => (
              <div key={i} className="ft-gallery-item" onClick={() => setLightboxIndex(i)} style={{
                borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.borderSubtle}`, aspectRatio: '4/3', position: 'relative', cursor: 'pointer',
              }}>
                <img src={src} alt={`${C.name} ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s' }} />
                <div className="ft-gallery-overlay" style={{ position: 'absolute', inset: 0, border: `2px solid ${C.accentColor}`, borderRadius: 12, opacity: 0, transition: 'opacity 0.25s' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FIND US ───────── */}
      <section id="find-us" style={{ background: C.bgSecondary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            {sectionLabel('Find Us')}
            {sectionTitle('Catch Us Today')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="ft-findus-grid">
            <div>
              {!/closed/i.test(todaySchedule?.location || '') ? (
                <div style={{ marginBottom: 22 }}>
                  <span style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C.accentAmber, fontWeight: 700 }}>Today — {DAY_NAMES[todayKey]}</span>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: C.accentColor, margin: '6px 0 2px', letterSpacing: 1 }}>{todaySchedule.location}</h3>
                  <p style={{ color: C.textSecondary, fontSize: 14 }}>{todaySchedule.address} · {todaySchedule.hours}</p>
                </div>
              ) : (
                <p style={{ color: C.textSecondary, marginBottom: 22 }}>We're closed today — see the schedule below for our next stop.</p>
              )}

              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, marginBottom: 14, letterSpacing: 1 }}>Hours & Locations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
                {DAY_KEYS.map(day => {
                  const sch = C.schedule[day]
                  const isToday = day === todayKey
                  return (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: `1px solid ${C.borderSubtle}` }}>
                      <span style={{ color: isToday ? C.accentAmber : C.textPrimary, fontWeight: isToday ? 700 : 400 }}>{DAY_NAMES[day]}{isToday && ' · Today'}</span>
                      <span style={{ color: isToday ? C.accentAmber : C.textSecondary, textAlign: 'right' }}>{sch?.location || 'Closed'} · {sch?.hours || 'Closed'}</span>
                    </div>
                  )
                })}
              </div>
              <p style={{ fontSize: 14, color: C.textPrimary, marginBottom: 4 }}>{C.address}</p>
              <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 18 }}>{C.phone}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={C.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="ft-btn-outline">Open in Google Maps</a>
                <a href={C.appleMapsUrl} target="_blank" rel="noopener noreferrer" className="ft-btn-outline">Open in Apple Maps</a>
                <a href={`https://instagram.com/${C.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="ft-btn-outline">📸 {C.instagram}</a>
              </div>
            </div>

            <div style={{
              background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 32, textAlign: 'center', minHeight: 220,
            }}>
              <span style={{ fontSize: 34, marginBottom: 10 }}>🚚</span>
              <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 16 }}>Map preview unavailable in demo mode</p>
              <a href={C.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="ft-btn-orange">Open Google Maps</a>
            </div>
          </div>

          {/* Contact form */}
          <div style={{ marginTop: 56, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, marginBottom: 16, textAlign: 'center', letterSpacing: 1 }}>Send Us a Message</h3>
            {contactSent ? (
              <p style={{ color: C.accentAmber, fontSize: 15, textAlign: 'center', animation: 'ftFadeIn 0.4s ease' }}>Message sent! We'll be in touch soon.</p>
            ) : (
              <form onSubmit={submitContactForm} style={{ display: 'flex', flexDirection: 'column', gap: 4, animation: 'ftFadeIn 0.4s ease' }}>
                <div>
                  <input className="ft-input" placeholder="Name" value={contact.name} onChange={e => setContactField('name', e.target.value)} style={fieldStyle('name')} />
                  {contactErrors.name && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{contactErrors.name}</span>}
                </div>
                <div>
                  <input className="ft-input" type="email" placeholder="Email" value={contact.email} onChange={e => setContactField('email', e.target.value)} style={fieldStyle('email')} />
                  {contactErrors.email && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{contactErrors.email}</span>}
                </div>
                <div>
                  <textarea className="ft-input" rows={4} placeholder="Message" value={contact.message} onChange={e => setContactField('message', e.target.value)} style={fieldStyle('message')} />
                  {contactErrors.message && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{contactErrors.message}</span>}
                </div>
                <button type="submit" disabled={contactSubmitting} className="ft-btn-orange" style={{ marginTop: 10 }}>{contactSubmitting ? 'Sending...' : 'Send Message'}</button>
              </form>
            )}
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
        @keyframes ftBounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        @keyframes ftPunchPop { 0% { transform: scale(0.4); opacity: 0; } 70% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes ftFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .ft-btn-orange {
          display: inline-block; background: ${C.accentColor}; color: #0d0d0d; border: none; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1px;
          padding: 13px 28px; cursor: pointer; text-decoration: none; transition: transform 0.2s, filter 0.2s;
        }
        .ft-btn-orange:hover { transform: scale(1.03); filter: brightness(1.1); }
        .ft-btn-outline {
          display: inline-block; background: transparent; color: #fff; border: 1px solid ${C.accentColor}; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 1px;
          padding: 12px 26px; cursor: pointer; text-decoration: none; transition: transform 0.2s, background 0.2s;
        }
        .ft-btn-outline:hover { transform: scale(1.03); background: rgba(249,115,22,0.1); }
        .ft-menu-card:hover { transform: translateY(-4px); border-color: ${C.accentColor}66; }
        .ft-add-btn:hover { transform: scale(1.03); }
        .ft-qty-btn {
          width: 26px; height: 26px; border-radius: 6px; border: 1px solid ${C.borderSubtle}; background: transparent;
          color: ${C.textPrimary}; cursor: pointer; font-size: 14px; transition: all 0.15s;
        }
        .ft-qty-btn:hover { border-color: ${C.accentColor}; color: ${C.accentColor}; }
        .ft-input, .ft-select {
          width: 100%; background: #141414; color: ${C.textPrimary}; border: 1px solid ${C.borderSubtle};
          border-radius: 8px; padding: 11px 14px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none;
          margin-top: 6px; color-scheme: dark; transition: border-color 0.2s;
        }
        .ft-input:focus, .ft-select:focus { border-color: ${C.accentColor}; }
        .ft-gallery-item:hover img { transform: scale(1.06); }
        .ft-gallery-item:hover .ft-gallery-overlay { opacity: 1; }
        @media (max-width: 860px) {
          .ft-findus-grid { grid-template-columns: 1fr !important; }
          .ft-cart-drawer, .ft-cart-tab { display: none !important; }
        }
      `}</style>
    </div>
  )
}
