import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', padding: '48px 20px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '26px', letterSpacing: '4px', color: '#D4AF37', marginBottom: '6px' }}>PREMIER</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '2px', color: '#444', textTransform: 'uppercase', marginBottom: '16px' }}>Barbershop · San Antonio</div>
            <div style={{ fontSize: '12px', color: '#555', lineHeight: 2 }}>
              <div>📍 123 Main St, San Antonio TX</div>
              <a href="tel:2105550000" style={{ color: '#555', textDecoration: 'none' }}>📞 (210) 555-0000</a>
            </div>
          </div>

          {[
            { title: 'Shop', links: [{ l: 'Our Barbers', to: '/barbers' }, { l: 'Services', to: '/services' }, { l: 'Book Now', to: '/book' }] },
            { title: 'Account', links: [{ l: 'Sign In', to: '/login' }, { l: 'Register', to: '/register' }, { l: 'My Profile', to: '/profile' }] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '14px' }}>{title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(({ l, to }) => (
                  <Link key={to} to={to} style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>{l}</Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div style={{ background: '#161616', border: '1px solid #222', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '22px', letterSpacing: '2px', marginBottom: '8px' }}>WALK-INS WELCOME</div>
              <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.6, marginBottom: '14px' }}>No appointment needed. Pull up and we'll get you right.</p>
              <Link to="/book" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '12px', padding: '10px' }}>Book Online →</Link>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #A88B20, transparent)', marginBottom: '20px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontSize: '11px', color: '#333' }}>© {new Date().getFullYear()} Premier Barbershop · All rights reserved</p>
          <p style={{ fontSize: '11px', color: '#333' }}>✦ One Shop. One App. All Barbers. ✦</p>
        </div>
      </div>
    </footer>
  )
}
