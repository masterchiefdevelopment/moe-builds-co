// src/pages/foodtruck/FoodTruckProfile.jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut, getCustomerOrders } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { TRUCK_CONFIG as C } from './config'
import toast from 'react-hot-toast'

const MOCK_ORDERS = [
  {
    id:       'ORD-001',
    items:    ['Smash Burger', 'Loaded Fries', 'Agua Fresca'],
    total:    '$24.00',
    date:     'Jun 1, 2025',
    time:     '12:30 PM',
    location: 'Pearl Brewery District',
    status:   'completed',
  },
  {
    id:       'ORD-002',
    items:    ['Birria Tacos x2', 'Street Corn'],
    total:    '$33.00',
    date:     'May 28, 2025',
    time:     '1:15 PM',
    location: 'Downtown Main Plaza',
    status:   'completed',
  },
  {
    id:       'ORD-003',
    items:    ['Spicy Smash', 'Onion Rings', 'Jarritos'],
    total:    '$22.00',
    date:     'May 22, 2025',
    time:     '11:45 AM',
    location: 'UTSA Main Campus',
    status:   'completed',
  },
  {
    id:       'ORD-004',
    items:    ['Al Pastor Tacos', 'Fresh Lemonade'],
    total:    '$17.00',
    date:     'Jun 3, 2025',
    time:     '12:00 PM',
    location: 'Alamo Heights',
    status:   'upcoming',
  },
]

const STATUS_STYLE = {
  completed: { background: 'rgba(74,222,128,0.08)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)'  },
  upcoming:  { background: 'rgba(255,107,43,0.10)', color: '#FF6B2B', border: '1px solid rgba(255,107,43,0.25)' },
  cancelled: { background: 'rgba(239,68,68,0.08)',  color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)'  },
}

const PUNCH_GOAL  = 10

export default function FoodTruckProfile() {
  const navigate              = useNavigate()
  const { user, profile, clearAuth } = useAuthStore()
  const [tab,     setTab]     = useState('orders')
  const [leaving, setLeaving] = useState(false)
  const [form,    setForm]    = useState({ name: '', phone: '' })
  const [orders,  setOrders]  = useState(null) // null = loading/unknown -> fall back to mock

  useEffect(() => {
    if (!user) return
    getCustomerOrders(C.restaurantId, user.id)
      .then(({ data }) => { if (data && data.length) setOrders(data) })
      .catch(() => {})
  }, [user])

  const realOrders = orders && orders.length
    ? orders.map(o => ({
        id: o.id,
        items: Array.isArray(o.items) ? o.items.map(i => i.name || i) : [],
        total: `$${Number(o.total ?? 0).toFixed(2)}`,
        date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
        time: o.pickup_time || '—',
        location: C.name,
        status: o.status === 'completed' ? 'completed' : (o.status === 'cancelled' ? 'cancelled' : 'upcoming'),
      }))
    : MOCK_ORDERS

  const punchCount = orders && orders.length ? Math.min(orders.length, PUNCH_GOAL) : 4

  const handleSignOut = async () => {
    setLeaving(true)
    await signOut()
    clearAuth()
    toast.success('Signed out')
    navigate('/foodtruck')
  }

  const displayName = profile?.full_name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'Customer'

  const initials = displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const upcomingOrders  = realOrders.filter(o => o.status === 'upcoming')
  const completedOrders = realOrders.filter(o => o.status === 'completed')

  return (
    <div style={{
      minHeight:  '100vh',
      padding:    '80px 20px 60px',
      maxWidth:   '720px',
      margin:     '0 auto',
    }}>

      {/* ── Profile header ───────────────────────────── */}
      <div style={{
        display:     'flex',
        alignItems:  'center',
        gap:         '20px',
        marginBottom:'40px',
        flexWrap:    'wrap',
      }}>
        {/* Avatar */}
        <div style={{
          width:          '72px',
          height:         '72px',
          borderRadius:   '50%',
          flexShrink:     0,
          background:     'linear-gradient(135deg, #1a1a1a, #252525)',
          border:         '2px solid rgba(255,107,43,0.3)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontFamily:     "'Bebas Neue', sans-serif",
          fontSize:        '26px',
          letterSpacing:   '2px',
          color:           'rgba(255,107,43,0.5)',
        }}>
          {initials}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '11px',
            letterSpacing:  '3px',
            textTransform:  'uppercase',
            color:          '#FF6B2B',
            marginBottom:   '4px',
          }}>
            My Profile
          </div>
          <div style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       'clamp(28px, 5vw, 40px)',
            letterSpacing:  '3px',
            lineHeight:     1,
            marginBottom:   '4px',
          }}>
            {displayName.toUpperCase()}
          </div>
          <div style={{ fontSize: '13px', color: '#555' }}>
            {user?.email}
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={leaving}
          style={{
            background:    'transparent',
            color:         '#555',
            border:        '1px solid #2a2a2a',
            borderRadius:  '6px',
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '12px',
            letterSpacing:  '2px',
            textTransform:  'uppercase',
            padding:        '10px 16px',
            cursor:         'pointer',
            transition:     'all 0.2s',
            alignSelf:      'flex-start',
            whiteSpace:     'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#F5F5F5' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555' }}
        >
          {leaving ? '...' : 'Sign Out'}
        </button>
      </div>

      {/* ── Loyalty punch card ───────────────────────── */}
      <div style={{
        background:    'linear-gradient(135deg, #1a1008, #1a1a1a)',
        border:        '1px solid rgba(255,107,43,0.25)',
        borderRadius:  '10px',
        padding:       '24px',
        marginBottom:  '24px',
        boxShadow:     '0 0 30px rgba(255,107,43,0.04)',
      }}>
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-start',
          flexWrap:       'wrap',
          gap:            '12px',
          marginBottom:   '20px',
        }}>
          <div>
            <div style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '11px',
              letterSpacing:  '3px',
              textTransform:  'uppercase',
              color:          '#FF6B2B',
              marginBottom:   '4px',
            }}>
              🔥 Loyalty Punch Card
            </div>
            <div style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:       '26px',
              letterSpacing:  '2px',
            }}>
              {punchCount}/{PUNCH_GOAL} ORDERS
            </div>
          </div>

          <div style={{
            background:   'rgba(255,107,43,0.08)',
            border:       '1px solid rgba(255,107,43,0.2)',
            borderRadius: '8px',
            padding:      '10px 16px',
            textAlign:    'right',
          }}>
            <div style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:       '18px',
              letterSpacing:  '2px',
              color:          '#FF6B2B',
            }}>
              FREE MEAL
            </div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
              at {PUNCH_GOAL} orders
            </div>
          </div>
        </div>

        {/* Punches */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {Array.from({ length: PUNCH_GOAL }, (_, i) => (
            <div
              key={i}
              style={{
                width:          '44px',
                height:         '44px',
                borderRadius:   '50%',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontSize:        '18px',
                background:      i < punchCount ? '#FF6B2B' : 'transparent',
                border:          i < punchCount ? 'none' : '2px dashed #2a2a2a',
                transition:      'all 0.2s',
              }}
            >
              {i < punchCount ? '🔥' : ''}
            </div>
          ))}
        </div>

        <p style={{ fontSize: '12px', color: '#444' }}>
          {PUNCH_GOAL - punchCount} more order{PUNCH_GOAL - punchCount !== 1 ? 's' : ''} until your free meal
        </p>
      </div>

      {/* ── Quick actions ────────────────────────────── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap:                 '10px',
        marginBottom:        '24px',
      }}>
        {[
          { label: 'Order Now',    to: '/foodtruck/order',    icon: '🛒' },
          { label: 'Full Menu',    to: '/foodtruck/menu',     icon: '🍔' },
          { label: 'Find Truck',   to: '/foodtruck/location', icon: '📍' },
        ].map(({ label, to, icon }) => (
          <Link
            key={to}
            to={to}
            style={{
              background:    '#161616',
              border:        '1px solid #222',
              borderRadius:  '8px',
              padding:       '16px',
              textDecoration:'none',
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              gap:           '8px',
              transition:    'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,107,43,0.35)'
              e.currentTarget.style.transform   = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#222'
              e.currentTarget.style.transform   = 'translateY(0)'
            }}
          >
            <span style={{ fontSize: '24px' }}>{icon}</span>
            <span style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '12px',
              letterSpacing:  '1.5px',
              textTransform:  'uppercase',
              color:          '#888',
            }}>
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* ── Tabs ─────────────────────────────────────── */}
      <div style={{
        display:      'flex',
        gap:          '4px',
        marginBottom: '20px',
        background:   '#111',
        borderRadius: '6px',
        padding:      '4px',
      }}>
        {[
          { id: 'orders',   label: 'Order History' },
          { id: 'upcoming', label: 'Upcoming'      },
          { id: 'settings', label: 'Settings'      },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex:          1,
              background:    tab === id ? '#1e1e1e' : 'transparent',
              border:        tab === id ? '1px solid #2a2a2a' : '1px solid transparent',
              borderRadius:  '4px',
              padding:       '10px 8px',
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '12px',
              letterSpacing:  '1.5px',
              textTransform:  'uppercase',
              color:          tab === id ? '#FF6B2B' : '#555',
              cursor:         'pointer',
              transition:     'all 0.2s',
              whiteSpace:     'nowrap',
            }}
          >
            {label}
            {id === 'upcoming' && upcomingOrders.length > 0 && (
              <span style={{
                marginLeft:    '6px',
                background:    '#FF6B2B',
                color:         '#0A0A0A',
                borderRadius:  '100px',
                padding:       '1px 6px',
                fontSize:       '10px',
                fontFamily:     "'Barlow Condensed', sans-serif",
                fontWeight:     700,
              }}>
                {upcomingOrders.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Order history tab ────────────────────────── */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {completedOrders.length === 0 ? (
            <div style={{
              background:   '#161616',
              border:       '1px solid #1f1f1f',
              borderRadius: '8px',
              padding:      '40px 24px',
              textAlign:    'center',
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🍔</div>
              <div style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:       '22px',
                letterSpacing:  '2px',
                marginBottom:   '8px',
              }}>
                NO ORDERS YET
              </div>
              <p style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>
                Your order history will show up here.
              </p>
              <Link
                to="/foodtruck/order"
                style={{
                  background:    '#FF6B2B',
                  color:         '#0A0A0A',
                  borderRadius:  '6px',
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '13px',
                  fontWeight:     700,
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  padding:        '12px 24px',
                  display:        'inline-block',
                }}
              >
                Place First Order
              </Link>
            </div>
          ) : (
            completedOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      )}

      {/* ── Upcoming tab ─────────────────────────────── */}
      {tab === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {upcomingOrders.length === 0 ? (
            <div style={{
              background:   '#161616',
              border:       '1px solid #1f1f1f',
              borderRadius: '8px',
              padding:      '40px 24px',
              textAlign:    'center',
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📅</div>
              <div style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:       '22px',
                letterSpacing:  '2px',
                marginBottom:   '8px',
              }}>
                NO UPCOMING ORDERS
              </div>
              <p style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>
                Order ahead and skip the line.
              </p>
              <Link
                to="/foodtruck/order"
                style={{
                  background:    '#FF6B2B',
                  color:         '#0A0A0A',
                  borderRadius:  '6px',
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '13px',
                  fontWeight:     700,
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  padding:        '12px 24px',
                  display:        'inline-block',
                }}
              >
                Order Now
              </Link>
            </div>
          ) : (
            upcomingOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      )}

      {/* ── Settings tab ─────────────────────────────── */}
      {tab === 'settings' && (
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
            ACCOUNT SETTINGS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '11px',
                letterSpacing:  '2px',
                textTransform:  'uppercase',
                color:          '#777',
              }}>
                Full Name
              </label>
              <input
                defaultValue={displayName}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
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
                onFocus={e => { e.target.style.borderColor = 'rgba(255,107,43,0.5)' }}
                onBlur={e  => { e.target.style.borderColor = '#222' }}
              />
            </div>

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
                placeholder="(210) 555-0000"
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
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
                onFocus={e => { e.target.style.borderColor = 'rgba(255,107,43,0.5)' }}
                onBlur={e  => { e.target.style.borderColor = '#222' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '11px',
                letterSpacing:  '2px',
                textTransform:  'uppercase',
                color:          '#777',
              }}>
                Email
              </label>
              <input
                defaultValue={user?.email}
                disabled
                style={{
                  background:   '#0d0d0d',
                  color:        '#F5F5F5',
                  border:       '1px solid #1a1a1a',
                  borderRadius: '6px',
                  padding:      '12px 14px',
                  fontSize:      '14px',
                  outline:      'none',
                  width:        '100%',
                  fontFamily:   'inherit',
                  colorScheme:  'dark',
                  opacity:      0.4,
                  cursor:       'not-allowed',
                }}
              />
              <span style={{ fontSize: '11px', color: '#444' }}>
                Email cannot be changed
              </span>
            </div>
          </div>

          <button
            onClick={() => toast.success('Profile updated')}
            style={{
              width:        '100%',
              background:   '#FF6B2B',
              color:        '#0A0A0A',
              border:       'none',
              borderRadius: '6px',
              fontFamily:   "'Bebas Neue', sans-serif",
              fontSize:      '20px',
              letterSpacing: '3px',
              padding:       '14px',
              cursor:        'pointer',
              transition:    'background 0.2s',
              boxShadow:     '0 0 20px rgba(255,107,43,0.12)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ff7d42' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FF6B2B' }}
          >
            SAVE CHANGES
          </button>
        </div>
      )}

    </div>
  )
}

// ── Order card sub-component ──────────────────────────────────
function OrderCard({ order }) {
  return (
    <div style={{
      background:   '#161616',
      border:       '1px solid #1f1f1f',
      borderRadius: '8px',
      padding:      '18px 20px',
      transition:   'border-color 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,43,0.2)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f1f1f' }}
    >
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'flex-start',
        flexWrap:       'wrap',
        gap:            '10px',
        marginBottom:   '10px',
      }}>
        <div>
          <div style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       '18px',
            letterSpacing:  '1.5px',
            marginBottom:   '2px',
          }}>
            {order.id}
          </div>
          <div style={{ fontSize: '12px', color: '#555' }}>
            {order.date} at {order.time} · {order.location}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       '20px',
            letterSpacing:  '1px',
            color:          '#FF6B2B',
          }}>
            {order.total}
          </span>
          <span style={{
            ...STATUS_STYLE[order.status],
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '11px',
            letterSpacing:  '1.5px',
            textTransform:  'uppercase',
            padding:        '4px 10px',
            borderRadius:   '100px',
          }}>
            {order.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {order.items.map(item => (
          <span
            key={item}
            style={{
              background:    '#111',
              border:        '1px solid #222',
              borderRadius:  '4px',
              padding:       '4px 10px',
              fontSize:       '12px',
              color:          '#666',
              fontFamily:     "'Barlow Condensed', sans-serif",
              letterSpacing:  '0.5px',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}