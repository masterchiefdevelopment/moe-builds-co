import { useState } from 'react'
import { RESTAURANT_CONFIG as C } from './config'
import { submitContact } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function RestaurantLocation() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill in all fields')
    setSubmitting(true)
    try {
      await submitContact({ restaurant_id: C.restaurantId, ...form })
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      toast.success('Message sent!')
    } catch {
      toast.error('Something went wrong — try again later')
    }
    setSubmitting(false)
  }

  return (
    <div className="page">
      <div className="sec-header">
        <p className="sec-label">Find Us</p>
        <h1 className="sec-title">Location & Hours</h1>
        <p className="sec-desc">{C.address}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="loc-grid">
        {/* Hours + maps */}
        <div className="form-card">
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, marginBottom: 16 }}>Hours</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {C.hours.map(({ day, time }) => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#ccc' }}>
                <span>{day}</span>
                <span style={{ color: C.accentColor }}>{time}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: '#ccc', marginBottom: 4 }}>{C.address}</p>
          <p style={{ fontSize: 14, color: '#ccc', marginBottom: 16 }}>{C.phone}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={C.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Open in Google Maps</a>
            <a href={C.appleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Open in Apple Maps</a>
          </div>
        </div>

        {/* Contact form */}
        <div className="form-card">
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, marginBottom: 16 }}>Contact Us</h3>
          {sent ? (
            <p style={{ color: C.accentColor, fontSize: 14 }}>Thanks — we received your message and will reach out soon.</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={4} value={form.message} onChange={e => set('message', e.target.value)} placeholder="How can we help?" />
              </div>
              <button type="submit" className="submit-btn" disabled={submitting} style={{ background: C.accentColor }}>
                {submitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .loc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
