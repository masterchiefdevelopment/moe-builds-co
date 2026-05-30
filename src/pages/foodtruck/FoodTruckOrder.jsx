// src/pages/foodtruck/FoodTruckOrder.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const ORDER_ITEMS = [
  { id: 1,  name: 'Smash Burger',       price: 12, emoji: '🍔', category: 'Burgers' },
  { id: 2,  name: 'Spicy Smash',        price: 13, emoji: '🌶️', category: 'Burgers' },
  { id: 3,  name: 'BBQ Bacon Burger',   price: 14, emoji: '🥓', category: 'Burgers' },
  { id: 4,  name: 'Birria Tacos',       price: 14, emoji: '🌮', category: 'Tacos'   },
  { id: 5,  name: 'Al Pastor Tacos',    price: 13, emoji: '🍍', category: 'Tacos'   },
  { id: 6,  name: 'Grilled Fish Tacos', price: 13, emoji: '🐟', category: 'Tacos'   },
  { id: 7,  name: 'Loaded Fries',       price: 8,  emoji: '🍟', category: 'Sides'   },
  { id: 8,  name: 'Street Corn',        price: 5,  emoji: '🌽', category: 'Sides'   },
  { id: 9,  name: 'Onion Rings',        price: 6,  emoji: '🧅', category: 'Sides'   },
  { id: 10, name: 'Agua Fresca',        price: 4,  emoji: '🥤', category: 'Drinks'  },
  { id: 11, name: 'Jarritos',           price: 3,  emoji: '🍊', category: 'Drinks'  },
  { id: 12, name: 'Fresh Lemonade',     price: 4,  emoji: '🍋', category: 'Drinks'  },
]

const PICKUP_TIMES = [
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
  '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '1:00 PM',  '1:15 PM',  '1:30 PM',  '1:45 PM',
  '2:00 PM',  '2:15 PM',  '2:30 PM',  '3:00 PM',
  '4:00 PM',  '4:30 PM',  '5:00 PM',  '5:30 PM',
]

const CATEGORIES = ['All', 'Burgers', 'Tacos', 'Sides', 'Drinks']

export default function FoodTruckOrder() {
  const [cart,       setCart]       = useState({})
  const [filter,     setFilter]     = useState('All')
  const [step,       setStep]       = useState(1)   // 1 = items, 2 = details, 3 = confirmed
  const [pickupTime, setPickupTime] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [form,       setForm]       = useState({ name: '', phone: '', notes: '' })
  const [errors,     setErrors]     = useState({})

  // ── Cart helpers ──────────────────────────────────
  const addItem = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const remItem = (id) => setCart(c => {
    const next = { ...c, [id]: (c[id] || 0) - 1 }
    if (next[id] <= 0) delete next[id]
    return next
  })

  const cartItems  = ORDER_ITEMS.filter(i => cart[i.id] > 0)
  const cartCount  = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal  = cartItems.reduce((sum, i) => sum + i.price * cart[i.id], 0)
  const filtered   = filter === 'All' ? ORDER_ITEMS : ORDER_ITEMS.filter(i => i.category === filter)

  // ── Validation ───────────────────────────────────
  const validateStep2 = () => {
    const e = {}
    if (!form.name)    e.name     = 'Required'
    if (!pickupTime)   e.time     = 'Select a pickup time'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setStep(3)
  }

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  // ── Confirmed screen ─────────────────────────────
  if (step === 3) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
      <div style={{
        background:   'rgba(255,107,43,0.05)',
        border:       '1px solid rgba(255,107,43,0.25)',
        borderRadius: '12px',
        padding:      '48px 32px',
        textAlign:    'center',
        maxWidth:     '480px',
        width:        '100%',
      }}
        className="fade-in"
      >
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>🔥</div>
        <div style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:       '48px',
          letterSpacing:  '4px',
          color:          '#FF6B2B',
          lineHeight:     1,
          marginBottom:   '12px',
        }}>
          ORDER FIRED!
        </div>
        <p style={{ color: '#777', marginBottom: '8px', fontSize: '15px' }}>
          Thanks {form.name}. Your order is in.
        </p>
        <div style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:       '28px',
          letterSpacing:  '2px',
          color:          '#F5F5F5',
          margin:         '16px 0',
        }}>
          Pickup at {pickupTime}
        </div>

        {/* Order summary */}
        <div style={{
          background:   '#161616',
          border:       '1px solid #222',
          borderRadius: '8px',
          padding:      '16px',
          marginBottom: '24px',
          textAlign:    'left',
        }}>
          {cartItems.map(item => (
            <div key={item.id} style={{
              display:        'flex',
              justifyContent: 'space-between',
              fontSize:        '13px',
              color:           '#888',
              padding:         '4px 0',
              borderBottom:    '1px solid #1a1a1a',
            }}>
              <span>{item.emoji} {item.name} × {cart[item.id]}</span>
              <span style={{ color: '#FF6B2B' }}>${(item.price * cart[item.id]).toFixed(2)}</span>
            </div>
          ))}
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            marginTop:      '10px',
            fontFamily:     "'Bebas Neue', sans-serif",
            fontSize:        '20px',
            letterSpacing:   '1.5px',
          }}>
            <span>Total</span>
            <span style={{ color: '#FF6B2B' }}>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <p style={{ color: '#444', fontSize: '12px', marginBottom: '24px' }}>
          We'll have it hot and ready. Check our location page if you need directions.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setCart({}); setStep(1); setForm({ name: '', phone: '', notes: '' }); setPickupTime('') }}
            style={{
              background:    '#FF6B2B',
              color:         '#0A0A0A',
              border:        'none',
              borderRadius:  '6px',
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '13px',
              fontWeight:     700,
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              padding:        '12px 24px',
              cursor:         'pointer',
              transition:     'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ff7d42'}
            onMouseLeave={e => e.currentTarget.style.background = '#FF6B2B'}
          >
            New Order
          </button>
          <Link to="/foodtruck/location" style={{
            background:    'transparent',
            color:         '#888',
            border:        '1px solid #2a2a2a',
            borderRadius:  '6px',
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '13px',
            letterSpacing:  '2px',
            textTransform:  'uppercase',
            textDecoration: 'none',
            padding:        '12px 24px',
            transition:     'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B2B'; e.currentTarget.style.color = '#FF6B2B' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}
          >
            Get Directions
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '80px 20px 60px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Header ──────────────────────────────────── */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontSize:       '11px',
          letterSpacing:  '4px',
          textTransform:  'uppercase',
          color:          '#FF6B2B',
          marginBottom:   '10px',
        }}>
          Online Ordering
        </div>
        <h1 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:       'clamp(40px, 8vw, 72px)',
          letterSpacing:  '4px',
          lineHeight:     1,
          marginBottom:   '8px',
        }}>
          BUILD YOUR ORDER
        </h1>
        <p style={{ color: '#555', fontSize: '14px' }}>
          Pick your items · Choose a pickup time · Skip the line
        </p>
      </div>

      {/* ── Step indicator ──────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '36px', alignItems: 'center' }}>
        {[
          { n: 1, label: 'Select Items' },
          { n: 2, label: 'Your Details' },
        ].map(({ n, label }, i, arr) => (
          <>
            <div
              key={n}
              style={{
                display:     'flex',
                alignItems:  'center',
                gap:         '8px',
                cursor:      step > n ? 'pointer' : 'default',
              }}
              onClick={() => { if (step > n) setStep(n) }}
            >
              <div style={{
                width:          '28px',
                height:         '28px',
                borderRadius:   '50%',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                background:     step >= n ? '#FF6B2B' : '#1a1a1a',
                border:         step >= n ? 'none' : '1px solid #333',
                fontFamily:     "'Bebas Neue', sans-serif",
                fontSize:        '14px',
                color:           step >= n ? '#0A0A0A' : '#555',
                transition:      'all 0.2s',
                flexShrink:      0,
              }}>
                {step > n ? '✓' : n}
              </div>
              <span style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '12px',
                letterSpacing:  '1.5px',
                textTransform:  'uppercase',
                color:          step >= n ? '#F5F5F5' : '#444',
              }}>
                {label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div key={`line-${n}`} style={{
                flex:       1,
                height:     '1px',
                background: step > n ? '#FF6B2B' : '#222',
                maxWidth:   '60px',
                transition: 'background 0.3s',
              }} />
            )}
          </>
        ))}

        {/* Cart summary pill */}
        {cartCount > 0 && (
          <div style={{
            marginLeft:    'auto',
            background:    'rgba(255,107,43,0.1)',
            border:        '1px solid rgba(255,107,43,0.3)',
            borderRadius:  '100px',
            padding:       '6px 14px',
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '13px',
            letterSpacing:  '1px',
            color:          '#FF6B2B',
            whiteSpace:     'nowrap',
          }}>
            🛒 {cartCount} item{cartCount !== 1 ? 's' : ''} · ${cartTotal.toFixed(2)}
          </div>
        )}
      </div>

      {/* ── STEP 1: Item selection ───────────────────── */}
      {step === 1 && (
        <div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background:    filter === cat ? '#FF6B2B' : 'transparent',
                  color:         filter === cat ? '#0A0A0A' : '#666',
                  border:        filter === cat ? '1px solid #FF6B2B' : '1px solid #2a2a2a',
                  borderRadius:  '6px',
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '12px',
                  fontWeight:     filter === cat ? 700 : 400,
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  padding:        '8px 18px',
                  cursor:         'pointer',
                  transition:     'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (filter !== cat) {
                    e.currentTarget.style.borderColor = 'rgba(255,107,43,0.4)'
                    e.currentTarget.style.color       = '#F5F5F5'
                  }
                }}
                onMouseLeave={e => {
                  if (filter !== cat) {
                    e.currentTarget.style.borderColor = '#2a2a2a'
                    e.currentTarget.style.color       = '#666'
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap:                 '12px',
            marginBottom:        '32px',
          }}>
            {filtered.map(item => {
              const qty = cart[item.id] || 0
              return (
                <div
                  key={item.id}
                  style={{
                    background:   '#161616',
                    border:       `1px solid ${qty > 0 ? 'rgba(255,107,43,0.4)' : '#222'}`,
                    borderRadius: '8px',
                    padding:      '16px 18px',
                    display:      'flex',
                    alignItems:   'center',
                    gap:          '14px',
                    transition:   'border-color 0.2s',
                  }}
                >
                  <div style={{ fontSize: '32px', flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily:    "'Bebas Neue', sans-serif",
                      fontSize:       '18px',
                      letterSpacing:  '1px',
                      marginBottom:   '2px',
                      whiteSpace:     'nowrap',
                      overflow:       'hidden',
                      textOverflow:   'ellipsis',
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontFamily:    "'Barlow Condensed', sans-serif",
                      fontSize:       '12px',
                      letterSpacing:  '1px',
                      color:          '#FF6B2B',
                    }}>
                      ${item.price}.00
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {qty > 0 && (
                      <button
                        onClick={() => remItem(item.id)}
                        style={{
                          width:         '28px',
                          height:        '28px',
                          borderRadius:  '50%',
                          background:    '#222',
                          border:        '1px solid #333',
                          color:         '#F5F5F5',
                          fontSize:       '16px',
                          cursor:         'pointer',
                          display:        'flex',
                          alignItems:     'center',
                          justifyContent: 'center',
                          lineHeight:     1,
                          transition:     'all 0.15s',
                          flexShrink:     0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.borderColor = '#555' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.borderColor = '#333' }}
                      >
                        −
                      </button>
                    )}
                    {qty > 0 && (
                      <span style={{
                        fontFamily:    "'Bebas Neue', sans-serif",
                        fontSize:       '18px',
                        letterSpacing:  '1px',
                        color:          '#FF6B2B',
                        minWidth:       '16px',
                        textAlign:      'center',
                      }}>
                        {qty}
                      </span>
                    )}
                    <button
                      onClick={() => addItem(item.id)}
                      style={{
                        width:         '28px',
                        height:        '28px',
                        borderRadius:  '50%',
                        background:    qty > 0 ? '#FF6B2B' : '#1a1a1a',
                        border:        qty > 0 ? 'none' : '1px solid #333',
                        color:         qty > 0 ? '#0A0A0A' : '#888',
                        fontSize:       '18px',
                        cursor:         'pointer',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        lineHeight:     1,
                        transition:     'all 0.15s',
                        flexShrink:     0,
                      }}
                      onMouseEnter={e => {
                        if (qty === 0) {
                          e.currentTarget.style.background   = '#FF6B2B'
                          e.currentTarget.style.color        = '#0A0A0A'
                          e.currentTarget.style.borderColor  = '#FF6B2B'
                        } else {
                          e.currentTarget.style.background = '#ff7d42'
                        }
                      }}
                      onMouseLeave={e => {
                        if (qty === 0) {
                          e.currentTarget.style.background  = '#1a1a1a'
                          e.currentTarget.style.color       = '#888'
                          e.currentTarget.style.borderColor = '#333'
                        } else {
                          e.currentTarget.style.background = '#FF6B2B'
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Proceed button */}
          <div style={{ position: 'sticky', bottom: '20px' }}>
            <button
              onClick={() => {
                if (cartCount === 0) { toast.error('Add at least one item'); return }
                setStep(2)
              }}
              style={{
                width:         '100%',
                background:    cartCount > 0 ? '#FF6B2B' : '#1a1a1a',
                color:         cartCount > 0 ? '#0A0A0A' : '#444',
                border:        cartCount > 0 ? 'none' : '1px solid #2a2a2a',
                borderRadius:  '8px',
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:       '24px',
                letterSpacing:  '3px',
                padding:        '16px',
                cursor:         cartCount > 0 ? 'pointer' : 'not-allowed',
                transition:     'all 0.2s',
                boxShadow:      cartCount > 0 ? '0 0 28px rgba(255,107,43,0.25)' : 'none',
              }}
              onMouseEnter={e => { if (cartCount > 0) e.currentTarget.style.background = '#ff7d42' }}
              onMouseLeave={e => { if (cartCount > 0) e.currentTarget.style.background = '#FF6B2B' }}
            >
              {cartCount > 0
                ? `NEXT — ${cartCount} ITEM${cartCount !== 1 ? 'S' : ''} · $${cartTotal.toFixed(2)}`
                : 'ADD ITEMS TO CONTINUE'
              }
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Details ─────────────────────────── */}
      {step === 2 && (
        <div style={{ maxWidth: '640px' }}>

          {/* Order summary */}
          <div style={{
            background:   '#161616',
            border:       '1px solid #222',
            borderRadius: '8px',
            padding:      '20px',
            marginBottom: '24px',
          }}>
            <div style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '11px',
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              color:          '#FF6B2B',
              marginBottom:   '14px',
            }}>
              Your Order
            </div>
            {cartItems.map(item => (
              <div key={item.id} style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'center',
                padding:        '8px 0',
                borderBottom:   '1px solid #1a1a1a',
                fontSize:        '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                  <span style={{ color: '#CCC' }}>{item.name}</span>
                  <span style={{
                    background:    '#1a1a1a',
                    border:        '1px solid #2a2a2a',
                    borderRadius:  '4px',
                    padding:       '2px 8px',
                    fontSize:       '11px',
                    fontFamily:     "'Barlow Condensed', sans-serif",
                    letterSpacing:  '1px',
                    color:          '#666',
                  }}>
                    ×{cart[item.id]}
                  </span>
                </div>
                <span style={{ color: '#FF6B2B', fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px' }}>
                  ${(item.price * cart[item.id]).toFixed(2)}
                </span>
              </div>
            ))}
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              marginTop:      '12px',
              fontFamily:     "'Bebas Neue', sans-serif",
              fontSize:        '22px',
              letterSpacing:   '2px',
            }}>
              <span>Total</span>
              <span style={{ color: '#FF6B2B' }}>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Details form */}
          <div style={{
            background:   '#161616',
            border:       '1px solid #222',
            borderRadius: '10px',
            padding:      '28px',
          }}>
            <div style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:       '26px',
              letterSpacing:  '2px',
              marginBottom:   '24px',
            }}>
              YOUR DETAILS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '11px',
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  color:          '#777',
                }}>
                  Name *
                </label>
                <input
                  style={{
                    background:   '#0d0d0d',
                    color:        '#F5F5F5',
                    border:       `1px solid ${errors.name ? '#ef4444' : '#222'}`,
                    borderRadius: '6px',
                    padding:      '12px 14px',
                    fontSize:      '14px',
                    outline:      'none',
                    width:        '100%',
                    fontFamily:   'inherit',
                    colorScheme:  'dark',
                    transition:   'border-color 0.2s',
                  }}
                  placeholder="First Last"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,107,43,0.5)'}
                  onBlur={e => e.target.style.borderColor = errors.name ? '#ef4444' : '#222'}
                />
                {errors.name && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.name}</span>}
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '11px',
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  color:          '#777',
                }}>
                  Phone
                </label>
                <input
                  style={{
                    background:   '#0d0d0d',
                    color:        '#F5F5F5',
                    border:       '1px solid #222',
                    borderRadius: '6px',
                    padding:      '12px 14px',
                    fontSize:      '14px',
                    outline:      'none',
                    width:        '100%',
                    fontFamily:   'inherit',
                    colorScheme:  'dark',
                    transition:   'border-color 0.2s',
                  }}
                  placeholder="(210) 555-0000"
                  value={form.phone}
                  onChange={e => setField('phone', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,107,43,0.5)'}
                  onBlur={e => e.target.style.borderColor = '#222'}
                />
              </div>

              {/* Pickup time */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                <label style={{
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '11px',
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  color:          '#777',
                }}>
                  Pickup Time *
                </label>
                <div style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
                  gap:                 '8px',
                }}>
                  {PICKUP_TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => { setPickupTime(t); setErrors(e => ({ ...e, time: '' })) }}
                      style={{
                        background:    pickupTime === t ? '#FF6B2B' : '#0d0d0d',
                        color:         pickupTime === t ? '#0A0A0A' : '#666',
                        border:        pickupTime === t ? '1px solid #FF6B2B' : '1px solid #222',
                        borderRadius:  '6px',
                        fontFamily:    "'Barlow Condensed', sans-serif",
                        fontSize:       '12px',
                        fontWeight:     pickupTime === t ? 700 : 400,
                        letterSpacing:  '0.5px',
                        padding:        '9px 4px',
                        cursor:         'pointer',
                        transition:     'all 0.15s',
                        textAlign:      'center',
                      }}
                      onMouseEnter={e => { if (pickupTime !== t) { e.currentTarget.style.borderColor = 'rgba(255,107,43,0.4)'; e.currentTarget.style.color = '#F5F5F5' } }}
                      onMouseLeave={e => { if (pickupTime !== t) { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#666' } }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.time && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.time}</span>}
              </div>

              {/* Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                <label style={{
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '11px',
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  color:          '#777',
                }}>
                  Special Requests
                </label>
                <textarea
                  style={{
                    background:   '#0d0d0d',
                    color:        '#F5F5F5',
                    border:       '1px solid #222',
                    borderRadius: '6px',
                    padding:      '12px 14px',
                    fontSize:      '14px',
                    outline:      'none',
                    width:        '100%',
                    fontFamily:   'inherit',
                    colorScheme:  'dark',
                    resize:       'vertical',
                    minHeight:    '80px',
                    transition:   'border-color 0.2s',
                  }}
                  placeholder="Allergies, no onions, extra sauce..."
                  value={form.notes}
                  onChange={e => setField('notes', e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,107,43,0.5)'}
                  onBlur={e => e.target.style.borderColor = '#222'}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  background:    'transparent',
                  color:         '#666',
                  border:        '1px solid #2a2a2a',
                  borderRadius:  '6px',
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '13px',
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  padding:        '13px 20px',
                  cursor:         'pointer',
                  transition:     'all 0.2s',
                  whiteSpace:     'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#F5F5F5' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666' }}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex:          1,
                  background:    '#FF6B2B',
                  color:         '#0A0A0A',
                  border:        'none',
                  borderRadius:  '6px',
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:       '22px',
                  letterSpacing:  '3px',
                  padding:        '14px',
                  cursor:         loading ? 'not-allowed' : 'pointer',
                  opacity:        loading ? 0.7 : 1,
                  transition:     'background 0.2s',
                  boxShadow:      '0 0 24px rgba(255,107,43,0.2)',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ff7d42' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#FF6B2B' }}
              >
                {loading ? 'PLACING ORDER...' : `PLACE ORDER · $${cartTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}