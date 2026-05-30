import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'Barbers',  to: '/barbers' },
  { label: 'Services', to: '/services' },
  { label: 'Book Now', to: '/book' },
]

export default function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [leaving,  setLeaving]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  const handleSignOut = async () => {
    setLeaving(true)
    await signOut()
    clearAuth()
    toast.success('Signed out')
    navigate('/')
    setLeaving(false)
  }

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: 'rgba(10,10,10,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #1f1f1f' : '1px solid transparent',
        transition: 'border-color 0.3s',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', letterSpacing: '3px', color: '#D4AF37' }}>PREMIER</span>
          <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '10px', letterSpacing: '2px', color: '#444', textTransform: 'uppercase' }}>Barbershop</span>
        </Link>

        <nav style={{ display: 'flex', gap: '4px' }} className="desk-nav">
          {LINKS.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link${isActive(l.to) ? ' active' : ''}`}>{l.label}</Link>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="desk-nav">
          {user ? (
            <>
              <Link to="/profile" style={{
                fontFamily: "'Barlow Condensed'", fontSize: '13px', letterSpacing: '1px',
                textTransform: 'uppercase', textDecoration: 'none', color: '#D4AF37',
                padding: '8px 14px', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '4px',
              }}>◆ Profile</Link>
              <button onClick={handleSignOut} disabled={leaving} className="btn-ghost">
                {leaving ? '...' : 'Sign Out'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: '13px' }}>Join</Link>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen(o => !o)} className="mob-menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '1.5px', background: '#D4AF37',
              transition: 'all 0.3s', transformOrigin: 'center',
              transform: menuOpen ? i === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)' : i === 2 ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </header>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 98,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }} />
      )}

      <nav style={{
        position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
        background: '#111', borderBottom: '1px solid #222', padding: '20px',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', gap: '4px',
      }}>
        {LINKS.map(({ label, to }) => (
          <Link key={to} to={to} style={{
            fontFamily: "'Bebas Neue'", fontSize: '30px', letterSpacing: '3px',
            color: isActive(to) ? '#D4AF37' : '#F5F5F5',
            padding: '10px 0', borderBottom: '1px solid #1a1a1a', textDecoration: 'none',
          }}>{label}</Link>
        ))}
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {user ? (
            <>
              <Link to="/profile" style={{
                fontFamily: "'Barlow Condensed'", fontSize: '14px', letterSpacing: '2px',
                textTransform: 'uppercase', textDecoration: 'none', color: '#D4AF37',
                padding: '12px 16px', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', textAlign: 'center',
              }}>◆ My Profile</Link>
              <button onClick={handleSignOut} style={{
                fontFamily: "'Barlow Condensed'", fontSize: '13px', letterSpacing: '2px',
                textTransform: 'uppercase', background: 'transparent', border: '1px solid #2a2a2a',
                borderRadius: '4px', color: '#666', padding: '12px', cursor: 'pointer', width: '100%',
              }}>{leaving ? 'Signing out...' : 'Sign Out'}</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                fontFamily: "'Barlow Condensed'", fontSize: '14px', letterSpacing: '2px',
                textTransform: 'uppercase', textDecoration: 'none', color: '#888',
                padding: '12px 16px', border: '1px solid #222', borderRadius: '4px', textAlign: 'center',
              }}>Sign In</Link>
              <Link to="/register" style={{
                fontFamily: "'Barlow Condensed'", fontSize: '14px', fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase', textDecoration: 'none', color: '#0A0A0A',
                background: '#D4AF37', padding: '12px 16px', borderRadius: '4px', textAlign: 'center',
              }}>Create Account</Link>
            </>
          )}
        </div>
      </nav>

      <style>{`
        .desk-nav { display: flex !important; }
        .mob-menu  { display: none  !important; }
        @media (max-width: 768px) {
          .desk-nav { display: none  !important; }
          .mob-menu  { display: flex  !important; }
        }
      `}</style>
    </>
  )
}
