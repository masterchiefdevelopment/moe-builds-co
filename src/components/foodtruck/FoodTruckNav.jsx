// src/components/foodtruck/FoodTruckNav.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const LINKS = [
  { label: 'Home',     to: '/foodtruck' },
  { label: 'Menu',     to: '/foodtruck/menu' },
  { label: 'Order',    to: '/foodtruck/order' },
  { label: 'Location', to: '/foodtruck/location' },
]

export default function FoodTruckNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [leaving,   setLeaving]   = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isActive = (to) =>
    to === '/foodtruck'
      ? location.pathname === '/foodtruck'
      : location.pathname.startsWith(to)

  const handleSignOut = async () => {
    setLeaving(true)
    await signOut()
    clearAuth()
    toast.success('Signed out')
    navigate('/foodtruck')
    setLeaving(false)
  }

  return (
    <>
      <header style={{
        position:        'fixed',
        top:             0, left: 0, right: 0,
        zIndex:          100,
        height:          '64px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         '0 20px',
        background:      'rgba(10,10,10,0.97)',
        backdropFilter:  'blur(12px)',
        borderBottom:    scrolled ? '1px solid #1f1f1f' : '1px solid transparent',
        transition:      'border-color 0.3s',
      }}>

        {/* Logo */}
        <Link to="/foodtruck" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       '20px',
            letterSpacing:  '3px',
            color:          '#FF6B2B',
          }}>
            MOE'S
          </span>
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '10px',
            letterSpacing:  '2px',
            textTransform:  'uppercase',
            color:          '#444',
          }}>
            Food Truck
          </span>
        </Link>

        {/* Desktop links */}
        <nav style={{ display: 'flex', gap: '4px' }} className="ft-desk">
          {LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '13px',
                letterSpacing:  '1.5px',
                textTransform:  'uppercase',
                textDecoration: 'none',
                padding:        '8px 12px',
                borderRadius:   '4px',
                color:          isActive(to) ? '#FF6B2B' : '#888',
                transition:     'color 0.2s',
              }}
              onMouseEnter={e => { if (!isActive(to)) e.target.style.color = '#F5F5F5' }}
              onMouseLeave={e => { if (!isActive(to)) e.target.style.color = '#888' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="ft-desk">
          {user ? (
            <>
              <Link to="/foodtruck/profile" style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '13px',
                letterSpacing:  '1px',
                textTransform:  'uppercase',
                textDecoration: 'none',
                color:          '#FF6B2B',
                padding:        '8px 14px',
                border:         '1px solid rgba(255,107,43,0.3)',
                borderRadius:   '4px',
              }}>
                ◆ Profile
              </Link>
              <button
                onClick={handleSignOut}
                disabled={leaving}
                style={{
                  background:    'transparent',
                  border:        '1px solid #2a2a2a',
                  borderRadius:  '4px',
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '13px',
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  color:          '#555',
                  padding:        '8px 16px',
                  cursor:         'pointer',
                  transition:     'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#F5F5F5'; e.currentTarget.style.borderColor = '#444' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#2a2a2a' }}
              >
                {leaving ? '...' : 'Sign Out'}
              </button>
            </>
          ) : (
            <>
              <Link to="/foodtruck/login" style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '13px',
                letterSpacing:  '1.5px',
                textTransform:  'uppercase',
                textDecoration: 'none',
                color:          '#888',
                padding:        '8px 12px',
                transition:     'color 0.2s',
              }}>
                Sign In
              </Link>
              <Link to="/foodtruck/register" style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '13px',
                fontWeight:     700,
                letterSpacing:  '2px',
                textTransform:  'uppercase',
                textDecoration: 'none',
                color:          '#0A0A0A',
                background:     '#FF6B2B',
                padding:        '9px 20px',
                borderRadius:   '4px',
                transition:     'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#ff7d42'}
                onMouseLeave={e => e.currentTarget.style.background = '#FF6B2B'}
              >
                Join
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="ft-mob"
          aria-label="Toggle menu"
          style={{
            background:    'none',
            border:        'none',
            cursor:        'pointer',
            padding:       '8px',
            display:       'flex',
            flexDirection: 'column',
            gap:           '5px',
          }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display:         'block',
              width:           '22px',
              height:          '1.5px',
              background:      '#FF6B2B',
              transition:      'all 0.3s',
              transformOrigin: 'center',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)'
                : i === 2 ? 'rotate(-45deg) translate(4.5px, -4.5px)'
                : 'none'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         98,
            background:     'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Mobile drawer */}
      <nav style={{
        position:       'fixed',
        top:            '64px',
        left:           0,
        right:          0,
        zIndex:         99,
        background:     '#111',
        borderBottom:   '1px solid #1f1f1f',
        padding:        '20px',
        transform:      menuOpen ? 'translateY(0)' : 'translateY(-110%)',
        transition:     'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display:        'flex',
        flexDirection:  'column',
        gap:            '4px',
      }}>
        {LINKS.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:       '30px',
              letterSpacing:  '3px',
              textDecoration: 'none',
              color:          isActive(to) ? '#FF6B2B' : '#F5F5F5',
              padding:        '10px 0',
              borderBottom:   '1px solid #1a1a1a',
              transition:     'color 0.2s',
            }}
          >
            {label}
          </Link>
        ))}

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {user ? (
            <>
              <Link to="/foodtruck/profile" style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '14px',
                letterSpacing:  '2px',
                textTransform:  'uppercase',
                textDecoration: 'none',
                color:          '#FF6B2B',
                padding:        '12px 16px',
                border:         '1px solid rgba(255,107,43,0.3)',
                borderRadius:   '4px',
                textAlign:      'center',
              }}>
                ◆ My Profile
              </Link>
              <button
                onClick={handleSignOut}
                disabled={leaving}
                style={{
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '13px',
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  background:     'transparent',
                  border:         '1px solid #2a2a2a',
                  borderRadius:   '4px',
                  color:          '#666',
                  padding:        '12px',
                  cursor:         'pointer',
                  width:          '100%',
                }}
              >
                {leaving ? 'Signing out...' : 'Sign Out'}
              </button>
            </>
          ) : (
            <>
              <Link to="/foodtruck/login" style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '14px',
                letterSpacing:  '2px',
                textTransform:  'uppercase',
                textDecoration: 'none',
                color:          '#888',
                padding:        '12px 16px',
                border:         '1px solid #222',
                borderRadius:   '4px',
                textAlign:      'center',
              }}>
                Sign In
              </Link>
              <Link to="/foodtruck/register" style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '14px',
                fontWeight:     700,
                letterSpacing:  '2px',
                textTransform:  'uppercase',
                textDecoration: 'none',
                color:          '#0A0A0A',
                background:     '#FF6B2B',
                padding:        '12px 16px',
                borderRadius:   '4px',
                textAlign:      'center',
              }}>
                Create Account
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Responsive rules */}
      <style>{`
        .ft-desk { display: flex !important; }
        .ft-mob  { display: none  !important; }
        @media (max-width: 768px) {
          .ft-desk { display: none  !important; }
          .ft-mob  { display: flex  !important; }
        }
      `}</style>
    </>
  )
}