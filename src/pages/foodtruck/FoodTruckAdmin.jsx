import { useEffect, useState } from 'react'
import { getRestaurantOrders, updateOrderStatus } from '../../lib/supabase'
import { TRUCK_CONFIG as C } from './config'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'preparing', 'ready']
const NEXT = { pending: 'preparing', preparing: 'ready', ready: 'pending' }
const LABEL = { pending: 'Pending', preparing: 'Preparing', ready: 'Ready' }
const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function isSameDay(a, b) { return a.toDateString() === b.toDateString() }
function startOfWeek(d) {
  const x = new Date(d)
  x.setDate(x.getDate() - x.getDay())
  x.setHours(0, 0, 0, 0)
  return x
}

export default function FoodTruckAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [schedule, setSchedule] = useState(C.schedule)
  const [editDay, setEditDay] = useState(null)
  const [draft, setDraft] = useState({ location: '', address: '', hours: '' })

  const load = () => {
    getRestaurantOrders(C.restaurantId).then(({ data }) => {
      setOrders(data ?? [])
      setLoading(false)
    })
  }
  useEffect(load, [])

  const toggleStatus = async (order) => {
    const next = NEXT[order.status] || 'pending'
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next } : o))
    const { error } = await updateOrderStatus(order.id, next)
    if (error) toast.error('Could not update status')
    else toast.success(`Order #${order.id} → ${LABEL[next]}`)
  }

  const today = new Date()
  const weekStart = startOfWeek(today)
  const todayTotal = orders.filter(o => isSameDay(new Date(o.created_at), today)).reduce((s, o) => s + Number(o.total), 0)
  const weekTotal = orders.filter(o => new Date(o.created_at) >= weekStart).reduce((s, o) => s + Number(o.total), 0)

  const startEdit = (day) => {
    setEditDay(day)
    setDraft({ ...schedule[day] })
  }

  const saveEdit = () => {
    setSchedule(prev => ({ ...prev, [editDay]: { ...draft } }))
    setEditDay(null)
    toast.success('Saved')
  }

  return (
    <div style={{ background: C.bgPrimary, color: C.textPrimary, minHeight: '100vh', padding: '100px 24px 60px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <span style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: C.accentAmber, fontWeight: 700 }}>Admin</span>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: 1, margin: '6px 0 6px' }}>Truck Dashboard</h1>
        <p style={{ color: C.textSecondary, marginBottom: 32 }}>Manage incoming orders, revenue and your weekly schedule.</p>

        {/* Revenue cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: "Today's Revenue", value: `$${todayTotal.toFixed(2)}` },
            { label: "This Week's Revenue", value: `$${weekTotal.toFixed(2)}` },
            { label: 'Total Orders', value: orders.length },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 22, textAlign: 'center' }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.accentAmber, marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 1 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1, marginBottom: 16 }}>Orders</h3>
          {loading ? (
            <p style={{ color: C.textSecondary, fontSize: 14 }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: C.textSecondary, fontSize: 14 }}>No orders yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orders.map(o => (
                <div key={o.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                  background: C.bgPrimary, border: `1px solid ${C.borderSubtle}`, borderRadius: 8, padding: '14px 18px',
                }}>
                  <div>
                    <div style={{ fontSize: 14 }}>{(o.items || []).map(i => `${i.qty}× ${i.name}`).join(', ')}</div>
                    <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>
                      Pickup {o.pickup_time} · ${Number(o.total).toFixed(2)} · {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button type="button" onClick={() => toggleStatus(o)} style={{
                    background: 'transparent', border: `1px solid ${C.borderSubtle}`, borderRadius: 100,
                    color: o.status === 'ready' ? C.accentAmber : C.textPrimary, fontSize: 13, padding: '8px 16px', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentColor }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderSubtle }}
                  >{LABEL[o.status] || o.status} → {LABEL[NEXT[o.status] || 'pending']}</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule editor */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1, marginBottom: 16 }}>Weekly Schedule Editor</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {DAY_KEYS.map(day => {
              const sch = schedule[day]
              const editing = editDay === day
              return (
                <div key={day} style={{ background: C.bgPrimary, border: `1px solid ${C.borderSubtle}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 1, marginBottom: 8 }}>{day}</div>
                  {editing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input className="ftadm-input" placeholder="Location" value={draft.location} onChange={e => setDraft(d => ({ ...d, location: e.target.value }))} />
                      <input className="ftadm-input" placeholder="Address" value={draft.address} onChange={e => setDraft(d => ({ ...d, address: e.target.value }))} />
                      <input className="ftadm-input" placeholder="Hours (e.g. 11am–3pm)" value={draft.hours} onChange={e => setDraft(d => ({ ...d, hours: e.target.value }))} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" onClick={saveEdit} style={{ flex: 1, background: C.accentColor, color: '#0d0d0d', border: 'none', borderRadius: 6, padding: '8px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => setEditDay(null)} style={{ flex: 1, background: 'transparent', color: C.textSecondary, border: `1px solid ${C.borderSubtle}`, borderRadius: 6, padding: '8px', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: 13, color: C.textPrimary, marginBottom: 2 }}>{sch.location}</p>
                      <p style={{ fontSize: 12, color: C.textSecondary, marginBottom: 2 }}>{sch.address}</p>
                      <p style={{ fontSize: 12, color: C.accentAmber, marginBottom: 10 }}>{sch.hours}</p>
                      <button type="button" onClick={() => startEdit(day)} style={{ background: 'transparent', color: C.accentColor, border: `1px solid ${C.accentColor}`, borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer' }}>Edit</button>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <p style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center' }}>
          Monthly analytics email report included with Premium maintenance plan.
        </p>
      </div>
      <style>{`
        .ftadm-input {
          background: ${C.bgCard}; color: ${C.textPrimary}; border: 1px solid ${C.borderSubtle};
          border-radius: 6px; padding: 8px 10px; font-size: 12px; font-family: 'Inter', sans-serif; outline: none; color-scheme: dark;
        }
        .ftadm-input:focus { border-color: ${C.accentColor}; }
      `}</style>
    </div>
  )
}
