import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setSession } = useAuthStore()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    setLoading(true)
    const { data, error: err } = await signIn(form)
    if (err) { setError(err.message || 'Invalid email or password'); setLoading(false); return }
    setSession(data.session)
    setUser(data.user)
    toast.success('Welcome back!')
    navigate('/profile')
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', letterSpacing: '4px', color: '#D4AF37' }}>✦ PREMIER ✦</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '36px', letterSpacing: '3px', marginTop: '4px' }}>SIGN IN</div>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '6px' }}>Welcome back to Premier Barbershop</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '6px', padding: '12px 16px', marginBottom: '20px',
            fontSize: '13px', color: '#ef4444',
          }}>{error}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@email.com"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#555' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </div>
      </div>
    </div>
  )
}
