import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut, getProfile } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { RESTAURANT_CONFIG as C } from '../../pages/restaurant/config'
import { scrollToSection } from './scrollUtils'
import toast from 'react-hot-toast'

const SECTIONS = ['home', 'menu', 'order', 'gallery', 'visit']
const LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'Menu', id: 'menu' },
  { label: 'Order', id: 'order' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Visit', id: 'visit' },
]

export default function RestaurantNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, clearAuth, setProfile } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const drawerRef = useRef(null)

  const onHome = location.pathname === '/restaurant'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (user && !profile) getProfile(user.id).then(({ data }) => { if (data) setProfile(data) })
    if (!user && profile) setProfile(null)
  }, [user])

  // Highlight active section as user scrolls
  useEffect(() => {
    if (!onHome) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id)
      })
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 })

    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [onHome])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    const onClickOutside = (e) => { if (drawerRef.current && !drawerRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [menuOpen])

  const goToSection = (id) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (onHome) {
      scrollToSection(id)
    } else {
      navigate('/restaurant')
      setTimeout(() => scrollToSection(id), 80)
    }
  }

  const isActive = (id) => onHome && activeSection === id

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
        padding: '0 24px',
        background: scrolled ? 'rgba(15,15,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.borderSubtle}` : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <a href="#home" onClick={goToSection('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', cursor: 'pointer' }}>
          <span style={{
            width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: C.accentRed, color: '#fff', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15,
          }}>{C.logoText}</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
            {C.name}
          </span>
        </a>

        <nav style={{ display: 'flex', gap: '4px' }} className="rg-nav-desk">
          {LINKS.map(({ label, id }) => (
            <a key={id} href={`#${id}`} onClick={goToSection(id)} className="rg-nav-link" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase',
              textDecoration: 'none', padding: '8px 14px', color: isActive(id) ? C.accentColor : '#fff',
              position: 'relative', cursor: 'pointer',
            }}>
              {label}
              <span style={{
                position: 'absolute', left: 14, right: 14, bottom: 2, height: 2, borderRadius: 1,
                background: C.accentColor, transform: isActive(id) ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s', transformOrigin: 'left',
              }} />
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="rg-nav-desk">
          {user ? (
            <>
              <Link to="/restaurant/profile" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#fff', padding: '8px 12px', cursor: 'pointer',
              }}>Profile</Link>
              <button type="button" onClick={handleSignOut} disabled={leaving} className="rg-ghost-btn" style={{
                background: 'transparent', border: `1px solid ${C.borderSubtle}`, borderRadius: 100,
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, color: '#aaa',
                padding: '9px 18px', cursor: 'pointer', transition: 'all 0.2s',
              }}>{leaving ? '...' : 'Sign Out'}</button>
            </>
          ) : (
            <>
              <Link to="/restaurant/login" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#fff', padding: '8px 12px', cursor: 'pointer',
              }}>Sign In</Link>
              <Link to="/restaurant/register" className="rg-join-btn" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1,
                textTransform: 'uppercase', textDecoration: 'none', color: '#0A0A0A', background: C.accentColor,
                padding: '10px 22px', borderRadius: 100, transition: 'transform 0.2s, filter 0.2s', cursor: 'pointer',
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }} />
      )}
      <nav ref={drawerRef} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 99, width: 'min(82vw, 340px)',
        background: C.bgSecondary, borderLeft: `1px solid ${C.borderSubtle}`, padding: '90px 28px 28px',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {LINKS.map(({ label, id }) => (
          <a key={id} href={`#${id}`} onClick={goToSection(id)} style={{
            fontFamily: "'Playfair Display', serif", fontSize: 26, textDecoration: 'none', cursor: 'pointer',
            color: isActive(id) ? C.accentColor : '#fff', padding: '10px 0', borderBottom: `1px solid ${C.borderSubtle}`,
          }}>{label}</a>
        ))}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {user ? (
            <>
              <Link to="/restaurant/profile" onClick={() => setMenuOpen(false)} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: C.accentColor, padding: '12px 16px', border: `1px solid ${C.borderSubtle}`, borderRadius: 8, textAlign: 'center', cursor: 'pointer',
              }}>My Profile</Link>
              <button type="button" onClick={handleSignOut} disabled={leaving} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
                background: 'transparent', border: `1px solid ${C.borderSubtle}`, borderRadius: 8, color: '#aaa', padding: 12, cursor: 'pointer', width: '100%',
              }}>{leaving ? 'Signing out...' : 'Sign Out'}</button>
            </>
          ) : (
            <>
              <Link to="/restaurant/login" onClick={() => setMenuOpen(false)} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#fff', padding: '12px 16px', border: `1px solid ${C.borderSubtle}`, borderRadius: 8, textAlign: 'center', cursor: 'pointer',
              }}>Sign In</Link>
              <Link to="/restaurant/register" onClick={() => setMenuOpen(false)} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#0A0A0A', background: C.accentColor, padding: '12px 16px', borderRadius: 8, textAlign: 'center', cursor: 'pointer',
              }}>Join</Link>
            </>
          )}
        </div>
      </nav>

      <style>{`
        .rg-nav-desk { display: flex !important; }
        .rg-nav-mob  { display: none  !important; }
        .rg-nav-link:hover span { transform: scaleX(1) !important; }
        .rg-nav-link:hover { color: ${C.accentColor} !important; }
        .rg-join-btn:hover { transform: scale(1.04); filter: brightness(1.1); }
        .rg-ghost-btn:hover { color: #fff !important; border-color: ${C.accentColor} !important; }
        @media (max-width: 860px) {
          .rg-nav-desk { display: none !important; }
          .rg-nav-mob  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
