// src/pages/foodtruck/FoodTruckMenu.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

const BRAND = '#FF6B2B'

const PHOTOS = {
  'Smash Burger':     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Spicy Smash':      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'BBQ Bacon Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Mushroom Swiss':   'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Birria Tacos':     'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
  'Al Pastor Tacos':  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
  'Grilled Fish Tacos':'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
  'Veggie Taco':      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
  'Loaded Fries':     'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
  'Street Corn':      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
  'Onion Rings':      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
  'Side Salad':       'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
  'Agua Fresca':      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
  'Jarritos':         'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
  'Bottled Water':    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
  'Fresh Lemonade':   'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
}

const MENU = {
  Burgers: [
    { name: 'Smash Burger',     desc: 'Double smash patty, american cheese, secret sauce, pickles, onion',  price: '$12', best: true  },
    { name: 'Spicy Smash',      desc: 'Double smash, pepper jack, jalapeño aioli, crispy onion strings',    price: '$13', best: false },
    { name: 'BBQ Bacon Burger', desc: 'Smash patty, thick-cut bacon, cheddar, house BBQ, coleslaw',         price: '$14', best: false },
    { name: 'Mushroom Swiss',   desc: 'Smash patty, sautéed mushrooms, swiss cheese, garlic aioli',         price: '$13', best: false },
  ],
  Tacos: [
    { name: 'Birria Tacos',       desc: 'Braised beef, oaxaca cheese, consommé dip, cilantro, onion (3pc)',  price: '$14', best: true  },
    { name: 'Al Pastor Tacos',    desc: 'Marinated pork, pineapple, cilantro, onion, salsa verde (3pc)',     price: '$13', best: false },
    { name: 'Grilled Fish Tacos', desc: 'Mahi mahi, cabbage slaw, chipotle crema, pico de gallo (2pc)',      price: '$13', best: false },
    { name: 'Veggie Taco',        desc: 'Roasted peppers, black beans, avocado, cotija, salsa roja (3pc)',   price: '$11', best: false },
  ],
  Sides: [
    { name: 'Loaded Fries', desc: 'Seasoned fries, cheese sauce, jalapeños, bacon crumble, sour cream', price: '$8', best: true  },
    { name: 'Street Corn',  desc: 'Elote style, mayo, cotija, chili powder, lime',                       price: '$5', best: false },
    { name: 'Onion Rings',  desc: 'Beer battered, thick-cut, served with chipotle ranch',                price: '$6', best: false },
    { name: 'Side Salad',   desc: 'Mixed greens, cherry tomato, cucumber, house vinaigrette',            price: '$5', best: false },
  ],
  Drinks: [
    { name: 'Agua Fresca',   desc: 'Rotating seasonal flavors, made fresh daily — ask your server',      price: '$4', best: true  },
    { name: 'Jarritos',      desc: 'Mandarin, tamarind, lime, or fruit punch',                           price: '$3', best: false },
    { name: 'Bottled Water', desc: 'Still or sparkling',                                                  price: '$2', best: false },
    { name: 'Fresh Lemonade',desc: 'Hand-squeezed, sweetened with agave, served over ice',               price: '$4', best: false },
  ],
}

const CATEGORIES = Object.keys(MENU)

export default function FoodTruckMenu() {
  const [active, setActive] = useState('Burgers')

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: '#F5F5F5', padding: '80px 20px 60px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* ── Header ──────────────────────────────────── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            fontFamily:   "'Barlow Condensed', sans-serif",
            fontSize:      '11px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color:         BRAND,
            marginBottom:  '8px',
          }}>
            Full Menu
          </div>
          <h1 style={{
            fontFamily:   "'Bebas Neue', sans-serif",
            fontSize:      'clamp(40px, 8vw, 72px)',
            letterSpacing: '4px',
            lineHeight:    1,
            marginBottom:  '10px',
          }}>
            WHAT WE'RE <span style={{ color: BRAND }}>SERVING</span>
          </h1>
          <p style={{ color: '#555', fontSize: '14px', maxWidth: '440px', lineHeight: 1.6 }}>
            Everything made to order. Menu rotates seasonally. Check back for specials.
          </p>
        </div>

        {/* ── Category pills ──────────────────────────── */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                background:   active === cat ? BRAND : 'transparent',
                color:        active === cat ? '#0f0f0f' : '#666',
                border:       active === cat ? `1px solid ${BRAND}` : '1px solid #2a2a2a',
                borderRadius: '100px',
                fontFamily:   "'Barlow Condensed', sans-serif",
                fontSize:      '13px',
                fontWeight:    active === cat ? 700 : 400,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding:       '9px 22px',
                cursor:        'pointer',
                transition:    'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Items list (DoorDash style) ─────────────── */}
        <div style={{
          background:   '#141414',
          border:       '1px solid #1e1e1e',
          borderRadius: '14px',
          overflow:     'hidden',
          marginBottom: '40px',
        }}>
          {MENU[active].map((item, i) => (
            <div
              key={item.name}
              style={{
                display:     'flex',
                alignItems:  'center',
                borderBottom: i < MENU[active].length - 1 ? '1px solid #1e1e1e' : 'none',
                background:   '#141414',
                transition:   'background 0.2s',
                minHeight:    '120px',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={e => e.currentTarget.style.background = '#141414'}
            >
              {/* Left: text */}
              <div style={{ flex: 1, padding: '20px 20px 20px 24px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily:   "'Bebas Neue', sans-serif",
                    fontSize:      '20px',
                    letterSpacing: '1.5px',
                    color:         '#F5F5F5',
                  }}>
                    {item.name}
                  </span>
                  {item.best && (
                    <span style={{
                      background:   BRAND,
                      color:        '#0f0f0f',
                      borderRadius: '100px',
                      padding:      '2px 8px',
                      fontFamily:   "'Barlow Condensed', sans-serif",
                      fontSize:      '10px',
                      fontWeight:    700,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                    }}>
                      🔥 Best Seller
                    </span>
                  )}
                </div>

                <p style={{
                  fontSize:   '13px',
                  color:      '#666',
                  lineHeight: 1.5,
                  marginBottom: '12px',
                  display:    '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow:   'hidden',
                }}>
                  {item.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily:   "'Bebas Neue', sans-serif",
                    fontSize:      '20px',
                    color:         BRAND,
                    letterSpacing: '1px',
                  }}>
                    {item.price}
                  </span>
                  <Link to="/foodtruck/order" style={{
                    display:        'inline-flex',
                    alignItems:     'center',
                    gap:            '4px',
                    background:     BRAND,
                    color:          '#0f0f0f',
                    borderRadius:   '6px',
                    fontFamily:     "'Barlow Condensed', sans-serif",
                    fontSize:        '12px',
                    fontWeight:      700,
                    letterSpacing:   '1.5px',
                    textTransform:   'uppercase',
                    textDecoration:  'none',
                    padding:         '7px 14px',
                    transition:      'transform 0.15s, opacity 0.2s',
                    whiteSpace:      'nowrap',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    + Add
                  </Link>
                </div>
              </div>

              {/* Right: photo */}
              <div style={{
                width:      '120px',
                height:     '120px',
                flexShrink: 0,
                background: '#1e1e1e',
                overflow:   'hidden',
              }}>
                <img
                  src={PHOTOS[item.name]}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ──────────────────────────────── */}
        <div style={{
          background:    'linear-gradient(135deg, #1a0e00, #141414)',
          border:        `1px solid ${BRAND}25`,
          borderRadius:  '14px',
          padding:       'clamp(24px, 4vw, 48px)',
          display:       'flex',
          flexWrap:      'wrap',
          alignItems:    'center',
          justifyContent:'space-between',
          gap:           '20px',
        }}>
          <div>
            <div style={{
              fontFamily:   "'Bebas Neue', sans-serif",
              fontSize:      'clamp(22px, 4vw, 36px)',
              letterSpacing: '3px',
              lineHeight:    1,
              marginBottom:  '6px',
            }}>
              READY TO ORDER?
            </div>
            <p style={{ color: '#555', fontSize: '13px' }}>
              Pick your items · Choose pickup time · Skip the line
            </p>
          </div>
          <Link to="/foodtruck/order" style={{
            background:    BRAND,
            color:         '#0f0f0f',
            borderRadius:  '8px',
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:       '15px',
            fontWeight:     700,
            letterSpacing:  '2px',
            textTransform:  'uppercase',
            textDecoration: 'none',
            padding:        '14px 36px',
            whiteSpace:     'nowrap',
            boxShadow:      `0 0 28px ${BRAND}30`,
            transition:     'transform 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Your Order →
          </Link>
        </div>

      </div>
    </div>
  )
}
