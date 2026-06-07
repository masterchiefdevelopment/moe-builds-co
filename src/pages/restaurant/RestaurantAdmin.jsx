import { useEffect, useState } from 'react'
import { getRestaurantOrders, updateOrderStatus } from '../../lib/supabase'
import { RESTAURANT_CONFIG as C } from './config'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'ready', 'completed']
const NEXT = { pending: 'ready', ready: 'completed', completed: 'pending' }
const LABEL = { pending: 'Pending', ready: 'Ready', completed: 'Completed' }

function isSameDay(a, b) { return a.toDateString() === b.toDateString() }
function startOfWeek(d) {
  const x = new Date(d)
  x.setDate(x.getDate() - x.getDay())
  x.setHours(0, 0, 0, 0)
  return x
}

export default function RestaurantAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

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
  const volumeByStatus = STATUSES.map(s => ({ status: s, count: orders.filter(o => o.status === s).length }))
  const maxVolume = Math.max(1, ...volumeByStatus.map(v => v.count))

  return (
    <div className="page">
      <div className="sec-header">
        <p className="sec-label">Admin</p>
        <h1 className="sec-title">Dashboard</h1>
        <p className="sec-desc">Manage incoming orders and track revenue.</p>
      </div>

      {/* Revenue cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: "Today's Revenue", value: `$${todayTotal.toFixed(2)}` },
          { label: "This Week's Revenue", value: `$${weekTotal.toFixed(2)}` },
          { label: 'Total Orders', value: orders.length },
        ].map(({ label, value }) => (
          <div key={label} className="card" style={{ padding: 22, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.accentColor, marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Order volume bar chart */}
      <div className="form-card" style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, marginBottom: 18 }}>Order Volume by Status</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', height: 140 }}>
          {volumeByStatus.map(({ status, count }) => (
            <div key={status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{
                width: '100%', maxWidth: 64, height: `${(count / maxVolume) * 100}px`, minHeight: 4,
                background: C.accentColor, borderRadius: '4px 4px 0 0', transition: 'height 0.3s',
              }} />
              <div style={{ fontSize: 13, color: '#ccc' }}>{count}</div>
              <div style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#888' }}>{LABEL[status]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="form-card" style={{ marginBottom: 28 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, marginBottom: 16 }}>Orders</h3>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No orders yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.map(o => (
              <div key={o.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 18px',
              }}>
                <div>
                  <div style={{ fontSize: 14 }}>{(o.items || []).map(i => `${i.qty}× ${i.name}`).join(', ')}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                    Pickup {o.pickup_time} · ${Number(o.total).toFixed(2)} · {new Date(o.created_at).toLocaleString()}
                  </div>
                </div>
                <button type="button" onClick={() => toggleStatus(o)} className="btn-ghost" style={{
                  borderColor: o.status === 'completed' ? `${C.accentColor}55` : undefined,
                  color: o.status === 'completed' ? C.accentColor : undefined,
                }}>
                  {LABEL[o.status] || o.status} → {LABEL[NEXT[o.status] || 'pending']}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ fontSize: 13, color: '#666', textAlign: 'center' }}>
        Monthly analytics email report included with Premium maintenance plan.
      </p>
    </div>
  )
}
