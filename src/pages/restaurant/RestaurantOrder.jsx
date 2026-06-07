import { useState, useMemo } from 'react'
import { RESTAURANT_CONFIG as C } from './config'
import { useAuthStore } from '../../store/authStore'
import { createOrder } from '../../lib/supabase'
import toast from 'react-hot-toast'

function buildTimeSlots() {
  const slots = []
  for (let h = 11; h <= 20; h++) {
    for (const m of [0, 30]) {
      const hour12 = h > 12 ? h - 12 : h
      const ampm = h >= 12 ? 'PM' : 'AM'
      slots.push(`${hour12}:${m === 0 ? '00' : '30'} ${ampm}`)
    }
  }
  return slots
}
const TIME_SLOTS = buildTimeSlots()

export default function RestaurantOrder() {
  const { user } = useAuthStore()
  const [cart, setCart] = useState([])
  const [pickupTime, setPickupTime] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [confirmation, setConfirmation] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const allItems = useMemo(() => Object.entries(C.menu).flatMap(([cat, items]) => items.map(i => ({ ...i, cat }))), [])

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name)
      if (existing) return prev.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
    toast.success(`Added ${item.name}`)
  }
  const removeFromCart = (name) => setCart(prev => prev.filter(c => c.name !== name))
  const changeQty = (name, delta) => setCart(prev => prev
    .map(c => c.name === name ? { ...c, qty: c.qty + delta } : c)
    .filter(c => c.qty > 0))

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) return toast.error('Your cart is empty')
    if (!pickupTime) return toast.error('Select a pickup time')
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
    } catch {
      // Demo mode — still show confirmation even if Supabase write fails (e.g. tables not provisioned)
    }
    setConfirmation({ orderNumber, name: form.name, pickupTime, total: subtotal })
    setCart([])
    setPickupTime(null)
    setForm({ name: '', phone: '' })
    setSubmitting(false)
  }

  if (confirmation) {
    return (
      <div className="page" style={{ maxWidth: 520 }}>
        <div className="success-box">
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 2, color: C.accentColor, marginBottom: 12 }}>
            Order Confirmed!
          </h1>
          <p style={{ color: '#ccc', marginBottom: 6 }}>Thanks, {confirmation.name} — your order is in.</p>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, letterSpacing: 3, margin: '14px 0' }}>
            #{confirmation.orderNumber}
          </p>
          <p style={{ color: '#999', fontSize: 14 }}>Pickup: {confirmation.pickupTime}</p>
          <p style={{ color: '#999', fontSize: 14, marginBottom: 20 }}>Total: ${confirmation.total.toFixed(2)}</p>
          <button className="btn-outline" onClick={() => setConfirmation(null)}>Place Another Order</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="sec-header">
        <p className="sec-label">Order Ahead</p>
        <h1 className="sec-title">Online Ordering</h1>
        <p className="sec-desc">Add items, pick a pickup time, and we'll have it ready.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }} className="order-grid">
        {/* Menu picker */}
        <div>
          {Object.entries(C.menu).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: C.accentColor, marginBottom: 12 }}>{category}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <div key={item.name} className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>${item.price.toFixed(2)}</div>
                    </div>
                    <button className="btn-ghost" onClick={() => addToCart(item)}>+ Add</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart + checkout */}
        <div>
          <div className="form-card" style={{ position: 'sticky', top: 84 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, marginBottom: 16 }}>Your Order</h3>

            {cart.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>Your cart is empty — add items to get started.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {cart.map(c => (
                  <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 13 }}>{c.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => changeQty(c.name, -1)} className="btn-ghost" style={{ padding: '2px 9px' }}>−</button>
                      <span style={{ fontSize: 13, minWidth: 16, textAlign: 'center' }}>{c.qty}</span>
                      <button onClick={() => changeQty(c.name, 1)} className="btn-ghost" style={{ padding: '2px 9px' }}>+</button>
                      <span style={{ fontSize: 13, minWidth: 50, textAlign: 'right', color: C.accentColor }}>${(c.price * c.qty).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(c.name)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14 }}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Subtotal</span>
                  <span style={{ color: C.accentColor }}>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="form-group full" style={{ marginBottom: 14 }}>
              <label className="form-label">Pickup Time</label>
              <div className="time-grid" style={{ marginTop: 8, maxHeight: 160, overflowY: 'auto' }}>
                {TIME_SLOTS.map(slot => (
                  <button type="button" key={slot} onClick={() => setPickupTime(slot)}
                    className={`time-btn ${pickupTime === slot ? 'selected' : ''}`}>{slot}</button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(210) 555-0100" />
              </div>
              <button type="submit" className="submit-btn" disabled={submitting} style={{ background: C.accentColor }}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>

            <p style={{ fontSize: 11, color: '#555', marginTop: 16, textAlign: 'center' }}>
              This is a mock checkout — no payment is processed. Stripe integration available as add-on — $300.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .order-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
