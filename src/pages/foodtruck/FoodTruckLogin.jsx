// src/pages/foodtruck/FoodTruckLogin.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function FoodTruckLogin() {
  const navigate              = useNavigate()
  const { setUser, setSession } = useAuthStore()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setError('')
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
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
    navigate('/foodtruck/profile')
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

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
          maxWidth:     '420px',
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
            SIGN IN
          </div>
          <p style={{ color: '#555', fontSize: '13px' }}>
            Track orders, earn rewards, skip the line.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:   'rgba(239,68,68,0.08)',
            border:       '1px solid rgba(239,68,68,0.25)',
            borderRadius: '6px',
            padding:      '12px 16px',
            marginBottom: '20px',
            fontSize:      '13px',
            color:         '#ef4444',
          }}>
            {error}
          </div>
        )}

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '11px',
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              color:          '#777',
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onKeyDown={handleKey}
              style={{
                background:   '#0d0d0d',
                color:        '#F5F5F5',
                border:       '1px solid #222',
                borderRadius: '6px',
                padding:      '12px 14px',
                fontSize:      '14px',
                outline:      'none',
                width:        '100%',
                fontFamily:   'inherit',
                colorScheme:  'dark',
                transition:   'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,107,43,0.5)' }}
              onBlur={e  => { e.target.style.borderColor = '#222' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '11px',
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              color:          '#777',
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              onKeyDown={handleKey}
              style={{
                background:   '#0d0d0d',
                color:        '#F5F5F5',
                border:       '1px solid #222',
                borderRadius: '6px',
                padding:      '12px 14px',
                fontSize:      '14px',
                outline:      'none',
                width:        '100%',
                fontFamily:   'inherit',
                colorScheme:  'dark',
                transition:   'border-color 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,107,43,0.5)' }}
              onBlur={e  => { e.target.style.borderColor = '#222' }}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width:         '100%',
            background:    '#FF6B2B',
            color:         '#0A0A0A',
            border:        'none',
            borderRadius:  '6px',
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       '22px',
            letterSpacing:  '3px',
            padding:        '14px',
            cursor:         loading ? 'not-allowed' : 'pointer',
            opacity:        loading ? 0.6 : 1,
            transition:     'background 0.2s',
            boxShadow:      '0 0 20px rgba(255,107,43,0.15)',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ff7d42' }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#FF6B2B' }}
        >
          {loading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>

        {/* Register link */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#555' }}>
          No account?{' '}
          <Link
            to="/foodtruck/register"
            style={{ color: '#FF6B2B', textDecoration: 'none', fontWeight: 600 }}
          >
            Create one
          </Link>
        </div>

        {/* Perks reminder */}
        <div style={{
          marginTop:    '28px',
          background:   'rgba(255,107,43,0.05)',
          border:       '1px solid rgba(255,107,43,0.15)',
          borderRadius: '8px',
          padding:      '16px',
          display:      'flex',
          flexDirection:'column',
          gap:          '8px',
        }}>
          <div style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '11px',
            letterSpacing:  '2px',
            textTransform:  'uppercase',
            color:          '#FF6B2B',
            marginBottom:   '4px',
          }}>
            Member Perks
          </div>
          {[
            'Order ahead and skip the line',
            'Track every order in one place',
            '10 orders earns a free meal',
            'Early access to weekly specials',
          ].map(perk => (
            <div
              key={perk}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '8px',
                fontSize:    '12px',
                color:       '#666',
              }}
            >
              <span style={{ color: '#FF6B2B', fontSize: '10px', flexShrink: 0 }}>✦</span>
              {perk}
            </div>
          ))}
        </div>

        {/* Demo note */}
        <div style={{
          marginTop:    '20px',
          padding:      '12px 14px',
          background:   '#111',
          border:       '1px solid #1f1f1f',
          borderRadius: '6px',
          fontSize:      '11px',
          color:         '#333',
          lineHeight:    1.5,
        }}>
          <span style={{ color: '#444', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '1px', textTransform: 'uppercase' }}>
            Demo Mode
          </span>
          {' — '}
          Connect Supabase to enable real auth.
        </div>

      </div>
    </div>
  )
}