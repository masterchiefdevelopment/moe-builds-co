// src/components/foodtruck/FoodTruckFooter.jsx
import { Link } from 'react-router-dom'

const LINKS = {
  Navigate: [
    { label: 'Home',     to: '/foodtruck' },
    { label: 'Menu',     to: '/foodtruck/menu' },
    { label: 'Order',    to: '/foodtruck/order' },
    { label: 'Location', to: '/foodtruck/location' },
  ],
  Account: [
    { label: 'Sign In',       to: '/foodtruck/login' },
    { label: 'Register',      to: '/foodtruck/register' },
    { label: 'My Profile',    to: '/foodtruck/profile' },
  ],
}

export default function FoodTruckFooter() {
  return (
    <footer style={{
      background:   '#0d0d0d',
      borderTop:    '1px solid #1a1a1a',
      padding:      '48px 20px 24px',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Top grid ──────────────────────────────── */}
        <div style={{
          display:               'grid',
          gridTemplateColumns:   'repeat(auto-fit, minmax(180px, 1fr))',
          gap:                   '36px',
          marginBottom:          '40px',
        }}>

          {/* Brand block */}
          <div>
            <div style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:       '28px',
              letterSpacing:  '4px',
              color:          '#FF6B2B',
              marginBottom:   '4px',
            }}>
              MOE'S
            </div>
            <div style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '11px',
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              color:          '#444',
              marginBottom:   '16px',
            }}>
              Food Truck · San Antonio
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { icon: '📍', text: 'San Antonio, TX' },
                { icon: '📞', text: '(210) 555-0000', href: 'tel:2105550000' },
                { icon: '📸', text: '@moesfoodtruck',  href: '#' },
              ].map(({ icon, text, href }) => (
                href ? (
                  <a key={text} href={href} style={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            '8px',
                    fontSize:        '12px',
                    color:           '#555',
                    textDecoration:  'none',
                    transition:      'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FF6B2B'}
                    onMouseLeave={e => e.currentTarget.style.color = '#555'}
                  >
                    <span style={{ fontSize: '11px' }}>{icon}</span>{text}
                  </a>
                ) : (
                  <div key={text} style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '8px',
                    fontSize:    '12px',
                    color:       '#555',
                  }}>
                    <span style={{ fontSize: '11px' }}>{icon}</span>{text}
                  </div>
                )
              ))}
            </div>

            {/* Hours */}
            <div style={{ marginTop: '20px' }}>
              <div style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '11px',
                letterSpacing:  '2px',
                textTransform:  'uppercase',
                color:          '#FF6B2B',
                marginBottom:   '8px',
              }}>
                Hours
              </div>
              {[
                { day: 'Mon – Fri', time: '11:00 AM – 8:00 PM' },
                { day: 'Saturday',  time: '10:00 AM – 9:00 PM' },
                { day: 'Sunday',    time: '11:00 AM – 6:00 PM' },
              ].map(({ day, time }) => (
                <div key={day} style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  gap:            '16px',
                  fontSize:        '12px',
                  color:           '#555',
                  marginBottom:    '4px',
                }}>
                  <span>{day}</span>
                  <span style={{ color: '#444' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nav link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <div style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '11px',
                letterSpacing:  '3px',
                textTransform:  'uppercase',
                color:          '#FF6B2B',
                marginBottom:   '16px',
              }}>
                {title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      fontSize:       '13px',
                      color:          '#555',
                      textDecoration: 'none',
                      transition:     'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#FF6B2B'}
                    onMouseLeave={e => e.target.style.color = '#555'}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* CTA block */}
          <div>
            <div style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '11px',
              letterSpacing:  '3px',
              textTransform:  'uppercase',
              color:          '#FF6B2B',
              marginBottom:   '16px',
            }}>
              Order Now
            </div>
            <div style={{
              background:   '#161616',
              border:       '1px solid #222',
              borderRadius: '8px',
              padding:      '20px',
            }}>
              <div style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:       '22px',
                letterSpacing:  '2px',
                marginBottom:   '8px',
              }}>
                FIND US TODAY
              </div>
              <p style={{
                fontSize:     '12px',
                color:        '#555',
                lineHeight:   1.6,
                marginBottom: '16px',
              }}>
                Check our location for today's stop. Fresh food, no wait.
              </p>
              <Link
                to="/foodtruck/location"
                style={{
                  display:       'block',
                  textAlign:     'center',
                  background:    '#FF6B2B',
                  color:         '#0A0A0A',
                  borderRadius:  '4px',
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '12px',
                  fontWeight:     700,
                  letterSpacing:  '2px',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  padding:        '10px',
                  transition:     'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ff7d42'}
                onMouseLeave={e => e.currentTarget.style.background = '#FF6B2B'}
              >
                See Location →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────── */}
        <div style={{
          height:     '1px',
          background: 'linear-gradient(90deg, transparent, #FF6B2B44, transparent)',
          marginBottom: '20px',
        }} />

        {/* ── Bottom bar ────────────────────────────── */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          flexWrap:       'wrap',
          gap:            '8px',
        }}>
          <p style={{ fontSize: '11px', color: '#333' }}>
            © {new Date().getFullYear()} Moe's Food Truck · San Antonio, TX · All rights reserved
          </p>
          <p style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '11px',
            letterSpacing:  '2px',
            textTransform:  'uppercase',
            color:          '#333',
            display:        'flex',
            alignItems:     'center',
            gap:            '6px',
          }}>
            <span style={{ color: '#FF6B2B', fontSize: '8px' }}>✦</span>
            Fresh. Fast. Fire.
            <span style={{ color: '#FF6B2B', fontSize: '8px' }}>✦</span>
          </p>
        </div>

      </div>
    </footer>
  )
}