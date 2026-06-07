import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RESTAURANT_CONFIG as C } from './config'
import { useAuthStore } from '../../store/authStore'
import { createOrder, getCustomerOrders, getProfile, submitContact } from '../../lib/supabase'
import AddOnsDrawer from '../../components/restaurant/AddOnsDrawer'
import FloatingButtons from '../../components/restaurant/FloatingButtons'
import toast from 'react-hot-toast'

const CATEGORIES = Object.keys(C.menu)
const STAMPS = 10

function buildTimeSlots() {
  const slots = []
  for (let h = 11; h <= 20; h++) {
    for (const m of [0, 30]) {
      const hour12 = h > 12 ? h - 12 : h
      slots.push(`${hour12}:${m === 0 ? '00' : '30'} ${h >= 12 ? 'PM' : 'AM'}`)
    }
  }
  return slots
}
const TIME_SLOTS = buildTimeSlots()

const sectionLabel = (text) => (
  <span style={{
    display: 'inline-block', fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 3,
    textTransform: 'uppercase', fontWeight: 600, color: C.accentColor, marginBottom: 10,
  }}>{text}</span>
)

const sectionTitle = (text) => (
  <h2 style={{
    fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 46px)', color: C.textPrimary,
    fontWeight: 700, marginBottom: 16,
  }}>{text}</h2>
)

export default function RestaurantHome() {
  const { user, profile, setProfile } = useAuthStore()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t) }, [])

  // ── Menu / category filter ───────────────────────
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])

  // ── Order / cart state ───────────────────────────
  const [cart, setCart] = useState([])
  const [step, setStep] = useState(1)
  const [pickupTime, setPickupTime] = useState('')
  const [form, setForm] = useState({ name: '', phone: '' })
  const [confirmation, setConfirmation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

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
    const orderNumber = `JG-${Math.floor(1000 + Math.random() * 9000)}`
    try {
      await createOrder({
        restaurant_id: C.restaurantId,
        user_id: user?.id ?? null,
        items: cart,
        pickup_time: pickupTime,
        status: 'pending',
        total: subtotal,
      })
    } catch { /* demo mode — show confirmation regardless */ }
    setConfirmation({ orderNumber, name: form.name, pickupTime, total: subtotal })
    setCart([]); setStep(1); setPickupTime(''); setForm({ name: '', phone: '' })
    setSubmitting(false)
  }

  const resetOrder = () => { setConfirmation(null); setStep(1); setCartOpen(false) }

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
  const [contactSent, setContactSent] = useState(false)
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const submitContactForm = async (e) => {
    e.preventDefault()
    if (!contact.name || !contact.email || !contact.message) return toast.error('Fill in all fields')
    setContactSubmitting(true)
    try {
      await submitContact({ restaurant_id: C.restaurantId, ...contact })
      setContactSent(true)
      setContact({ name: '', email: '', message: '' })
    } catch { toast.error('Something went wrong — try again later') }
    setContactSubmitting(false)
  }

  const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
  const filteredItems = useMemo(() => C.menu[activeCategory] || [], [activeCategory])

  return (
    <div style={{ background: C.bgPrimary, color: C.textPrimary, fontFamily: "'Inter', sans-serif" }}>

      {/* ───────── HERO ───────── */}
      <section id="home" style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(${C.heroImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{
          padding: '0 20px', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', color: C.accentColor, fontWeight: 600 }}>
            Premium Dining Experience
          </span>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900, color: '#fff',
            fontSize: 'clamp(48px, 11vw, 96px)', letterSpacing: 2, lineHeight: 1.02, margin: '18px 0 6px',
          }}>JALISCO GRILL</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(16px, 2.4vw, 24px)', letterSpacing: 3, textTransform: 'uppercase', color: C.textSecondary }}>
            Mexican Restaurant
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: C.accentColor, fontSize: 18, marginTop: 14 }}>
            {C.tagline}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 44 }}>
            <a href="#order" className="rg-btn-gold">Order Now</a>
            <a href="#menu" className="rg-btn-outline">View Menu</a>
          </div>
        </div>

        <a href="#menu" aria-label="Scroll down" style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          color: C.accentColor, fontSize: 26, textDecoration: 'none', animation: 'rgBounce 2s infinite',
        }}>↓</a>
      </section>

      {/* ───────── MENU ───────── */}
      <section id="menu" style={{ background: C.bgPrimary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('Fresh Daily')}
          {sectionTitle('Our Menu')}
          <p style={{ color: C.textSecondary, maxWidth: 480, margin: '0 auto 36px' }}>{C.tagline}</p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} type="button" onClick={() => setActiveCategory(cat)} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 1,
                padding: '10px 22px', borderRadius: 100, cursor: 'pointer', transition: 'all 0.2s',
                background: activeCategory === cat ? C.accentColor : 'transparent',
                color: activeCategory === cat ? '#0A0A0A' : C.textPrimary,
                border: `1px solid ${activeCategory === cat ? C.accentColor : C.borderSubtle}`,
              }}
                onMouseEnter={e => { if (activeCategory !== cat) e.currentTarget.style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >{cat}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, textAlign: 'left' }}>
            {filteredItems.map(item => (
              <div key={item.name} className="rg-menu-card" style={{
                background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 22,
                display: 'flex', flexDirection: 'column', gap: 10, transition: 'transform 0.2s, border-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, color: C.textPrimary, fontWeight: 700 }}>{item.name}</h3>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: C.accentColor, whiteSpace: 'nowrap' }}>${item.price.toFixed(2)}</span>
                </div>
                <p style={{ color: C.textSecondary, fontSize: 14, lineHeight: 1.6, flex: 1 }}>{item.desc}</p>
                <button type="button" onClick={() => addToCart(item)} className="rg-add-btn" style={{
                  alignSelf: 'flex-start', background: 'transparent', color: C.accentColor, border: `1px solid ${C.accentColor}`,
                  borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1,
                  textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.accentColor; e.currentTarget.style.color = '#0A0A0A' }}
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
            <div style={{
              background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: '40px 28px', textAlign: 'center',
            }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: C.accentColor, marginBottom: 10 }}>Order Confirmed!</h3>
              <p style={{ color: C.textSecondary, marginBottom: 6 }}>Thanks, {confirmation.name} — we're firing it up.</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 26, letterSpacing: 2, fontWeight: 700, margin: '14px 0' }}>#{confirmation.orderNumber}</p>
              <p style={{ color: C.textSecondary, fontSize: 14 }}>Pickup: {confirmation.pickupTime} · Estimated ready in 20–30 min</p>
              <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 24 }}>Total: ${confirmation.total.toFixed(2)}</p>
              <button type="button" onClick={resetOrder} className="rg-btn-outline" style={{ display: 'inline-block' }}>Track Another Order</button>
            </div>
          ) : (
            <>
              {/* Step indicator */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
                {['Build Order', 'Your Info', 'Confirm'].map((label, i) => {
                  const n = i + 1
                  return (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                        background: step >= n ? C.accentColor : 'transparent', color: step >= n ? '#0A0A0A' : C.textSecondary,
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
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Pick your items</h3>
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
                              <button type="button" onClick={() => changeQty(c.name, -1)} className="rg-qty-btn">−</button>
                              <span style={{ minWidth: 18, textAlign: 'center', fontSize: 14 }}>{c.qty}</span>
                              <button type="button" onClick={() => changeQty(c.name, 1)} className="rg-qty-btn">+</button>
                              <span style={{ minWidth: 56, textAlign: 'right', color: C.accentColor, fontSize: 14 }}>${(c.price * c.qty).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                        <div style={{ borderTop: `1px solid ${C.borderSubtle}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                          <span>Subtotal</span><span style={{ color: C.accentColor }}>${subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: C.textSecondary }}>Pickup Time</label>
                    <select value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="rg-select">
                      <option value="">Select a time...</option>
                      {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                    <button type="button" onClick={() => goToStep(2)} className="rg-btn-gold" style={{ marginTop: 20, display: 'inline-block' }}>Continue →</button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Your info</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: C.textSecondary }}>Name</label>
                        <input className="rg-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: C.textSecondary }}>Phone</label>
                        <input className="rg-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(210) 555-0100" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
                      <button type="button" onClick={() => setStep(1)} className="rg-btn-outline">← Back</button>
                      <button type="button" onClick={() => goToStep(3)} className="rg-btn-gold">Review Order →</button>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Confirm your order</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, fontSize: 14, color: C.textSecondary }}>
                      {cart.map(c => (
                        <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{c.qty}× {c.name}</span><span style={{ color: C.accentColor }}>${(c.price * c.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: `1px solid ${C.borderSubtle}`, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: C.textPrimary }}>
                        <span>Subtotal</span><span style={{ color: C.accentColor }}>${subtotal.toFixed(2)}</span>
                      </div>
                      <div>Pickup: <span style={{ color: C.textPrimary }}>{pickupTime}</span></div>
                      <div>Name: <span style={{ color: C.textPrimary }}>{form.name}</span> · Phone: <span style={{ color: C.textPrimary }}>{form.phone}</span></div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button type="button" onClick={() => setStep(2)} className="rg-btn-outline">← Back</button>
                      <button type="button" onClick={handleConfirm} disabled={submitting} className="rg-btn-gold" style={{ opacity: submitting ? 0.6 : 1 }}>
                        {submitting ? 'Placing...' : 'Confirm Order'}
                      </button>
                    </div>
                  </>
                )}
              </div>
              <p style={{ marginTop: 18, fontSize: 13, color: C.accentColor }}>
                💳 Stripe payment integration available — ask about add-ons
              </p>
            </>
          )}
        </div>

        {/* Cart drawer (desktop slide-in) */}
        {!confirmation && cart.length > 0 && (
          <div style={{
            position: 'fixed', top: '50%', right: cartOpen ? 20 : -300, transform: 'translateY(-50%)',
            width: 260, background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14,
            padding: 18, zIndex: 80, transition: 'right 0.35s ease', boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          }} className="rg-cart-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong style={{ fontFamily: "'Playfair Display', serif" }}>Your Cart</strong>
              <button type="button" onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: C.textSecondary, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 8 }}>{cart.reduce((s, c) => s + c.qty, 0)} items</div>
            <div style={{ fontWeight: 700, color: C.accentColor, marginBottom: 12 }}>${subtotal.toFixed(2)}</div>
            <a href="#order" onClick={() => setCartOpen(false)} className="rg-btn-gold" style={{ display: 'block', textAlign: 'center' }}>Checkout →</a>
          </div>
        )}
        {!confirmation && cart.length > 0 && !cartOpen && (
          <button type="button" onClick={() => setCartOpen(true)} className="rg-cart-tab" style={{
            position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 79,
            background: C.accentColor, color: '#0A0A0A', border: 'none', borderRadius: '10px 0 0 10px',
            padding: '14px 10px', fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', writingMode: 'vertical-rl',
          }}>Cart ({cart.reduce((s, c) => s + c.qty, 0)})</button>
        )}
      </section>

      {/* ───────── LOYALTY ───────── */}
      <section id="loyalty" style={{ background: C.bgPrimary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('Member Perks')}
          {sectionTitle('Your Rewards')}
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
                  background: i < earnedStamps ? `${C.accentColor}22` : 'transparent',
                  color: i < earnedStamps ? C.accentColor : '#444', fontSize: 18,
                }}>{i < earnedStamps ? '★' : '☆'}</div>
              ))}
            </div>
            <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: user ? 0 : 14 }}>10 punches = 1 free meal</p>
            {!user && (
              <Link to="/restaurant/register" className="rg-btn-gold" style={{ display: 'inline-block', marginTop: 6 }}>Join to Start Earning</Link>
            )}
            {user && (
              <p style={{ fontSize: 13, color: C.textPrimary, marginTop: 8 }}>
                {earnedStamps} / {STAMPS} stamps {earnedStamps >= STAMPS ? '— reward unlocked! 🎉' : `— ${STAMPS - earnedStamps} more to a free meal`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ───────── GALLERY ───────── */}
      <section id="gallery" style={{ background: C.bgSecondary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {sectionLabel('A Look Inside')}
          {sectionTitle('Our Food')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {C.galleryImages.map((src, i) => (
              <div key={i} className="rg-gallery-item" style={{
                borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.borderSubtle}`, aspectRatio: '4/3', position: 'relative',
              }}>
                <img src={src} alt={`${C.name} dish ${i + 1}`} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s' }} />
                <div className="rg-gallery-overlay" style={{
                  position: 'absolute', inset: 0, border: `2px solid ${C.accentColor}`, borderRadius: 12, opacity: 0, transition: 'opacity 0.25s',
                }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── VISIT ───────── */}
      <section id="visit" style={{ background: C.bgPrimary, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            {sectionLabel('Find Us')}
            {sectionTitle('Visit Jalisco Grill')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="rg-visit-grid">
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 14 }}>Hours</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
                {C.hours.map(({ day, time }) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0', borderBottom: `1px solid ${C.borderSubtle}` }}>
                    <span style={{ color: day === todayName ? C.accentColor : C.textPrimary, fontWeight: day === todayName ? 700 : 400 }}>
                      {day} {day === todayName && '· Open Today'}
                    </span>
                    <span style={{ color: day === todayName ? C.accentColor : C.textSecondary }}>{time}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: C.textPrimary, marginBottom: 4 }}>{C.address}</p>
              <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 18 }}>{C.phone}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={C.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="rg-btn-outline">Get Directions on Google</a>
                <a href={C.appleMapsUrl} target="_blank" rel="noopener noreferrer" className="rg-btn-outline">Open in Apple Maps</a>
              </div>
            </div>

            <div style={{
              background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 32, textAlign: 'center', minHeight: 220,
            }}>
              <span style={{ fontSize: 34, marginBottom: 10 }}>📍</span>
              <p style={{ color: C.textSecondary, fontSize: 14, marginBottom: 16 }}>Map preview unavailable in demo mode</p>
              <a href={C.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="rg-btn-gold">Open Google Maps</a>
            </div>
          </div>

          {/* Contact form */}
          <div style={{ marginTop: 56, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16, textAlign: 'center' }}>Send Us a Message</h3>
            {contactSent ? (
              <p style={{ color: C.accentColor, fontSize: 14, textAlign: 'center' }}>Thanks — we received your message and will reach out soon.</p>
            ) : (
              <form onSubmit={submitContactForm} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input className="rg-input" placeholder="Name" value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))} />
                <input className="rg-input" type="email" placeholder="Email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} />
                <textarea className="rg-input" rows={4} placeholder="Message" value={contact.message} onChange={e => setContact(c => ({ ...c, message: e.target.value }))} />
                <button type="submit" disabled={contactSubmitting} className="rg-btn-gold">{contactSubmitting ? 'Sending...' : 'Send Message'}</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <AddOnsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <FloatingButtons onOpenAddOns={() => setDrawerOpen(true)} />

      <style>{`
        @keyframes rgBounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        .rg-btn-gold {
          display: inline-block; background: ${C.accentColor}; color: #0A0A0A; border: none; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1px;
          padding: 13px 28px; cursor: pointer; text-decoration: none; transition: transform 0.2s, filter 0.2s;
        }
        .rg-btn-gold:hover { transform: scale(1.03); filter: brightness(1.1); }
        .rg-btn-outline {
          display: inline-block; background: transparent; color: #fff; border: 1px solid #fff; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 1px;
          padding: 12px 26px; cursor: pointer; text-decoration: none; transition: transform 0.2s, background 0.2s;
        }
        .rg-btn-outline:hover { transform: scale(1.03); background: rgba(255,255,255,0.08); }
        .rg-menu-card:hover { transform: translateY(-4px); border-color: ${C.accentColor}66; }
        .rg-add-btn:hover { transform: scale(1.03); }
        .rg-qty-btn {
          width: 26px; height: 26px; border-radius: 6px; border: 1px solid ${C.borderSubtle}; background: transparent;
          color: ${C.textPrimary}; cursor: pointer; font-size: 14px; transition: all 0.15s;
        }
        .rg-qty-btn:hover { border-color: ${C.accentColor}; color: ${C.accentColor}; }
        .rg-input, .rg-select {
          width: 100%; background: #141414; color: ${C.textPrimary}; border: 1px solid ${C.borderSubtle};
          border-radius: 8px; padding: 11px 14px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none;
          margin-top: 6px; color-scheme: dark; transition: border-color 0.2s;
        }
        .rg-input:focus, .rg-select:focus { border-color: ${C.accentColor}; }
        .rg-gallery-item:hover img { transform: scale(1.06); }
        .rg-gallery-item:hover .rg-gallery-overlay { opacity: 1; }
        @media (max-width: 860px) {
          .rg-visit-grid { grid-template-columns: 1fr !important; }
          .rg-cart-drawer, .rg-cart-tab { display: none !important; }
        }
      `}</style>
    </div>
  )
}
