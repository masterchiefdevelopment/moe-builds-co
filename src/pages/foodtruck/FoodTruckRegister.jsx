// src/pages/foodtruck/FoodTruckRegister.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function FoodTruckRegister() {
  const navigate                = useNavigate()
  const { setUser, setSession } = useAuthStore()
  const [form,    setForm]      = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [loading, setLoading]   = useState(false)
  const [errors,  setErrors]    = useState({})

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

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
    const { data, error: err } = await signUp({
      email:    form.email,
      password: form.password,
      fullName: form.fullName,
    })
    if (err) {
      setErrors({ email: err.message })
      setLoading(false)
      return
    }
    if (data?.session) {
      setSession(data.session)
      setUser(data.user)
      toast.success('Account created! Welcome to the crew.')
      navigate('/foodtruck/profile')
    } else {
      toast.success('Check your email to confirm your account.')
      navigate('/foodtruck/login')
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  const inputStyle = (errKey) => ({
    background:   '#0d0d0d',
    color:        '#F5F5F5',
    border:       '1px solid ' + (errors[errKey] ? '#ef4444' : '#222'),
    borderRadius: '6px',
    padding:      '12px 14px',
    fontSize:      '14px',
    outline:      'none',
    width:        '100%',
    fontFamily:   'inherit',
    colorScheme:  'dark',
    transition:   'border-color 0.2s',
  })

  const labelStyle = {
    fontFamily:    "'Barlow Condensed', sans-serif",
    fontSize:       '11px',
    letterSpacing:  '2px',
    textTransform:  'uppercase',
    color:          '#777',
  }

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '80px 20px',
    }}>
      <div
        className="fade-in"
        style={{
          background:   '#161616',
          border:       '1px solid #222',
          borderRadius: '12px',
          padding:      'clamp(28px, 5vw, 44px)',
          width:        '100%',
          maxWidth:     '440px',
        }}
      >

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       '22px',
            letterSpacing:  '4px',
            color:          '#FF6B2B',
            marginBottom:   '4px',
          }}>
            🔥 MOE'S FOOD TRUCK
          </div>
          <div style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       '36px',
            letterSpacing:  '3px',
            lineHeight:     1,
            marginBottom:   '8px',
          }}>
            JOIN THE CREW
          </div>
          <p style={{ color: '#555', fontSize: '13px' }}>
            Create an account and start earning free food.
          </p>
        </div>

        {/* Perks strip */}
        <div style={{
          display:      'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:          '8px',
          marginBottom: '28px',
        }}>
          {[
            { icon: '📱', text: 'Order ahead'       },
            { icon: '⭐', text: 'Earn free meals'    },
            { icon: '📍', text: 'Live location'      },
            { icon: '🔔', text: 'Weekly specials'    },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{
                background:   'rgba(255,107,43,0.05)',
                border:       '1px solid rgba(255,107,43,0.12)',
                borderRadius: '6px',
                padding:      '10px 12px',
                display:      'flex',
                alignItems:   'center',
                gap:          '8px',
                fontSize:      '12px',
                color:         '#666',
              }}
            >
              <span style={{ fontSize: '14px' }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>

          {/* Full name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              placeholder="First Last"
              value={form.fullName}
              onChange={e => set('fullName', e.target.value)}
              onKeyDown={handleKey}
              style={inputStyle('fullName')}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,107,43,0.5)' }}
              onBlur={e  => { e.target.style.borderColor = errors.fullName ? '#ef4444' : '#222' }}
            />
            {errors.fullName && (
              <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.fullName}</span>
            )}
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onKeyDown={handleKey}
              style={inputStyle('email')}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,107,43,0.5)' }}
              onBlur={e  => { e.target.style.borderColor = errors.email ? '#ef4444' : '#222' }}
            />
            {errors.email && (
              <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Password *</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              onKeyDown={handleKey}
              style={inputStyle('password')}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,107,43,0.5)' }}
              onBlur={e  => { e.target.style.borderColor = errors.password ? '#ef4444' : '#222' }}
            />
            {errors.password && (
              <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.password}</span>
            )}
          </div>

          {/* Confirm */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Confirm Password *</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={form.confirm}
              onChange={e => set('confirm', e.target.value)}
              onKeyDown={handleKey}
              style={inputStyle('confirm')}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,107,43,0.5)' }}
              onBlur={e  => { e.target.style.borderColor = errors.confirm ? '#ef4444' : '#222' }}
            />
            {errors.confirm && (
              <span style={{ fontSize: '11px', color: '#ef4444' }}>{errors.confirm}</span>
            )}
          </div>

        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width:        '100%',
            background:   '#FF6B2B',
            color:        '#0A0A0A',
            border:       'none',
            borderRadius: '6px',
            fontFamily:   "'Bebas Neue', sans-serif",
            fontSize:      '22px',
            letterSpacing: '3px',
            padding:       '14px',
            cursor:        loading ? 'not-allowed' : 'pointer',
            opacity:       loading ? 0.6 : 1,
            transition:    'background 0.2s',
            boxShadow:     '0 0 20px rgba(255,107,43,0.15)',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ff7d42' }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#FF6B2B' }}
        >
          {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </button>

        {/* Fine print */}
        <p style={{
          textAlign:  'center',
          marginTop:  '12px',
          fontSize:    '11px',
          color:       '#333',
          lineHeight:  1.5,
        }}>
          By creating an account you agree to our terms and privacy policy.
        </p>

        {/* Login link */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#555' }}>
          Already have an account?{' '}
          <Link
            to="/foodtruck/login"
            style={{ color: '#FF6B2B', textDecoration: 'none', fontWeight: 600 }}
          >
            Sign in
          </Link>
        </div>

        {/* Demo note */}
        <div style={{
          marginTop:    '24px',
          padding:      '12px 14px',
          background:   '#111',
          border:       '1px solid #1f1f1f',
          borderRadius: '6px',
          fontSize:      '11px',
          color:         '#333',
          lineHeight:    1.5,
        }}>
          <span style={{
            color:         '#444',
            fontFamily:    "'Barlow Condensed', sans-serif",
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            Demo Mode
          </span>
          {' — '}
          Connect Supabase to enable real auth.
        </div>

      </div>
    </div>
  )
}