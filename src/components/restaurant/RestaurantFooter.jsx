import { Link } from 'react-router-dom'
import { RESTAURANT_CONFIG as C } from '../../pages/restaurant/config'

const LINKS = {
  Navigate: [
    { label: 'Home', to: '/restaurant' },
    { label: 'Menu', to: '/restaurant/menu' },
    { label: 'Order', to: '/restaurant/order' },
    { label: 'Gallery', to: '/restaurant/gallery' },
    { label: 'Visit', to: '/restaurant/location' },
  ],
  Account: [
    { label: 'Sign In', to: '/restaurant/login' },
    { label: 'Register', to: '/restaurant/register' },
    { label: 'My Profile', to: '/restaurant/profile' },
  ],
}

export default function RestaurantFooter() {
  return (
    <footer style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', padding: '48px 20px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 36, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 4, color: C.accentColor, marginBottom: 4 }}>
              {C.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#444', marginBottom: 16 }}>
              Mexican Restaurant · San Antonio
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#555' }}>
                <span style={{ fontSize: 11 }}>📍</span>{C.address}
              </div>
              <a href={`tel:${C.phone.replace(/[^\d]/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#555', textDecoration: 'none' }}>
                <span style={{ fontSize: 11 }}>📞</span>{C.phone}
              </a>
            </div>
          </div>

          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.accentColor, marginBottom: 16 }}>
                {title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(({ label, to }) => (
                  <Link key={to} to={to} style={{ fontSize: 13, color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = C.accentColor}
                    onMouseLeave={e => e.target.style.color = '#555'}
                  >{label}</Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.accentColor, marginBottom: 16 }}>
              Order Now
            </div>
            <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 8, padding: 20 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, marginBottom: 8 }}>HUNGRY?</div>
              <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 16 }}>
                Order ahead for pickup — fresh and ready when you arrive.
              </p>
              <Link to="/restaurant/order" style={{
                display: 'block', textAlign: 'center', background: C.accentColor, color: '#0A0A0A', borderRadius: 4,
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase', textDecoration: 'none', padding: 10,
              }}>Order Now →</Link>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.accentColor}44, transparent)`, marginBottom: 20 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 11, color: '#333' }}>
            © {new Date().getFullYear()} {C.fullName} · All rights reserved
          </p>
          <a href="/" style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            color: '#333', textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = C.accentColor}
            onMouseLeave={e => e.currentTarget.style.color = '#333'}
          >Powered by Moe Builds Co.</a>
        </div>
      </div>
    </footer>
  )
}
