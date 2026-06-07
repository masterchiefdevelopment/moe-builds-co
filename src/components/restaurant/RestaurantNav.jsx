import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut, getProfile } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { RESTAURANT_CONFIG as C } from '../../pages/restaurant/config'
import toast from 'react-hot-toast'

const LINKS = [
  { label: 'Home', to: '/restaurant#home' },
  { label: 'Menu', to: '/restaurant#menu' },
  { label: 'Order', to: '/restaurant#order' },
  { label: 'Gallery', to: '/restaurant#gallery' },
  { label: 'Visit', to: '/restaurant#visit' },
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

  useEffect(() => { setMenuOpen(false) }, [location.pathname, location.hash])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isActive = (to) => {
    const hash = to.slice(to.indexOf('#'))
    return location.pathname === '/restaurant' && (location.hash || '#home') === hash
  }

  const handleSignOut = async () => {
    setLeaving(true)
    await signOut()
    clearAuth()
    toast.success('Signed out')
    navigate('/restaurant')
    setLeaving(false)
  }

  const linkColor = (to) => isActive(to) ? C.accentColor : '#fff'

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        background: scrolled ? 'rgba(15,15,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.borderSubtle}` : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <Link to="/restaurant#home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{
            width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: C.accentRed, color: '#fff', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15,
          }}>{C.logoText}</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
            {C.name}
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '4px' }} className="rg-nav-desk">
          {LINKS.map(({ label, to }) => (
            <Link key={to} to={to} className="rg-nav-link" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase',
              textDecoration: 'none', padding: '8px 14px', color: linkColor(to), position: 'relative',
            }}>
              {label}
              <span style={{
                position: 'absolute', left: 14, right: 14, bottom: 2, height: 2, borderRadius: 1,
                background: C.accentColor, transform: isActive(to) ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s', transformOrigin: 'left',
              }} />
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="rg-nav-desk">
          {user ? (
            <>
              <Link to="/restaurant/profile" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#fff', padding: '8px 12px',
              }}>Profile</Link>
              <button type="button" onClick={handleSignOut} disabled={leaving} style={{
                background: 'transparent', border: `1px solid ${C.borderSubtle}`, borderRadius: 100,
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, color: '#aaa',
                padding: '9px 18px', cursor: 'pointer', transition: 'all 0.2s',
              }}>{leaving ? '...' : 'Sign Out'}</button>
            </>
          ) : (
            <>
              <Link to="/restaurant/login" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#fff', padding: '8px 12px',
              }}>Sign In</Link>
              <Link to="/restaurant/register" className="rg-join-btn" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1,
                textTransform: 'uppercase', textDecoration: 'none', color: '#0A0A0A', background: C.accentColor,
                padding: '10px 22px', borderRadius: 100, transition: 'transform 0.2s, filter 0.2s',
              }}>Join</Link>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen(o => !o)} className="rg-nav-mob" aria-label="Toggle menu" style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5, zIndex: 101,
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 2, borderRadius: 1, background: '#fff', transition: 'all 0.3s', transformOrigin: 'center',
              transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'none') : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </header>

      {/* Mobile slide-in from right */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }} />
      )}
      <nav style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 99, width: 'min(82vw, 340px)',
        background: C.bgSecondary, borderLeft: `1px solid ${C.borderSubtle}`, padding: '90px 28px 28px',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {LINKS.map(({ label, to }) => (
          <Link key={to} to={to} style={{
            fontFamily: "'Playfair Display', serif", fontSize: 26, textDecoration: 'none',
            color: isActive(to) ? C.accentColor : '#fff', padding: '10px 0', borderBottom: `1px solid ${C.borderSubtle}`,
          }}>{label}</Link>
        ))}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {user ? (
            <>
              <Link to="/restaurant/profile" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: C.accentColor, padding: '12px 16px', border: `1px solid ${C.borderSubtle}`, borderRadius: 8, textAlign: 'center',
              }}>My Profile</Link>
              <button type="button" onClick={handleSignOut} disabled={leaving} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
                background: 'transparent', border: `1px solid ${C.borderSubtle}`, borderRadius: 8, color: '#aaa', padding: 12, cursor: 'pointer', width: '100%',
              }}>{leaving ? 'Signing out...' : 'Sign Out'}</button>
            </>
          ) : (
            <>
              <Link to="/restaurant/login" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#fff', padding: '12px 16px', border: `1px solid ${C.borderSubtle}`, borderRadius: 8, textAlign: 'center',
              }}>Sign In</Link>
              <Link to="/restaurant/register" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#0A0A0A', background: C.accentColor, padding: '12px 16px', borderRadius: 8, textAlign: 'center',
              }}>Join</Link>
            </>
          )}
        </div>
      </nav>

      <style>{`
        .rg-nav-desk { display: flex !important; }
        .rg-nav-mob  { display: none  !important; }
        .rg-nav-link:hover span { transform: scaleX(1) !important; }
        .rg-join-btn:hover { transform: scale(1.04); filter: brightness(1.1); }
        @media (max-width: 860px) {
          .rg-nav-desk { display: none !important; }
          .rg-nav-mob  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
