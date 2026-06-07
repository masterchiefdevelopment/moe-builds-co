import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut, getProfile } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { RESTAURANT_CONFIG as C } from '../../pages/restaurant/config'
import toast from 'react-hot-toast'

const LINKS = [
  { label: 'Home',     to: '/restaurant' },
  { label: 'Menu',     to: '/restaurant/menu' },
  { label: 'Order',    to: '/restaurant/order' },
  { label: 'Gallery',  to: '/restaurant/gallery' },
  { label: 'Visit',    to: '/restaurant/location' },
]

export default function RestaurantNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, clearAuth, setProfile } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (user && !profile) getProfile(user.id).then(({ data }) => { if (data) setProfile(data) })
    if (!user && profile) setProfile(null)
  }, [user])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isActive = (to) =>
    to === '/restaurant' ? location.pathname === '/restaurant' : location.pathname.startsWith(to)

  const handleSignOut = async () => {
    setLeaving(true)
    await signOut()
    clearAuth()
    toast.success('Signed out')
    navigate('/restaurant')
    setLeaving(false)
  }

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #1f1f1f' : '1px solid transparent',
        transition: 'border-color 0.3s',
      }}>
        <Link to="/restaurant" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{
            width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: C.primaryColor, color: C.accentColor, fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 16, letterSpacing: 1, border: `1px solid ${C.accentColor}`,
          }}>{C.logoText}</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3, color: C.accentColor }}>
            {C.name.toUpperCase()}
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '4px' }} className="rg-desk">
          {LINKS.map(({ label, to }) => (
            <Link key={to} to={to} style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 1.5,
              textTransform: 'uppercase', textDecoration: 'none', padding: '8px 12px', borderRadius: 4,
              color: isActive(to) ? C.accentColor : '#888', transition: 'color 0.2s',
            }}
              onMouseEnter={e => { if (!isActive(to)) e.target.style.color = '#F5F5F5' }}
              onMouseLeave={e => { if (!isActive(to)) e.target.style.color = '#888' }}
            >{label}</Link>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="rg-desk">
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link to="/restaurant/admin" style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 1,
                  textTransform: 'uppercase', textDecoration: 'none', color: '#888',
                  padding: '8px 12px', border: '1px solid #2a2a2a', borderRadius: 4,
                }}>Admin</Link>
              )}
              <Link to="/restaurant/profile" style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 1,
                textTransform: 'uppercase', textDecoration: 'none', color: C.accentColor,
                padding: '8px 14px', border: `1px solid ${C.accentColor}55`, borderRadius: 4,
              }}>◆ Profile</Link>
              <button onClick={handleSignOut} disabled={leaving} style={{
                background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 4,
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 2,
                textTransform: 'uppercase', color: '#555', padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#F5F5F5'; e.currentTarget.style.borderColor = '#444' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#2a2a2a' }}
              >{leaving ? '...' : 'Sign Out'}</button>
            </>
          ) : (
            <>
              <Link to="/restaurant/login" style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 1.5,
                textTransform: 'uppercase', textDecoration: 'none', color: '#888', padding: '8px 12px',
              }}>Sign In</Link>
              <Link to="/restaurant/register" style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase', textDecoration: 'none', color: '#0A0A0A', background: C.accentColor,
                padding: '9px 20px', borderRadius: 4, transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >Join</Link>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen(o => !o)} className="rg-mob" aria-label="Toggle menu" style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5,
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 1.5, background: C.accentColor, transition: 'all 0.3s', transformOrigin: 'center',
              transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)' : i === 2 ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none') : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </header>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        }} />
      )}

      <nav style={{
        position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99, background: '#111',
        borderBottom: '1px solid #1f1f1f', padding: 20, transform: menuOpen ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {LINKS.map(({ label, to }) => (
          <Link key={to} to={to} style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 3, textDecoration: 'none',
            color: isActive(to) ? C.accentColor : '#F5F5F5', padding: '10px 0', borderBottom: '1px solid #1a1a1a',
          }}>{label}</Link>
        ))}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link to="/restaurant/admin" style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 2, textTransform: 'uppercase',
                  textDecoration: 'none', color: '#888', padding: '12px 16px', border: '1px solid #222', borderRadius: 4, textAlign: 'center',
                }}>Admin Dashboard</Link>
              )}
              <Link to="/restaurant/profile" style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 2, textTransform: 'uppercase',
                textDecoration: 'none', color: C.accentColor, padding: '12px 16px', border: `1px solid ${C.accentColor}55`, borderRadius: 4, textAlign: 'center',
              }}>◆ My Profile</Link>
              <button onClick={handleSignOut} disabled={leaving} style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
                background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 4, color: '#666', padding: 12, cursor: 'pointer', width: '100%',
              }}>{leaving ? 'Signing out...' : 'Sign Out'}</button>
            </>
          ) : (
            <>
              <Link to="/restaurant/login" style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 2, textTransform: 'uppercase',
                textDecoration: 'none', color: '#888', padding: '12px 16px', border: '1px solid #222', borderRadius: 4, textAlign: 'center',
              }}>Sign In</Link>
              <Link to="/restaurant/register" style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
                textDecoration: 'none', color: '#0A0A0A', background: C.accentColor, padding: '12px 16px', borderRadius: 4, textAlign: 'center',
              }}>Create Account</Link>
            </>
          )}
        </div>
      </nav>

      <style>{`
        .rg-desk { display: flex !important; }
        .rg-mob  { display: none  !important; }
        @media (max-width: 768px) {
          .rg-desk { display: none !important; }
          .rg-mob  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
