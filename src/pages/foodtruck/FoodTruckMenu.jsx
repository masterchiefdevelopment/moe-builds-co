// src/pages/foodtruck/FoodTruckMenu.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

const MENU = {
  'Burgers': [
    { name: 'Smash Burger',       desc: 'Double smash patty, american cheese, secret sauce, pickles, onion',  price: '$12', emoji: '🍔', best: true },
    { name: 'Spicy Smash',        desc: 'Double smash, pepper jack, jalapeño aioli, crispy onion strings',    price: '$13', emoji: '🌶️', best: false },
    { name: 'BBQ Bacon Burger',   desc: 'Smash patty, thick-cut bacon, cheddar, house BBQ, coleslaw',         price: '$14', emoji: '🥓', best: false },
    { name: 'Mushroom Swiss',     desc: 'Smash patty, sautéed mushrooms, swiss cheese, garlic aioli',         price: '$13', emoji: '🍄', best: false },
  ],
  'Tacos': [
    { name: 'Birria Tacos',       desc: 'Braised beef, oaxaca cheese, consommé dip, cilantro, onion (3pc)',   price: '$14', emoji: '🌮', best: true },
    { name: 'Al Pastor Tacos',    desc: 'Marinated pork, pineapple, cilantro, onion, salsa verde (3pc)',      price: '$13', emoji: '🍍', best: false },
    { name: 'Grilled Fish Tacos', desc: 'Mahi mahi, cabbage slaw, chipotle crema, pico de gallo (2pc)',       price: '$13', emoji: '🐟', best: false },
    { name: 'Veggie Taco',        desc: 'Roasted peppers, black beans, avocado, cotija, salsa roja (3pc)',    price: '$11', emoji: '🥑', best: false },
  ],
  'Sides': [
    { name: 'Loaded Fries',       desc: 'Seasoned fries, cheese sauce, jalapeños, bacon crumble, sour cream', price: '$8', emoji: '🍟', best: true },
    { name: 'Street Corn',        desc: 'Elote style, mayo, cotija, chili powder, lime',                      price: '$5', emoji: '🌽', best: false },
    { name: 'Onion Rings',        desc: 'Beer battered, thick-cut, served with chipotle ranch',               price: '$6', emoji: '🧅', best: false },
    { name: 'Side Salad',         desc: 'Mixed greens, cherry tomato, cucumber, house vinaigrette',           price: '$5', emoji: '🥗', best: false },
  ],
  'Drinks': [
    { name: 'Agua Fresca',        desc: 'Rotating seasonal flavors, made fresh daily — ask your server',      price: '$4', emoji: '🥤', best: true },
    { name: 'Jarritos',           desc: 'Mandarin, tamarind, lime, or fruit punch',                           price: '$3', emoji: '🍊', best: false },
    { name: 'Bottled Water',      desc: 'Still or sparkling',                                                 price: '$2', emoji: '💧', best: false },
    { name: 'Fresh Lemonade',     desc: 'Hand-squeezed, sweetened with agave, served over ice',               price: '$4', emoji: '🍋', best: false },
  ],
}

const CATEGORIES = Object.keys(MENU)

export default function FoodTruckMenu() {
  const [active, setActive] = useState('Burgers')

  return (
    <div style={{ minHeight: '100vh', padding: '80px 20px 60px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── Header ──────────────────────────────────── */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontSize:       '11px',
          letterSpacing:  '4px',
          textTransform:  'uppercase',
          color:          '#FF6B2B',
          display:        'flex',
          alignItems:     'center',
          gap:            '12px',
          marginBottom:   '12px',
        }}>
          <span style={{ flex: 1, maxWidth: '40px', height: '1px', background: '#FF6B2B66' }} />
          Full Menu
          <span style={{ flex: 1, maxWidth: '40px', height: '1px', background: '#FF6B2B66' }} />
        </div>
        <h1 style={{
          fontFamily:    "'Bebas Neue', sans-serif",
          fontSize:       'clamp(40px, 8vw, 80px)',
          letterSpacing:  '4px',
          lineHeight:     1,
          textAlign:      'center',
          marginBottom:   '12px',
        }}>
          WHAT WE'RE <span style={{ color: '#FF6B2B' }}>SERVING</span>
        </h1>
        <p style={{
          color:      '#555',
          fontSize:    '14px',
          textAlign:   'center',
          maxWidth:    '440px',
          margin:      '0 auto',
          lineHeight:  1.6,
        }}>
          Everything made to order. Menu rotates seasonally. Check back for specials.
        </p>
      </div>

      {/* ── Category tabs ───────────────────────────── */}
      <div style={{
        display:        'flex',
        gap:            '8px',
        flexWrap:       'wrap',
        justifyContent: 'center',
        marginBottom:   '40px',
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              background:    active === cat ? '#FF6B2B' : 'transparent',
              color:         active === cat ? '#0A0A0A' : '#666',
              border:        active === cat ? '1px solid #FF6B2B' : '1px solid #2a2a2a',
              borderRadius:  '6px',
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '13px',
              fontWeight:     active === cat ? 700 : 400,
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              padding:        '10px 24px',
              cursor:         'pointer',
              transition:     'all 0.2s',
            }}
            onMouseEnter={e => {
              if (active !== cat) {
                e.currentTarget.style.borderColor = 'rgba(255,107,43,0.4)'
                e.currentTarget.style.color       = '#F5F5F5'
              }
            }}
            onMouseLeave={e => {
              if (active !== cat) {
                e.currentTarget.style.borderColor = '#2a2a2a'
                e.currentTarget.style.color       = '#666'
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Items grid ──────────────────────────────── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap:                 '16px',
        marginBottom:        '48px',
      }}>
        {MENU[active].map(({ name, desc, price, emoji, best }, i) => (
          <div
            key={name}
            className={`fade-up d${i + 1}`}
            style={{
              background:   '#161616',
              border:       '1px solid #222',
              borderRadius: '8px',
              overflow:     'hidden',
              transition:   'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform   = 'translateY(-4px)'
              e.currentTarget.style.borderColor = 'rgba(255,107,43,0.35)'
              e.currentTarget.style.boxShadow   = '0 8px 32px rgba(255,107,43,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform   = 'translateY(0)'
              e.currentTarget.style.borderColor = '#222'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          >
            {/* Photo placeholder */}
            <div style={{
              width:          '100%',
              aspectRatio:    '16/9',
              background:     'linear-gradient(135deg, #1a1a1a, #222)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       '52px',
              position:       'relative',
            }}>
              {emoji}

              {best && (
                <div style={{
                  position:      'absolute',
                  top:           '10px',
                  left:          '10px',
                  background:    '#FF6B2B',
                  borderRadius:  '100px',
                  padding:       '3px 10px',
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontSize:       '10px',
                  fontWeight:     700,
                  letterSpacing:  '1.5px',
                  textTransform:  'uppercase',
                  color:          '#0A0A0A',
                }}>
                  🔥 Best Seller
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '16px 18px' }}>
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'flex-start',
                gap:            '8px',
                marginBottom:   '6px',
              }}>
                <div style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:       '22px',
                  letterSpacing:  '1.5px',
                  lineHeight:     1.1,
                }}>
                  {name}
                </div>
                <div style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:       '22px',
                  letterSpacing:  '1px',
                  color:          '#FF6B2B',
                  whiteSpace:     'nowrap',
                }}>
                  {price}
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>{desc}</p>

              {/* Add to order btn */}
              <Link
                to="/foodtruck/order"
                style={{
                  display:        'block',
                  marginTop:      '14px',
                  textAlign:      'center',
                  background:     'transparent',
                  color:          '#FF6B2B',
                  border:         '1px solid rgba(255,107,43,0.3)',
                  borderRadius:   '4px',
                  fontFamily:     "'Barlow Condensed', sans-serif",
                  fontSize:        '12px',
                  fontWeight:      700,
                  letterSpacing:   '2px',
                  textTransform:   'uppercase',
                  textDecoration:  'none',
                  padding:         '9px',
                  transition:      'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.color = '#0A0A0A' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF6B2B' }}
              >
                Order This →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom CTA ──────────────────────────────── */}
      <div style={{
        background:    'linear-gradient(135deg, #1a1008, #1a1a1a)',
        border:        '1px solid rgba(255,107,43,0.2)',
        borderRadius:  '10px',
        padding:       'clamp(24px, 4vw, 48px)',
        display:       'flex',
        flexWrap:      'wrap',
        alignItems:    'center',
        justifyContent:'space-between',
        gap:           '20px',
      }}>
        <div>
          <div style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:       'clamp(24px, 4vw, 40px)',
            letterSpacing:  '3px',
            lineHeight:     1,
            marginBottom:   '6px',
          }}>
            READY TO ORDER?
          </div>
          <p style={{ color: '#555', fontSize: '13px' }}>
            Pick your items · Choose pickup time · Skip the line
          </p>
        </div>
        <Link
          to="/foodtruck/order"
          style={{
            background:    '#FF6B2B',
            color:         '#0A0A0A',
            borderRadius:  '6px',
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '15px',
            fontWeight:     700,
            letterSpacing:  '2px',
            textTransform:  'uppercase',
            textDecoration: 'none',
            padding:        '14px 36px',
            whiteSpace:     'nowrap',
            transition:     'background 0.2s',
            boxShadow:      '0 0 24px rgba(255,107,43,0.2)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ff7d42'}
          onMouseLeave={e => e.currentTarget.style.background = '#FF6B2B'}
        >
          Start Your Order →
        </Link>
      </div>

    </div>
  )
}