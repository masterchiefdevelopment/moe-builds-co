import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, supabase } from '../../lib/supabase'
import { RESTAURANT_CONFIG as C } from './config'
import toast from 'react-hot-toast'

export default function RestaurantRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) return setError('Please fill in all fields')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')

    setLoading(true)
    const { data, error: err } = await signUp(form)
    if (err) {
      setError(err.message || 'Could not create account')
      setLoading(false)
      return
    }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, role: 'customer', loyalty_count: 0 })
    }
    toast.success('Account created — welcome!')
    navigate('/restaurant/profile')
    setLoading(false)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4, color: C.accentColor, marginBottom: 4 }}>
            {C.name.toUpperCase()}
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 3 }}>CREATE ACCOUNT</div>
          <p style={{ color: '#555', fontSize: 13, marginTop: 6 }}>Join for order history and loyalty rewards.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#ef4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Jane Doe" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="At least 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading} style={{ background: C.accentColor }}>
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#555' }}>
          Already have an account? <Link to="/restaurant/login" style={{ color: C.accentColor, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
