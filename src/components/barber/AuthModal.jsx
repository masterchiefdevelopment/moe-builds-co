import { useEffect, useState } from 'react'
import { signIn, signUp, supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { SHOP_CONFIG as C } from '../../pages/barber/config'
import toast from 'react-hot-toast'

export default function AuthModal({ open, onClose }) {
  const { setUser, setSession } = useAuthStore()
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  useEffect(() => { if (open) { setError(''); setForm({ fullName: '', email: '', password: '' }) } }, [open, mode])

  if (!open) return null

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password || (mode === 'signup' && !form.fullName)) return setError('Please fill in all fields')
    setLoading(true)
    if (mode === 'signin') {
      const { data, error: err } = await signIn(form)
      if (err) { setError(err.message || 'Invalid email or password'); setLoading(false); return }
      setSession(data.session); setUser(data.user)
      toast.success('Welcome back!')
    } else {
      const { data, error: err } = await signUp(form)
      if (err) { setError(err.message || 'Could not create account'); setLoading(false); return }
      if (data.user) await supabase.from('profiles').insert({ id: data.user.id, role: 'customer', loyalty_count: 0 })
      toast.success('Account created — welcome!')
    }
    setLoading(false)
    onClose()
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 220, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.bgSecondary, border: `1px solid ${C.borderSubtle}`, borderRadius: 16,
        padding: '36px 32px', width: '100%', maxWidth: 400, position: 'relative',
      }}>
        <button type="button" onClick={onClose} aria-label="Close" style={{
          position: 'absolute', top: 16, right: 16, background: 'transparent', border: `1px solid ${C.borderSubtle}`,
          color: C.textPrimary, borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
        }}>✕</button>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#fff', marginBottom: 4 }}>
          {mode === 'signin' ? 'Welcome Back' : 'Join Us'}
        </h2>
        <p style={{ color: C.textSecondary, fontSize: 13, marginBottom: 22 }}>
          {mode === 'signin' ? 'Sign in to manage your bookings and punch card.' : 'Earn a free cut every 10 visits.'}
        </p>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#f87171' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <input className="brb-input" placeholder="Full name" value={form.fullName} onChange={e => set('fullName', e.target.value)} style={{ marginTop: 0 }} />
          )}
          <input className="brb-input" type="email" placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} style={{ marginTop: 0 }} />
          <input className="brb-input" type="password" placeholder="Password" value={form.password} onChange={e => set('password', e.target.value)} style={{ marginTop: 0 }} />
          <button type="submit" disabled={loading} className="brb-btn-gold" style={{ marginTop: 4 }}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: C.textSecondary }}>
          {mode === 'signin' ? (
            <>No account? <button type="button" onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: C.accentColor, fontWeight: 600, cursor: 'pointer', padding: 0 }}>Create one</button></>
          ) : (
            <>Already have an account? <button type="button" onClick={() => setMode('signin')} style={{ background: 'none', border: 'none', color: C.accentColor, fontWeight: 600, cursor: 'pointer', padding: 0 }}>Sign in</button></>
          )}
        </div>

        <style>{`
          .brb-input {
            width: 100%; background: #0f0f0f; color: ${C.textPrimary}; border: 1px solid ${C.borderSubtle};
            border-radius: 8px; padding: 11px 14px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none;
            color-scheme: dark; transition: border-color 0.2s;
          }
          .brb-input:focus { border-color: ${C.accentColor}; }
          .brb-btn-gold {
            display: inline-block; background: ${C.accentColor}; color: #0a0a0a; border: none; border-radius: 8px;
            font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1px;
            padding: 13px 28px; cursor: pointer; transition: transform 0.2s, filter 0.2s;
          }
          .brb-btn-gold:hover { transform: scale(1.03); filter: brightness(1.1); }
        `}</style>
      </div>
    </div>
  )
}
