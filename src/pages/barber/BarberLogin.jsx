import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { SHOP_CONFIG as C } from './config'
import toast from 'react-hot-toast'

export default function BarberLogin() {
  const navigate = useNavigate()
  const { setUser, setSession } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError('Please fill in all fields')
    setLoading(true)
    const { data, error: err } = await signIn(form)
    if (err) { setError(err.message || 'Invalid email or password'); setLoading(false); return }
    setSession(data.session)
    setUser(data.user)
    toast.success('Welcome back!')
    navigate('/barber/profile')
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', background: C.bgPrimary }}>
      <div style={{ background: C.bgSecondary, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: 'clamp(28px, 5vw, 44px)', width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: C.accentColor, marginBottom: 4 }}>{C.name}</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#fff' }}>Sign In</div>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, padding: '12px 16px', marginBottom: 18, fontSize: 13, color: '#f87171' }}>{error}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <input className="brb-auth-input" type="email" placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} onKeyDown={handleKey} />
          <input className="brb-auth-input" type="password" placeholder="Password" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={handleKey} />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="brb-auth-submit">
          {loading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: C.textSecondary }}>
          No account? <Link to="/barber/register" style={{ color: C.accentColor, textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </div>

        <style>{`
          .brb-auth-input {
            background: #0f0f0f; color: ${C.textPrimary}; border: 1px solid ${C.borderSubtle};
            border-radius: 8px; padding: 12px 14px; font-size: 14px; outline: none; width: 100%;
            font-family: 'Inter', sans-serif; color-scheme: dark; transition: border-color 0.2s;
          }
          .brb-auth-input:focus { border-color: ${C.accentColor}; }
          .brb-auth-submit {
            width: 100%; background: ${C.accentColor}; color: #0a0a0a; border: none; border-radius: 8px;
            font-family: 'Inter', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 1px;
            padding: 14px; cursor: pointer; transition: filter 0.2s, transform 0.2s;
          }
          .brb-auth-submit:hover { filter: brightness(1.1); transform: scale(1.01); }
          .brb-auth-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        `}</style>
      </div>
    </div>
  )
}
