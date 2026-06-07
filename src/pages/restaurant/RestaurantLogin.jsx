import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { RESTAURANT_CONFIG as C } from './config'
import toast from 'react-hot-toast'

export default function RestaurantLogin() {
  const navigate = useNavigate()
  const { setUser, setSession } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return setError('Please fill in all fields')
    setLoading(true)
    const { data, error: err } = await signIn(form)
    if (err) {
      setError(err.message || 'Invalid email or password')
      setLoading(false)
      return
    }
    setSession(data.session)
    setUser(data.user)
    toast.success('Welcome back!')
    navigate('/restaurant/profile')
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4, color: C.accentColor, marginBottom: 4 }}>
            {C.name.toUpperCase()}
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 3 }}>SIGN IN</div>
          <p style={{ color: '#555', fontSize: 13, marginTop: 6 }}>Order ahead, earn rewards, track your history.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#ef4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading} style={{ background: C.accentColor }}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#555' }}>
          No account? <Link to="/restaurant/register" style={{ color: C.accentColor, textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </div>
      </div>
    </div>
  )
}
