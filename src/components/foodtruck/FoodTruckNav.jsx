import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut, getProfile } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'
import { TRUCK_CONFIG } from '../../pages/foodtruck/config'
import { useDemoConfig, useDemoControls } from '../../context/DemoContext'
import { scrollToSection } from './scrollUtils'
import toast from 'react-hot-toast'

const SECTIONS = ['home', 'menu', 'order', 'schedule', 'gallery', 'find-us']
const LINKS = [
  { label: 'Home',     id: 'home'     },
  { label: 'Menu',     id: 'menu'     },
  { label: 'Order',    id: 'order'    },
  { label: 'Schedule', id: 'schedule' },
  { label: 'Gallery',  id: 'gallery'  },
  { label: 'Find Us',  id: 'find-us'  },
]

const COLORS = [
  { hex: '#F97316', label: 'Orange'  },
  { hex: '#2563eb', label: 'Blue'    },
  { hex: '#16a34a', label: 'Green'   },
  { hex: '#dc2626', label: 'Red'     },
  { hex: '#9333ea', label: 'Purple'  },
  { hex: '#0f766e', label: 'Teal'    },
  { hex: '#D4AF37', label: 'Gold'    },
  { hex: '#be185d', label: 'Pink'    },
  { hex: '#1e293b', label: 'Dark'    },
]

export default function FoodTruckNav() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, profile, clearAuth, setProfile } = useAuthStore()
  const C         = useDemoConfig(TRUCK_CONFIG)
  const setDemo   = useDemoControls()

  const [scrolled,       setScrolled]       = useState(false)
  const [menuOpen,       setMenuOpen]        = useState(false)
  const [leaving,        setLeaving]         = useState(false)
  const [activeSection,  setActiveSection]   = useState('home')
  const [settingsOpen,   setSettingsOpen]    = useState(false)
  const [draftName,      setDraftName]       = useState('')
  const [draftColor,     setDraftColor]      = useState(COLORS[0].hex)
  const drawerRef   = useRef(null)
  const settingsRef = useRef(null)

  const onHome = location.pathname === '/foodtruck'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (user && !profile) getProfile(user.id).then(({ data }) => { if (data) setProfile(data) })
    if (!user && profile) setProfile(null)
  }, [user])

  useEffect(() => {
    if (!onHome) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id) })
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 })
    SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [onHome])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return
    const onKey          = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    const onClickOutside = (e) => { if (drawerRef.current && !drawerRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!settingsOpen) return
    const onClickOutside = (e) => { if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false) }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [settingsOpen])

  const goToSection = (id) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (onHome) { scrollToSection(id) } else { navigate('/foodtruck'); setTimeout(() => scrollToSection(id), 80) }
  }

  const isActive = (id) => onHome && activeSection === id

  const handleSignOut = async () => {
    setLeaving(true)
    await signOut()
    clearAuth()
    toast.success('Signed out')
    navigate('/foodtruck')
    setLeaving(false)
  }

  const handleCreateDemo = () => {
    setDemo({
      name:        draftName.trim() || TRUCK_CONFIG.name,
      accentColor: draftColor,
    })
    setSettingsOpen(false)
    toast.success('Demo updated')
    scrollToSection('home')
  }

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        background: scrolled ? 'rgba(13,13,13,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.borderSubtle}` : '1px solid transparent',
        transition: 'all 0.3s',
      }}>

        <a href="#home" onClick={goToSection('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', cursor: 'pointer' }}>
          <span style={{
            width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: C.accentColor, fontSize: 17, transition: 'background 0.3s',
          }}>🚚</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1.5, color: '#fff', transition: 'all 0.3s' }}>
            {C.name}
          </span>
        </a>

        <nav style={{ display: 'flex', gap: '4px' }} className="ft-nav-desk">
          {LINKS.map(({ label, id }) => (
            <a key={id} href={`#${id}`} onClick={goToSection(id)} className="ft-nav-link" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase',
              textDecoration: 'none', padding: '8px 14px', color: isActive(id) ? TRUCK_CONFIG.accentAmber : '#fff',
              position: 'relative', cursor: 'pointer',
            }}>
              {label}
              <span style={{
                position: 'absolute', left: 14, right: 14, bottom: 2, height: 2, borderRadius: 1,
                background: TRUCK_CONFIG.accentAmber, transform: isActive(id) ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.2s', transformOrigin: 'left',
              }} />
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="ft-nav-desk">
          {user ? (
            <>
              <Link to="/foodtruck/profile" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#fff', padding: '8px 12px', cursor: 'pointer',
              }}>Profile</Link>
              <button type="button" onClick={handleSignOut} disabled={leaving} className="ft-ghost-btn" style={{
                background: 'transparent', border: `1px solid ${C.borderSubtle}`, borderRadius: 100,
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, color: '#aaa',
                padding: '9px 18px', cursor: 'pointer', transition: 'all 0.2s',
              }}>{leaving ? '...' : 'Sign Out'}</button>
            </>
          ) : (
            <>
              <Link to="/foodtruck/login" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#fff', padding: '8px 12px', cursor: 'pointer',
              }}>Sign In</Link>
              <a href="#order" onClick={goToSection('order')} className="ft-order-btn" style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1,
                textTransform: 'uppercase', textDecoration: 'none', color: '#0d0d0d', background: C.accentColor,
                padding: '10px 22px', borderRadius: 100, transition: 'transform 0.2s, filter 0.2s, background 0.3s', cursor: 'pointer',
              }}>Order Now</a>
            </>
          )}

          <div style={{ position: 'relative' }} ref={settingsRef}>
            <button
              type="button"
              onClick={() => setSettingsOpen(o => !o)}
              title="Demo settings"
              style={{
                background: settingsOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: `1px solid ${settingsOpen ? C.accentColor : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '50%', width: 36, height: 36, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 16, transition: 'all 0.2s',
              }}
            >⚙</button>

            {settingsOpen && (
              <div style={{
                position: 'absolute', top: 46, right: 0, width: 280,
                background: '#161616', border: `1px solid ${C.accentColor}44`,
                borderRadius: 12, padding: 20, zIndex: 200,
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              }}>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1, color: '#fff', marginBottom: 16 }}>Demo Settings</p>

                <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: 6 }}>Business name</label>
                <input
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  placeholder={TRUCK_CONFIG.name}
                  style={{
                    width: '100%', background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 8,
                    padding: '9px 12px', fontSize: 14, color: '#fff', outline: 'none',
                    fontFamily: "'Inter', sans-serif", marginBottom: 16, boxSizing: 'border-box',
                  }}
                />

                <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: 10 }}>Brand color</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {COLORS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      title={c.label}
                      onClick={() => setDraftColor(c.hex)}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', background: c.hex, border: 'none',
                        cursor: 'pointer', outline: draftColor === c.hex ? '3px solid #fff' : '3px solid transparent',
                        outlineOffset: 2, transition: 'outline 0.15s',
                      }}
                    />
                  ))}
                </div>

                <div style={{ height: 4, borderRadius: 2, background: draftColor, marginBottom: 16, transition: 'background 0.2s' }} />

                <button type="button" onClick={handleCreateDemo} style={{
                  width: '100%', padding: '11px 0', background: draftColor, border: 'none', borderRadius: 8,
                  color: '#0d0d0d', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', transition: 'filter 0.2s',
                }}>Create Demo</button>

                <button type="button" onClick={() => { setDemo({}); setDraftName(''); setDraftColor(COLORS[0].hex); setSettingsOpen(false) }} style={{
                  width: '100%', marginTop: 8, padding: '9px 0', background: 'transparent',
                  border: '1px solid #2a2a2a', borderRadius: 8, color: '#555',
                  fontFamily: "'Inter', sans-serif", fontSize: 12, cursor: 'pointer',
                }}>Reset to Default</button>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => setMenuOpen(o => !o)} className="ft-nav-mob" aria-label="Toggle menu" style={{
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

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }} />
      )}

      <nav ref={drawerRef} style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 99, width: 'min(82vw, 340px)',
        background: '#161616', borderLeft: `1px solid ${C.borderSubtle}`, padding: '90px 28px 28px',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {LINKS.map(({ label, id }) => (
          <a key={id} href={`#${id}`} onClick={goToSection(id)} style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1, textDecoration: 'none', cursor: 'pointer',
            color: isActive(id) ? TRUCK_CONFIG.accentAmber : '#fff', padding: '10px 0', borderBottom: `1px solid ${C.borderSubtle}`,
          }}>{label}</a>
        ))}

        <div style={{ marginTop: 16, padding: '16px 0', borderBottom: '1px solid #2a2a2a' }}>
          <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#555', marginBottom: 10 }}>Demo settings</p>
          <input
            value={draftName}
            onChange={e => setDraftName(e.target.value)}
            placeholder="Business name"
            style={{
              width: '100%', background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 8,
              padding: '9px 12px', fontSize: 14, color: '#fff', outline: 'none',
              fontFamily: "'Inter', sans-serif", marginBottom: 10, boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {COLORS.map(c => (
              <button key={c.hex} type="button" onClick={() => setDraftColor(c.hex)} style={{
                width: 28, height: 28, borderRadius: '50%', background: c.hex, border: 'none', cursor: 'pointer',
                outline: draftColor === c.hex ? '3px solid #fff' : '3px solid transparent', outlineOffset: 2,
              }} />
            ))}
          </div>
          <button type="button" onClick={handleCreateDemo} style={{
            width: '100%', padding: '11px 0', background: draftColor, border: 'none', borderRadius: 8,
            color: '#0d0d0d', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700,
            letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
          }}>Create Demo</button>
        </div>

        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {user ? (
            <>
              <Link to="/foodtruck/profile" onClick={() => setMenuOpen(false)} style={{
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
              <Link to="/foodtruck/login" onClick={() => setMenuOpen(false)} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#fff', padding: '12px 16px', border: `1px solid ${C.borderSubtle}`, borderRadius: 8, textAlign: 'center',
              }}>Sign In</Link>
              <a href="#order" onClick={goToSection('order')} style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                textDecoration: 'none', color: '#0d0d0d', background: C.accentColor, padding: '12px 16px', borderRadius: 8, textAlign: 'center',
              }}>Order Now</a>
            </>
          )}
        </div>
      </nav>

      <style>{`
        .ft-nav-desk { display: flex !important; }
        .ft-nav-mob  { display: none  !important; }
        .ft-nav-link:hover span { transform: scaleX(1) !important; }
        .ft-nav-link:hover { color: ${TRUCK_CONFIG.accentAmber} !important; }
        .ft-order-btn:hover { transform: scale(1.04); filter: brightness(1.1); }
        .ft-ghost-btn:hover { color: #fff !important; border-color: ${TRUCK_CONFIG.accentColor} !important; }
        @media (max-width: 860px) {
          .ft-nav-desk { display: none !important; }
          .ft-nav-mob  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
