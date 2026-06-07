import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut, getCustomerBookings } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { SHOP_CONFIG as C } from './config'
import toast from 'react-hot-toast'

const PUNCH_GOAL = 10

const STATUS_STYLE = {
  confirmed: { background: 'rgba(201,162,39,0.12)', color: C.accentColor, border: '1px solid rgba(201,162,39,0.25)' },
  completed: { background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' },
  cancelled: { background: 'rgba(220,38,38,0.08)', color: '#f87171', border: '1px solid rgba(220,38,38,0.2)' },
}

export default function BarberProfile() {
  const navigate = useNavigate()
  const { user, profile, clearAuth } = useAuthStore()
  const [leaving, setLeaving] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getCustomerBookings(user.id).then(({ data }) => {
      setBookings(data ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const handleSignOut = async () => {
    setLeaving(true)
    await signOut()
    clearAuth()
    toast.success('Signed out')
    navigate('/barber')
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Customer'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const now = new Date()
  const withMeta = bookings.map(b => {
    const date = b.booked_at ? new Date(b.booked_at) : null
    const status = b.status || (date && date > now ? 'confirmed' : 'completed')
    return { ...b, _date: date, _status: status }
  })
  const upcoming = withMeta.filter(b => b._date && b._date > now).sort((a, b) => a._date - b._date)
  const past = withMeta.filter(b => !b._date || b._date <= now).sort((a, b) => (b._date || 0) - (a._date || 0))
  const completedCount = withMeta.filter(b => b._status === 'completed').length
  const punches = Math.min(completedCount, PUNCH_GOAL)

  const fmt = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—'

  return (
    <div style={{ background: C.bgPrimary, minHeight: '100vh', color: C.textPrimary, fontFamily: "'Inter', sans-serif", padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, flexWrap: 'wrap' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #1a1a1a, #252525)',
            border: `2px solid ${C.borderSubtle}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Playfair Display', serif", fontSize: 26, color: C.accentColor,
          }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.accentColor, marginBottom: 4 }}>My Profile</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30 }}>{displayName}</div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{user?.email}</div>
          </div>
          <button onClick={handleSignOut} disabled={leaving} style={{
            background: 'transparent', border: `1px solid ${C.borderSubtle}`, color: C.textSecondary, borderRadius: 100,
            padding: '9px 18px', fontSize: 13, cursor: 'pointer', alignSelf: 'flex-start',
          }}>{leaving ? '...' : 'Sign Out'}</button>
        </div>

        {/* Loyalty punch card */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.accentColor, marginBottom: 4 }}>✦ Loyalty Punch Card</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22 }}>{punches}/{PUNCH_GOAL} cuts</div>
            </div>
            <div style={{ background: 'rgba(201,162,39,0.08)', border: `1px solid ${C.borderSubtle}`, borderRadius: 8, padding: '8px 14px', textAlign: 'right' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: C.accentColor }}>FREE CUT</div>
              <div style={{ fontSize: 11, color: C.textSecondary }}>at {PUNCH_GOAL} cuts</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, maxWidth: 360 }}>
            {Array.from({ length: PUNCH_GOAL }, (_, i) => (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${i < punches ? C.accentColor : '#3a3a3a'}`,
                background: i < punches ? `${C.accentColor}33` : 'transparent',
                color: i < punches ? C.accentColor : '#444', fontSize: 16,
                animation: i < punches ? `brbPunchPop 0.4s ease backwards ${i * 0.1}s` : 'none',
              }}>{i < punches ? '✂' : '○'}</div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.textSecondary, marginTop: 14 }}>10 cuts = 1 free cut · {PUNCH_GOAL - punches} more to go</p>
        </div>

        {/* Booking history */}
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16 }}>Booking History</h3>
        {loading ? (
          <p style={{ color: C.textSecondary, fontSize: 14 }}>Loading...</p>
        ) : withMeta.length === 0 ? (
          <p style={{ color: C.textSecondary, fontSize: 14 }}>No bookings yet — book your first cut!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...upcoming, ...past].map((b, i) => (
              <div key={b.id ?? i} style={{
                background: i < upcoming.length ? `linear-gradient(135deg, ${C.accentColor}1a, ${C.bgCard})` : C.bgCard,
                border: `1px solid ${i < upcoming.length ? C.accentColor : C.borderSubtle}`, borderRadius: 10,
                padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
              }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18 }}>{b.barbers?.name || 'Barber'}</div>
                  <div style={{ fontSize: 13, color: C.textSecondary }}>{b.services?.name || 'Service'} · {fmt(b._date)}</div>
                </div>
                <span style={{
                  ...(STATUS_STYLE[b._status] || STATUS_STYLE.confirmed),
                  fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100,
                }}>{b._status === 'confirmed' && i < upcoming.length ? 'Upcoming' : b._status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes brbPunchPop { 0% { transform: scale(0.4); opacity: 0; } 70% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); } }
      `}</style>
    </div>
  )
}
