// src/pages/foodtruck/FoodTruckHome.jsx
import { Link } from 'react-router-dom'

const MENU_PREVIEW = [
  { name: 'Smash Burger',    desc: 'Double smash, american cheese, secret sauce',  price: '$12', emoji: '🍔', tag: 'Best Seller' },
  { name: 'Birria Tacos',    desc: 'Consommé dip, oaxaca cheese, cilantro onion',  price: '$14', emoji: '🌮', tag: 'Fan Favorite' },
  { name: 'Loaded Fries',    desc: 'Cheese sauce, jalapeños, bacon crumble',       price: '$8',  emoji: '🍟', tag: 'Add On' },
  { name: 'Agua Fresca',     desc: 'Rotating seasonal flavors, made fresh daily',  price: '$4',  emoji: '🥤', tag: 'Drink' },
]

const REASONS = [
  { icon: '🔥', title: 'Made Fresh',      desc: 'Every order cooked to order. No heat lamps. No shortcuts.' },
  { icon: '📍', title: 'Find Us Daily',   desc: 'We move around SA. Check location before you roll out.' },
  { icon: '📱', title: 'Order Ahead',     desc: 'Skip the line. Order online, pick up hot and ready.' },
  { icon: '⭐', title: 'Loyalty Rewards', desc: '10 orders earns you a free meal. No app needed.' },
]

export default function FoodTruckHome() {
  return (
    <div>

      {/* ── Hero ──────────────────────────────────────── */}
      <section style={{
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        textAlign:      'center',
        padding:        '80px 20px 60px',
        position:       'relative',
        overflow:       'hidden',
      }}>

        {/* BG glow */}
        <div style={{
          position:      'absolute',
          inset:         0,
          pointerEvents: 'none',
          background:    `
            radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,107,43,0.08) 0%, transparent 70%),
            repeating-linear-gradient(0deg,  transparent, transparent 79px, rgba(255,255,255,0.012) 79px, rgba(255,255,255,0.012) 80px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(255,255,255,0.012) 79px, rgba(255,255,255,0.012) 80px)
          `,
        }} />

        {/* Badge */}
        <div className="fade-up" style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           '8px',
          border:        '1px solid rgba(255,107,43,0.35)',
          borderRadius:  '100px',
          padding:       '6px 18px',
          marginBottom:  '28px',
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontSize:       '11px',
          letterSpacing:  '2px',
          textTransform:  'uppercase',
          color:          '#FF6B2B',
        }}>
          🔥 San Antonio Street Food
        </div>

        {/* Headline */}
        <h1 className="fade-up d1" style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:       'clamp(58px, 14vw, 130px)',
          letterSpacing:  '4px',
          lineHeight:     0.88,
          marginBottom:   '24px',
        }}>
          STREET FOOD<br />
          <span style={{ color: '#FF6B2B' }}>DONE</span><br />
          RIGHT.
        </h1>

        {/* Sub */}
        <p className="fade-up d2" style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontSize:       'clamp(15px, 3vw, 22px)',
          letterSpacing:  '3px',
          textTransform:  'uppercase',
          color:          '#555',
          marginBottom:   '14px',
        }}>
          Moe's Food Truck · San Antonio, TX
        </p>

        <p className="fade-up d3" style={{
          fontSize:      '15px',
          color:         '#666',
          maxWidth:      '400px',
          marginBottom:  '40px',
          lineHeight:    1.7,
        }}>
          <strong style={{ color: '#FF6B2B' }}>Fresh. Fast. Fire.</strong> Order ahead or find us on the block — we're bringing the heat to SA every day.
        </p>

        {/* CTAs */}
        <div className="fade-up d4" style={{
          display:        'flex',
          gap:            '12px',
          flexWrap:       'wrap',
          justifyContent: 'center',
          marginBottom:   '64px',
        }}>
          <Link to="/foodtruck/order" style={{
            background:    '#FF6B2B',
            color:         '#0A0A0A',
            border:        'none',
            borderRadius:  '6px',
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '14px',
            fontWeight:     700,
            letterSpacing:  '3px',
            textTransform:  'uppercase',
            textDecoration: 'none',
            padding:        '14px 32px',
            display:        'inline-block',
            transition:     'background 0.2s, transform 0.15s',
            boxShadow:      '0 0 28px rgba(255,107,43,0.25)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ff7d42'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Order Now
          </Link>
          <Link to="/foodtruck/menu" style={{
            background:    'transparent',
            color:         '#F5F5F5',
            border:        '1px solid #333',
            borderRadius:  '6px',
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '14px',
            fontWeight:     600,
            letterSpacing:  '3px',
            textTransform:  'uppercase',
            textDecoration: 'none',
            padding:        '14px 32px',
            display:        'inline-block',
            transition:     'border-color 0.2s, color 0.2s, transform 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B2B'; e.currentTarget.style.color = '#FF6B2B'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#F5F5F5'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            See the Menu
          </Link>
        </div>

        {/* Stats */}
        <div className="fade-up d5" style={{
          display:        'flex',
          gap:            '48px',
          flexWrap:       'wrap',
          justifyContent: 'center',
        }}>
          {[
            ['100%', 'Fresh Daily'],
            ['5★',   'Google Rating'],
            ['SA',   'Local & Proud'],
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:       '44px',
                letterSpacing:  '2px',
                color:          '#FF6B2B',
                lineHeight:     1,
              }}>
                {num}
              </div>
              <div style={{
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '11px',
                letterSpacing:  '2px',
                textTransform:  'uppercase',
                color:          '#555',
                marginTop:      '4px',
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gold divider ──────────────────────────────── */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          height:     '1px',
          background: 'linear-gradient(90deg, transparent, #FF6B2B44, transparent)',
          maxWidth:   '320px',
          margin:     '0 auto',
        }} />
      </div>

      {/* ── Menu Preview ──────────────────────────────── */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '52px' }}>
          <div style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '11px',
            letterSpacing:  '4px',
            textTransform:  'uppercase',
            color:          '#FF6B2B',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '12px',
            marginBottom:   '12px',
          }}>
            <span style={{ flex: 1, maxWidth: '40px', height: '1px', background: '#FF6B2B66' }} />
            What We're Serving
            <span style={{ flex: 1, maxWidth: '40px', height: '1px', background: '#FF6B2B66' }} />
          </div>
          <div style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       'clamp(36px, 6vw, 64px)',
            letterSpacing:  '3px',
            textAlign:      'center',
            lineHeight:     1,
          }}>
            TODAY'S MENU
          </div>
          <p style={{
            color:      '#555',
            fontSize:    '15px',
            textAlign:   'center',
            maxWidth:    '480px',
            margin:      '10px auto 0',
          }}>
            Rotating specials. Consistent heat. Always fresh.
          </p>
        </div>

        <div style={{
          display:               'grid',
          gridTemplateColumns:   'repeat(auto-fill, minmax(260px, 1fr))',
          gap:                   '16px',
          marginBottom:          '36px',
        }}>
          {MENU_PREVIEW.map(({ name, desc, price, emoji, tag }, i) => (
            <div
              key={name}
              className={`fade-up d${i + 1}`}
              style={{
                background:  '#161616',
                border:      '1px solid #222',
                borderRadius: '8px',
                overflow:    'hidden',
                transition:  'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                cursor:      'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform    = 'translateY(-4px)'
                e.currentTarget.style.borderColor  = 'rgba(255,107,43,0.35)'
                e.currentTarget.style.boxShadow    = '0 8px 32px rgba(255,107,43,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform    = 'translateY(0)'
                e.currentTarget.style.borderColor  = '#222'
                e.currentTarget.style.boxShadow    = 'none'
              }}
            >
              {/* Photo placeholder */}
              <div style={{
                width:           '100%',
                aspectRatio:     '16/9',
                background:      'linear-gradient(135deg, #1a1a1a, #222)',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                fontSize:        '52px',
                position:        'relative',
              }}>
                {emoji}
                <div style={{
                  position:      'absolute',
                  top:           '10px',
                  left:          '10px',
                  background:    'rgba(255,107,43,0.15)',
                  border:        '1px solid rgba(255,107,43,0.3)',
                  borderRadius:  '100px',
                  padding:       '3px 10px',
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '10px',
                  letterSpacing:  '1.5px',
                  textTransform:  'uppercase',
                  color:          '#FF6B2B',
                }}>
                  {tag}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '16px 18px' }}>
                <div style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'flex-start',
                  marginBottom:   '6px',
                }}>
                  <div style={{
                    fontFamily:    "'Bebas Neue', sans-serif",
                    fontSize:       '22px',
                    letterSpacing:  '1.5px',
                  }}>
                    {name}
                  </div>
                  <div style={{
                    fontFamily:    "'Bebas Neue', sans-serif",
                    fontSize:       '22px',
                    letterSpacing:  '1px',
                    color:          '#FF6B2B',
                  }}>
                    {price}
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/foodtruck/menu" style={{
            background:    'transparent',
            color:         '#FF6B2B',
            border:        '1px solid rgba(255,107,43,0.35)',
            borderRadius:  '6px',
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '14px',
            fontWeight:     600,
            letterSpacing:  '3px',
            textTransform:  'uppercase',
            textDecoration: 'none',
            padding:        '13px 32px',
            display:        'inline-block',
            transition:     'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,43,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            View Full Menu →
          </Link>
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────────── */}
      <section style={{ padding: '0 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '52px' }}>
          <div style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '11px',
            letterSpacing:  '4px',
            textTransform:  'uppercase',
            color:          '#FF6B2B',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '12px',
            marginBottom:   '12px',
          }}>
            <span style={{ flex: 1, maxWidth: '40px', height: '1px', background: '#FF6B2B66' }} />
            Why Moe's
            <span style={{ flex: 1, maxWidth: '40px', height: '1px', background: '#FF6B2B66' }} />
          </div>
          <div style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       'clamp(36px, 6vw, 64px)',
            letterSpacing:  '3px',
            textAlign:      'center',
            lineHeight:     1,
          }}>
            THE MOE'S DIFFERENCE
          </div>
        </div>

        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap:                 '16px',
        }}>
          {REASONS.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className={`fade-up d${i + 1}`}
              style={{
                background:   '#161616',
                border:       '1px solid #222',
                borderRadius: '8px',
                padding:      '28px 24px',
                transition:   'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,107,43,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#222' }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
              <div style={{
                fontFamily:    "'Bebas Neue', sans-serif",
                fontSize:       '22px',
                letterSpacing:  '2px',
                marginBottom:   '8px',
              }}>
                {title}
              </div>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section style={{ padding: '0 20px 80px' }}>
        <div style={{
          maxWidth:       '1200px',
          margin:         '0 auto',
          background:     'linear-gradient(135deg, #1a1008 0%, #1a1a1a 100%)',
          border:         '1px solid rgba(255,107,43,0.2)',
          borderRadius:   '12px',
          padding:        'clamp(32px, 5vw, 64px)',
          display:        'flex',
          flexWrap:       'wrap',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '24px',
          boxShadow:      '0 0 60px rgba(255,107,43,0.05)',
        }}>
          <div>
            <div style={{
              fontFamily:    "'Bebas Neue', sans-serif",
              fontSize:       'clamp(30px, 5vw, 52px)',
              letterSpacing:  '3px',
              lineHeight:     1,
            }}>
              HUNGRY? WE'RE OUT THERE.
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
              Check today's location · Order ahead · Skip the line
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/foodtruck/location" style={{
              background:    'transparent',
              color:         '#F5F5F5',
              border:        '1px solid #333',
              borderRadius:  '6px',
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '14px',
              fontWeight:     600,
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              textDecoration: 'none',
              padding:        '14px 28px',
              whiteSpace:     'nowrap',
              transition:     'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B2B'; e.currentTarget.style.color = '#FF6B2B' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#F5F5F5' }}
            >
              Find Us →
            </Link>
            <Link to="/foodtruck/order" style={{
              background:    '#FF6B2B',
              color:         '#0A0A0A',
              border:        'none',
              borderRadius:  '6px',
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '14px',
              fontWeight:     700,
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              textDecoration: 'none',
              padding:        '14px 28px',
              whiteSpace:     'nowrap',
              transition:     'background 0.2s',
              boxShadow:      '0 0 24px rgba(255,107,43,0.2)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#ff7d42'}
              onMouseLeave={e => e.currentTarget.style.background = '#FF6B2B'}
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}