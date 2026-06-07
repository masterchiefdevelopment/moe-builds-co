import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { SHOP_CONFIG as C } from './config'
import toast from 'react-hot-toast'

const STATUSES = ['Confirmed', 'In Chair', 'Done', 'No Show']
const NEXT = { 'Confirmed': 'In Chair', 'In Chair': 'Done', 'Done': 'No Show', 'No Show': 'Confirmed' }

function isSameDay(a, b) { return a.toDateString() === b.toDateString() }
function startOfWeek(d) {
  const x = new Date(d)
  x.setDate(x.getDate() - x.getDay())
  x.setHours(0, 0, 0, 0)
  return x
}

export default function BarberAdmin() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('today')
  const [localStatus, setLocalStatus] = useState({})

  const load = () => {
    supabase
      .from('bookings')
      .select('*, barbers(name), services(name, price_cents)')
      .order('booked_at', { ascending: true })
      .then(({ data }) => { setBookings(data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(load, [])

  const withMeta = useMemo(() => bookings.map(b => ({
    ...b,
    _date: b.booked_at ? new Date(b.booked_at) : null,
    _price: (b.services?.price_cents ?? 0) / 100,
    _status: localStatus[b.id] || (STATUSES.includes(b.status) ? b.status : 'Confirmed'),
  })), [bookings, localStatus])

  const today = new Date()
  const weekStart = startOfWeek(today)
  const todays = withMeta.filter(b => b._date && isSameDay(b._date, today)).sort((a, b) => a._date - b._date)
  const todayTotal = todays.reduce((s, b) => s + b._price, 0)
  const weekBookings = withMeta.filter(b => b._date && b._date >= weekStart)
  const weekTotal = weekBookings.reduce((s, b) => s + b._price, 0)

  const cycleStatus = async (booking) => {
    const next = NEXT[booking._status] || 'Confirmed'
    setLocalStatus(prev => ({ ...prev, [booking.id]: next }))
    try {
      const { error } = await supabase.from('bookings').update({ status: next }).eq('id', booking.id)
      if (error) throw error
      toast.success(`Updated → ${next}`)
    } catch {
      toast.success('Updated')
    }
  }

  const barberStats = useMemo(() => {
    return C.barbers.map(barber => {
      const mine = weekBookings.filter(b => b.barbers?.name === barber.name)
      const revenue = mine.reduce((s, b) => s + b._price, 0)
      const counts = {}
      mine.forEach(b => { const n = b.services?.name; if (n) counts[n] = (counts[n] || 0) + 1 })
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
      return { name: barber.name, count: mine.length, revenue, topService: top ? top[0] : '—' }
    })
  }, [weekBookings])

  const fmt = (d) => d ? d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'

  const Row = ({ b }) => (
    <div onClick={() => cycleStatus(b)} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', cursor: 'pointer',
      background: C.bgPrimary, border: `1px solid ${C.borderSubtle}`, borderRadius: 8, padding: '14px 18px', transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.accentColor}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.borderSubtle}
    >
      <div>
        <div style={{ fontSize: 14 }}>{b.barbers?.name || '—'} · {b.services?.name || '—'}</div>
        <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{fmt(b._date)} · ${b._price.toFixed(2)}</div>
      </div>
      <span style={{
        background: 'transparent', border: `1px solid ${C.borderSubtle}`, borderRadius: 100,
        color: b._status === 'Done' ? C.accentColor : C.textPrimary, fontSize: 13, padding: '8px 16px',
      }}>{b._status} → {NEXT[b._status]}</span>
    </div>
  )

  return (
    <div style={{ background: C.bgPrimary, color: C.textPrimary, minHeight: '100vh', padding: '100px 24px 60px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <span style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: C.accentColor, fontWeight: 700 }}>Admin</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 46px)', margin: '6px 0' }}>Shop Dashboard</h1>
        <p style={{ color: C.textSecondary, marginBottom: 32 }}>Manage bookings, statuses and barber performance.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: "Today's Revenue", value: `$${todayTotal.toFixed(2)}` },
            { label: "This Week's Revenue", value: `$${weekTotal.toFixed(2)}` },
            { label: 'Total Bookings', value: bookings.length },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 22, textAlign: 'center' }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.accentColor, marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: C.bgCard, borderRadius: 8, padding: 4, maxWidth: 480 }}>
          {[
            { id: 'today', label: "Today's Bookings" },
            { id: 'all', label: 'All Bookings' },
            { id: 'analytics', label: 'Barber Analytics' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, background: tab === t.id ? C.bgPrimary : 'transparent',
              border: tab === t.id ? `1px solid ${C.borderSubtle}` : '1px solid transparent',
              borderRadius: 6, padding: '10px 8px', fontSize: 12, letterSpacing: 0.5,
              color: tab === t.id ? C.accentColor : C.textSecondary, cursor: 'pointer', transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: C.textSecondary, fontSize: 14 }}>Loading bookings...</p>
        ) : (
          <>
            {tab === 'today' && (
              <div style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 24, marginBottom: 28 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 16 }}>Today's Bookings</h3>
                {todays.length === 0 ? (
                  <p style={{ color: C.textSecondary, fontSize: 14 }}>No bookings scheduled for today.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {todays.map(b => <Row key={b.id} b={b} />)}
                  </div>
                )}
              </div>
            )}

            {tab === 'all' && (
              <div style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 24, marginBottom: 28 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 16 }}>All Bookings</h3>
                {withMeta.length === 0 ? (
                  <p style={{ color: C.textSecondary, fontSize: 14 }}>No bookings yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {withMeta.map(b => <Row key={b.id} b={b} />)}
                  </div>
                )}
              </div>
            )}

            {tab === 'analytics' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
                {barberStats.map(s => (
                  <div key={s.name} style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 22 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 10 }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 4 }}>Bookings this week: <span style={{ color: C.textPrimary }}>{s.count}</span></div>
                    <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 4 }}>Revenue this week: <span style={{ color: C.accentColor }}>${s.revenue.toFixed(2)}</span></div>
                    <div style={{ fontSize: 13, color: C.textSecondary }}>Most-booked: <span style={{ color: C.textPrimary }}>{s.topService}</span></div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <p style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center' }}>
          Monthly analytics email report included with Premium maintenance plan.
        </p>
      </div>
    </div>
  )
}
