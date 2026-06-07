import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { getCustomerOrders, getProfile } from '../../lib/supabase'
import { RESTAURANT_CONFIG as C } from './config'

const STAMPS = 10

export default function RestaurantProfile() {
  const { user, profile, setProfile } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let active = true
    Promise.all([
      getCustomerOrders(C.restaurantId, user.id),
      profile ? Promise.resolve({ data: profile }) : getProfile(user.id),
    ]).then(([ordersRes, profileRes]) => {
      if (!active) return
      setOrders(ordersRes.data ?? [])
      if (profileRes.data) setProfile(profileRes.data)
      setLoading(false)
    }).catch(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [user])

  const earnedStamps = Math.min(orders.length, STAMPS)

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="sec-header">
        <p className="sec-label">Your Account</p>
        <h1 className="sec-title">{user?.user_metadata?.full_name || 'My Profile'}</h1>
        <p className="sec-desc">{user?.email}</p>
      </div>

      {/* Loyalty card */}
      <div className="form-card" style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, marginBottom: 6 }}>Loyalty Punch Card</h3>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 18 }}>
          Earn a stamp with every order — collect {STAMPS} for a free entrée.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, maxWidth: 360 }}>
          {Array.from({ length: STAMPS }).map((_, i) => (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${i < earnedStamps ? C.accentColor : 'var(--border)'}`,
              background: i < earnedStamps ? `${C.accentColor}22` : 'transparent',
              color: i < earnedStamps ? C.accentColor : '#444',
              fontSize: 18,
            }}>{i < earnedStamps ? '★' : '☆'}</div>
          ))}
        </div>
        <p style={{ marginTop: 14, fontSize: 13, color: '#999' }}>
          {earnedStamps} / {STAMPS} stamps {earnedStamps >= STAMPS ? '— reward unlocked! 🎉' : `— ${STAMPS - earnedStamps} more to a free meal`}
        </p>
      </div>

      {/* Order history */}
      <div className="form-card">
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, marginBottom: 16 }}>Order History</h3>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No orders yet — your history will show up here once you order.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.map(o => (
              <div key={o.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 18px',
              }}>
                <div>
                  <div style={{ fontSize: 14 }}>{(o.items || []).map(i => `${i.qty}× ${i.name}`).join(', ')}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                    Pickup {o.pickup_time} · {new Date(o.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: C.accentColor, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16 }}>${Number(o.total).toFixed(2)}</div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#888' }}>{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
