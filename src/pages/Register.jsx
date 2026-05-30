import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const { setUser, setSession } = useAuthStore()
  const [form,    setForm]    = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.fullName)                 e.fullName = 'Required'
    if (!form.email)                    e.email    = 'Required'
    if (form.password.length < 6)       e.password = 'Min 6 characters'
    if (form.password !== form.confirm) e.confirm  = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const { data, error: err } = await signUp({ email: form.email, password: form.password, fullName: form.fullName })
    if (err) { setErrors({ email: err.message }); setLoading(false); return }
    if (data?.session) {
      setSession(data.session)
      setUser(data.user)
      toast.success('Account created! Welcome.')
      navigate('/profile')
    } else {
      toast.success('Check your email to confirm your account.')
      navigate('/login')
    }
  }

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} placeholder={placeholder}
        value={form[name]} onChange={e => set(name, e.target.value)} />
      {errors[name] && <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors[name]}</span>}
    </div>
  )

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', letterSpacing: '4px', color: '#D4AF37' }}>✦ PREMIER ✦</div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '36px', letterSpacing: '3px', marginTop: '4px' }}>CREATE ACCOUNT</div>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '6px' }}>Join the Playmakers loyalty program</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <Field label="Full Name *"        name="fullName" placeholder="First Last" />
          <Field label="Email *"            name="email"    type="email"    placeholder="you@email.com" />
          <Field label="Password *"         name="password" type="password" placeholder="Min 6 characters" />
          <Field label="Confirm Password *" name="confirm"  type="password" placeholder="Re-enter password" />
        </div>

        <div style={{
          background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '6px', padding: '14px 16px', marginBottom: '20px',
          display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
          {['Track your booking history', 'Earn loyalty points every visit', '10 cuts = free lineup', 'Save favorite barbers'].map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}>
              <span style={{ color: '#D4AF37', fontSize: '10px' }}>✦</span> {p}
            </div>
          ))}
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#555' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
