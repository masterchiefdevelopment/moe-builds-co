import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TRUCK_CONFIG as C } from '../../pages/foodtruck/config'
import { scrollToSection } from './scrollUtils'
import AddOnsDrawer from './AddOnsDrawer'

export default function FoodTruckFooter() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const goToSection = (id) => (e) => {
    e.preventDefault()
    if (window.location.pathname === '/foodtruck') {
      scrollToSection(id)
    } else {
      navigate('/foodtruck')
      setTimeout(() => scrollToSection(id), 80)
    }
  }

  return (
    <footer style={{ background: C.bgSecondary, borderTop: `1px solid ${C.borderSubtle}`, padding: '52px 24px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 36, marginBottom: 36 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: C.accentColor, fontSize: 16,
              }}>🚚</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1.5, color: '#fff' }}>{C.name}</span>
            </div>
            <p style={{ color: C.textSecondary, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{C.tagline}</p>
            <a href={`https://instagram.com/${C.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.textSecondary, textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = C.accentColor}
              onMouseLeave={e => e.currentTarget.style.color = C.textSecondary}
            >📸 {C.instagram}</a>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C.accentAmber, fontWeight: 600, marginBottom: 16 }}>
              Quick Links
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Menu', id: 'menu' },
                { label: 'Order', id: 'order' },
                { label: 'Schedule', id: 'schedule' },
                { label: 'Gallery', id: 'gallery' },
                { label: 'Find Us', id: 'find-us' },
              ].map(({ label, id }) => (
                <a key={id} href={`/foodtruck#${id}`} onClick={goToSection(id)} style={{ fontSize: 13, color: C.textSecondary, textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = C.accentAmber}
                  onMouseLeave={e => e.target.style.color = C.textSecondary}
                >{label}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C.accentAmber, fontWeight: 600, marginBottom: 16 }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: C.textSecondary }}>
              <span>📍 {C.address}</span>
              <a href={`tel:${C.phone.replace(/[^\d]/g, '')}`} style={{ color: C.textSecondary, textDecoration: 'none' }}>📞 {C.phone}</a>
              <span>✉️ {C.email}</span>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.borderSubtle}, transparent)`, marginBottom: 20 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 12, color: '#555' }}>© {new Date().getFullYear()} {C.name} · All rights reserved</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setDrawerOpen(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.textSecondary,
              fontFamily: "'Inter', sans-serif", textDecoration: 'underline', textUnderlineOffset: 3,
            }}>Interested in more features? →</button>
            <a href="https://moe-builds-co.vercel.app" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1, color: C.accentColor, textDecoration: 'none',
            }}>Powered by Moe Builds Co.</a>
          </div>
        </div>
      </div>
      <AddOnsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </footer>
  )
}
