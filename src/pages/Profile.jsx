import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const MOCK_BOOKINGS = [
  { id: 1, barber: 'Jordan',  service: 'Skin Fade',   date: 'Jun 1, 2025',  time: '10:00 AM', status: 'confirmed' },
  { id: 2, barber: 'Marcus',  service: 'Cut + Beard', date: 'May 22, 2025', time: '2:30 PM',  status: 'completed' },
  { id: 3, barber: 'Devon',   service: 'Lineup',      date: 'May 8, 2025',  time: '11:00 AM', status: 'completed' },
  { id: 4, barber: 'Jordan',  service: 'Skin Fade',   date: 'Apr 19, 2025', time: '3:00 PM',  status: 'completed' },
]

const STATUS_STYLE = {
  confirmed: { background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' },
  completed: { background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' },
  cancelled: { background: 'rgba(239,68,68,0.08)',  color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' },
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, profile, clearAuth } = useAuthStore()
  const [leaving, setLeaving] = useState(false)
  const [tab,     setTab]     = useState('bookings')

  const punches   = 4
  const punchGoal = 10

  const handleSignOut = async () => {
    setLeaving(true)
    await signOut()
    clearAuth()
    toast.success('Signed out')
    navigate('/')
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Customer'
  const initials    = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="page" style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1a1a1a, #252525)',
          border: '2px solid rgba(212,175,55,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Bebas Neue'", fontSize: '26px', letterSpacing: '2px', color: 'rgba(212,175,55,0.5)',
        }}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '4px' }}>My Profile</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '36px', letterSpacing: '3px', lineHeight: 1 }}>{displayName.toUpperCase()}</div>
          <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>{user?.email}</div>
        </div>
        <button onClick={handleSignOut} disabled={leaving} className="btn-ghost" style={{ alignSelf: 'flex-start' }}>
          {leaving ? '...' : 'Sign Out'}
        </button>
      </div>

      <div style={{ background: '#161616', border: '1px solid #222', borderRadius: '10px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '4px' }}>✦ Loyalty Punch Card</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '22px', letterSpacing: '2px' }}>{punches}/{punchGoal} CUTS</div>
          </div>
          <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '6px', padding: '8px 14px', textAlign: 'right' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '18px', letterSpacing: '2px', color: '#D4AF37' }}>FREE LINEUP</div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>at {punchGoal} cuts</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Array.from({ length: punchGoal }, (_, i) => (
            <div key={i} style={{
              width: '44px', height: '44px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              background: i < punches ? '#D4AF37' : 'transparent',
              border: i < punches ? 'none' : '2px dashed #2a2a2a',
            }}>{i < punches ? '✂' : ''}</div>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#444', marginTop: '14px' }}>{punchGoal - punches} more cuts until your free lineup</p>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#111', borderRadius: '6px', padding: '4px' }}>
        {['bookings', 'settings'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, background: tab === t ? '#1e1e1e' : 'transparent',
            border: tab === t ? '1px solid #2a2a2a' : '1px solid transparent',
            borderRadius: '4px', padding: '10px',
            fontFamily: "'Barlow Condensed'", fontSize: '12px', letterSpacing: '2px',
            textTransform: 'uppercase', color: tab === t ? '#D4AF37' : '#555',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {t === 'bookings' ? 'Booking History' : 'Account Settings'}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MOCK_BOOKINGS.map(b => (
            <div key={b.id} style={{
              background: '#161616', border: '1px solid #1f1f1f', borderRadius: '8px',
              padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
            }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', letterSpacing: '1.5px', marginBottom: '2px' }}>{b.barber}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>{b.service} · {b.date} at {b.time}</div>
              </div>
              <span style={{
                ...STATUS_STYLE[b.status],
                fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '1.5px',
                textTransform: 'uppercase', padding: '4px 10px', borderRadius: '100px',
              }}>{b.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <div className="form-card">
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '24px', letterSpacing: '2px', marginBottom: '20px' }}>ACCOUNT SETTINGS</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" defaultValue={displayName} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="(210) 555-0000" />
            </div>
            <div className="form-group full">
              <label className="form-label">Email</label>
              <input className="form-input" defaultValue={user?.email} disabled style={{ opacity: 0.5 }} />
            </div>
          </div>
          <button className="submit-btn" style={{ marginTop: '20px', fontSize: '18px' }} onClick={() => toast.success('Profile updated')}>
            SAVE CHANGES
          </button>
        </div>
      )}
    </div>
  )
}
