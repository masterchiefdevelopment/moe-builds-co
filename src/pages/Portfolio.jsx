import { Link } from 'react-router-dom'

const DEMOS = [
  {
    id: 1,
    industry: 'Barbershop',
    name: 'Premier Barbershop',
    desc: 'Full booking app with barber profiles, services, loyalty punch card, and customer accounts.',
    features: ['Online Booking', 'Barber Profiles', 'Loyalty System', 'Customer Accounts'],
    link: '/barber',
    status: 'Live Demo',
    color: '#D4AF37',
  },
  {
    id: 2,
    industry: 'Food Truck',
    name: 'Coming Soon',
    desc: 'Mobile ordering, menu management, and location tracking for food truck businesses.',
    features: ['Mobile Ordering', 'Menu Management', 'Location Tracking', 'Loyalty Rewards'],
    link: null,
    status: 'In Development',
    color: '#555',
  },
]

export default function Portfolio() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      color: '#F5F5F5',
      fontFamily: "'Barlow', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid #1a1a1a',
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: '22px', letterSpacing: '4px', color: '#D4AF37' }}>
            MOE BUILDS CO.
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '2px', color: '#444', textTransform: 'uppercase' }}>
            San Antonio, TX · Custom App Development
          </div>
        </div>
        <a href="mailto:moebuildsco@gmail.com" style={{
          fontFamily: "'Barlow Condensed'", fontSize: '12px', letterSpacing: '2px',
          textTransform: 'uppercase', color: '#D4AF37',
          border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px',
          padding: '8px 16px', textDecoration: 'none',
        }}>Contact</a>
      </div>

      {/* Hero */}
      <div style={{
        padding: 'clamp(60px, 10vw, 120px) 32px 60px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(212,175,55,0.3)', borderRadius: '100px',
          padding: '6px 16px', marginBottom: '24px',
          fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '2px',
          textTransform: 'uppercase', color: '#D4AF37',
        }}>✦ Local Business App Development</div>

        <h1 style={{
          fontFamily: "'Bebas Neue'",
          fontSize: 'clamp(48px, 10vw, 96px)',
          letterSpacing: '4px', lineHeight: 0.95,
          marginBottom: '20px',
        }}>
          WE BUILD APPS<br />
          <span style={{ color: '#D4AF37' }}>LOCAL BUSINESSES</span><br />
          CAN OWN.
        </h1>

        <p style={{ fontSize: '15px', color: '#666', maxWidth: '480px', margin: '0 auto 16px', lineHeight: 1.7 }}>
          No marketplaces. No monthly rent to Vagaro. Your brand, your clients, your app.
        </p>

        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
          {[['$1,000', 'Starting Price'], ['$100/mo', 'Maintenance'], ['2 Weeks', 'Avg Delivery']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '36px', letterSpacing: '2px', color: '#D4AF37', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginTop: '4px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demos */}
      <div style={{ padding: '0 32px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '4px',
          textTransform: 'uppercase', color: '#D4AF37', textAlign: 'center',
          marginBottom: '40px',
        }}>— Live Demos —</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {DEMOS.map(demo => (
            <div key={demo.id} style={{
              background: '#161616', border: `1px solid ${demo.link ? 'rgba(212,175,55,0.2)' : '#1f1f1f'}`,
              borderRadius: '10px', padding: '28px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '16px', right: '16px',
                background: demo.link ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${demo.link ? 'rgba(212,175,55,0.25)' : '#2a2a2a'}`,
                borderRadius: '100px', padding: '3px 10px',
                fontFamily: "'Barlow Condensed'", fontSize: '10px', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: demo.link ? '#D4AF37' : '#444',
              }}>{demo.status}</div>

              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>
                {demo.industry}
              </div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '28px', letterSpacing: '2px', marginBottom: '10px', color: demo.link ? '#F5F5F5' : '#444' }}>
                {demo.name}
              </div>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, marginBottom: '20px' }}>
                {demo.desc}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {demo.features.map(f => (
                  <span key={f} style={{
                    fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '1px',
                    textTransform: 'uppercase', color: '#555',
                    background: '#111', border: '1px solid #222',
                    borderRadius: '4px', padding: '4px 8px',
                  }}>{f}</span>
                ))}
              </div>

              {demo.link ? (
                <Link to={demo.link} style={{
                  display: 'block', textAlign: 'center',
                  fontFamily: "'Barlow Condensed'", fontSize: '13px', fontWeight: 700,
                  letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
                  color: '#0A0A0A', background: '#D4AF37',
                  borderRadius: '4px', padding: '12px',
                }}>View Live Demo →</Link>
              ) : (
                <div style={{
                  display: 'block', textAlign: 'center',
                  fontFamily: "'Barlow Condensed'", fontSize: '13px',
                  letterSpacing: '2px', textTransform: 'uppercase',
                  color: '#333', background: '#111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '4px', padding: '12px',
                }}>Coming Soon</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #1a1a1a', padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
      }}>
        <p style={{ fontSize: '12px', color: '#333' }}>© {new Date().getFullYear()} Moe Builds Co. · San Antonio, TX</p>
        <a href="mailto:moebuildsco@gmail.com" style={{ fontSize: '12px', color: '#555', textDecoration: 'none' }}>moebuildsco@gmail.com</a>
      </div>
    </div>
  )
}
