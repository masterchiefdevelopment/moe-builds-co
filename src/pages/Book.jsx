import { useState } from 'react'

const BARBERS  = ['Any Available', 'Marcus', 'Jordan', 'Devon', 'Xavier']
const SERVICES = ['Skin Fade — $30', 'Full Haircut — $25', 'Lineup / Edge Up — $15', 'Beard Trim — $15', 'Cut + Beard — $40', "Kid's Cut — $20", 'Hot Towel Shave — $25']
const TIMES    = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM']

const empty = { name: '', phone: '', email: '', barber: '', service: '', date: '', time: '', notes: '' }

export default function Book() {
  const [form,    setForm]    = useState(empty)
  const [loading, setLoading] = useState(false)
  const [booked,  setBooked]  = useState(false)
  const [errors,  setErrors]  = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name)    e.name    = 'Required'
    if (!form.service) e.service = 'Required'
    if (!form.date)    e.date    = 'Required'
    if (!form.time)    e.time    = 'Select a time'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setBooked(true)
  }

  if (booked) return (
    <div className="page" style={{ maxWidth: '600px', paddingTop: '100px' }}>
      <div className="success-box fade-in">
        <div style={{ fontSize: '52px', marginBottom: '20px' }}>✂️</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '42px', letterSpacing: '4px', color: '#D4AF37', marginBottom: '8px' }}>YOU'RE BOOKED</div>
        <p style={{ color: '#777', marginBottom: '4px' }}>{form.name} · {form.service.split(' —')[0]}</p>
        <p style={{ fontFamily: "'Bebas Neue'", fontSize: '24px', letterSpacing: '2px', color: '#F5F5F5', margin: '12px 0' }}>
          {form.date} at {form.time}
        </p>
        {form.barber && form.barber !== 'Any Available' && (
          <p style={{ color: '#666', fontSize: '14px' }}>with {form.barber}</p>
        )}
        <button className="btn-outline" style={{ marginTop: '28px' }} onClick={() => { setBooked(false); setForm(empty) }}>
          Book Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="page" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '40px' }}>
        <div className="sec-label" style={{ justifyContent: 'flex-start' }}>Appointment</div>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(40px, 8vw, 64px)', letterSpacing: '3px', lineHeight: 1 }}>BOOK NOW</h1>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>Walk-ins always welcome. Online booking available 24/7.</p>
      </div>

      <div className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="First Last" value={form.name} onChange={e => set('name', e.target.value)} />
            {errors.name && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" placeholder="(210) 555-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div className="form-group full">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group full">
            <label className="form-label">Barber (Optional)</label>
            <select className="form-select" value={form.barber} onChange={e => set('barber', e.target.value)}>
              {BARBERS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label className="form-label">Service *</label>
            <select className="form-select" value={form.service} onChange={e => set('service', e.target.value)}>
              <option value="">Select a service</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.service && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.service}</span>}
          </div>
          <div className="form-group full">
            <label className="form-label">Date *</label>
            <input className="form-input" type="date" value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => set('date', e.target.value)} />
            {errors.date && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.date}</span>}
          </div>
          <div className="form-group full">
            <label className="form-label">Time *</label>
            <div className="time-grid">
              {TIMES.map(t => (
                <button key={t} className={`time-btn${form.time === t ? ' selected' : ''}`} onClick={() => set('time', t)}>{t}</button>
              ))}
            </div>
            {errors.time && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.time}</span>}
          </div>
          <div className="form-group full">
            <label className="form-label">Notes (Optional)</label>
            <textarea className="form-input" placeholder="Anything your barber should know..." rows={3}
              value={form.notes} onChange={e => set('notes', e.target.value)}
              style={{ resize: 'vertical', minHeight: '80px' }} />
          </div>
        </div>
        <button className="submit-btn" onClick={submit} disabled={loading}>
          {loading ? 'BOOKING...' : 'CONFIRM BOOKING'}
        </button>
      </div>
    </div>
  )
}
