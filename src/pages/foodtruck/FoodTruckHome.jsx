// src/pages/foodtruck/FoodTruckHome.jsx
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const UNSPLASH_KEY = 'X0sMc_3XFjYnk1ypNqEBqjhPOCl1CWU6hGLDQ0QKhLc'

const SWATCHES = ['#FF6B2B', '#E63946', '#F4A261', '#2A9D8F', '#9B5DE5', '#F72585']

const DEFAULT_STATE = {
  truckName: "Moe's Food Truck",
  color: '#FF6B2B',
  items: [
    { name: 'Smash Burger',  desc: 'Double smash, american cheese, secret sauce', price: '12', query: 'smash burger closeup' },
    { name: 'Birria Tacos',  desc: 'Consommé dip, oaxaca cheese, cilantro onion', price: '14', query: 'birria tacos mexican' },
    { name: 'Loaded Fries',  desc: 'Cheese sauce, jalapeños, crispy bacon crumble', price: '8', query: 'loaded cheese fries' },
    { name: 'Agua Fresca',   desc: 'Rotating seasonal flavors, made fresh daily',  price: '4',  query: 'agua fresca colorful drink' },
  ],
}

const PERKS = [
  { icon: '🔥', title: 'Made Fresh',      desc: 'Every order cooked to order. No heat lamps, no shortcuts, ever.' },
  { icon: '📍', title: 'Find Us Daily',   desc: 'We move around SA. Check our location tab before you roll out.' },
  { icon: '⏭️', title: 'Skip the Line',   desc: 'Order ahead online and pick up hot and ready — zero wait.' },
  { icon: '⭐', title: 'Earn Rewards',    desc: '10 orders earns you a free meal. No app or card required.' },
]

async function fetchPhoto(query) {
  try {
    const r = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&client_id=${UNSPLASH_KEY}`
    )
    const d = await r.json()
    return d.results?.[0]?.urls?.regular || null
  } catch {
    return null
  }
}

async function fetchHeroPhoto(query) {
  try {
    const r = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`
    )
    const d = await r.json()
    return d.results?.[0]?.urls?.full || d.results?.[0]?.urls?.regular || null
  } catch {
    return null
  }
}

export default function FoodTruckHome() {
  const [demo, setDemo]         = useState(DEFAULT_STATE)
  const [photos, setPhotos]     = useState({})
  const [heroPhoto, setHeroPhoto] = useState(null)
  const [loading, setLoading]   = useState(false)

  // Draft state for the panel
  const [draft, setDraft] = useState({
    truckName: DEFAULT_STATE.truckName,
    color: DEFAULT_STATE.color,
    items: DEFAULT_STATE.items.map(i => ({ name: i.name, price: i.price })),
  })

  // Load photos on mount or when demo changes
  useEffect(() => {
    let cancelled = false
    async function load() {
      const heroQ = `${demo.truckName} food truck street food gourmet`
      const [hero, ...itemPhotos] = await Promise.all([
        fetchHeroPhoto('gourmet food truck night city'),
        ...demo.items.map(item => fetchPhoto(item.query || item.name)),
      ])
      if (!cancelled) {
        setHeroPhoto(hero)
        const map = {}
        demo.items.forEach((item, i) => { map[item.name] = itemPhotos[i] })
        setPhotos(map)
      }
    }
    load()
    return () => { cancelled = true }
  }, [demo])

  const handleBuildDemo = async () => {
    setLoading(true)
    const newItems = draft.items.map((di, i) => ({
      name:  di.name  || DEFAULT_STATE.items[i].name,
      desc:  DEFAULT_STATE.items[i].desc,
      price: di.price || DEFAULT_STATE.items[i].price,
      query: di.name  || DEFAULT_STATE.items[i].query,
    }))
    setDemo({
      truckName: draft.truckName || DEFAULT_STATE.truckName,
      color:     draft.color,
      items:     newItems,
    })
    setLoading(false)
  }

  const c = demo.color

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: '#F5F5F5' }}>

      {/* ── Personalization Panel ─────────────────────── */}
      <div style={{
        background:   '#111',
        borderBottom: '1px solid #222',
        padding:      '20px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            fontFamily:   "'Barlow Condensed', sans-serif",
            fontSize:      '11px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color:         c,
            marginBottom:  '14px',
            display:       'flex',
            alignItems:    'center',
            gap:           '8px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c, display: 'inline-block' }} />
            Demo Builder — Customize Your Page
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
            {/* Truck name */}
            <div style={{ flex: '1 1 180px' }}>
              <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Truck Name
              </label>
              <input
                value={draft.truckName}
                onChange={e => setDraft(d => ({ ...d, truckName: e.target.value }))}
                placeholder="Moe's Food Truck"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#1a1a1a', border: '1px solid #2a2a2a',
                  borderRadius: '6px', color: '#F5F5F5',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '14px', padding: '9px 12px',
                  outline: 'none',
                }}
              />
            </div>

            {/* 4 menu items */}
            {draft.items.map((item, i) => (
              <div key={i} style={{ flex: '1 1 160px' }}>
                <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Item {i + 1}
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    value={item.name}
                    onChange={e => setDraft(d => {
                      const items = [...d.items]
                      items[i] = { ...items[i], name: e.target.value }
                      return { ...d, items }
                    })}
                    placeholder={DEFAULT_STATE.items[i].name}
                    style={{
                      flex: '1', background: '#1a1a1a', border: '1px solid #2a2a2a',
                      borderRadius: '6px', color: '#F5F5F5',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '13px', padding: '9px 10px', outline: 'none', minWidth: 0,
                    }}
                  />
                  <input
                    value={item.price}
                    onChange={e => setDraft(d => {
                      const items = [...d.items]
                      items[i] = { ...items[i], price: e.target.value }
                      return { ...d, items }
                    })}
                    placeholder="12"
                    style={{
                      width: '48px', background: '#1a1a1a', border: '1px solid #2a2a2a',
                      borderRadius: '6px', color: '#F5F5F5',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '13px', padding: '9px 8px', outline: 'none', textAlign: 'center',
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Color swatches */}
            <div>
              <label style={{ fontSize: '11px', color: '#555', display: 'block', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Brand Color
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {SWATCHES.map(sw => (
                  <button
                    key={sw}
                    onClick={() => setDraft(d => ({ ...d, color: sw }))}
                    style={{
                      width: '32px', height: '32px', borderRadius: '6px',
                      background: sw, border: draft.color === sw ? '2px solid #fff' : '2px solid transparent',
                      cursor: 'pointer', padding: 0, outline: 'none',
                      transition: 'transform 0.15s',
                      transform: draft.color === sw ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Build button */}
            <button
              onClick={handleBuildDemo}
              disabled={loading}
              style={{
                background:    c,
                color:         '#0f0f0f',
                border:        'none',
                borderRadius:  '6px',
                fontFamily:    "'Barlow Condensed', sans-serif",
                fontSize:       '14px',
                fontWeight:     700,
                letterSpacing:  '2px',
                textTransform:  'uppercase',
                padding:        '10px 24px',
                cursor:         loading ? 'wait' : 'pointer',
                whiteSpace:     'nowrap',
                opacity:        loading ? 0.7 : 1,
                transition:     'opacity 0.2s, transform 0.15s',
              }}
            >
              {loading ? 'Building…' : 'Build Demo'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{
        position:   'relative',
        height:     'min(100vh, 700px)',
        minHeight:  '520px',
        overflow:   'hidden',
        display:    'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding:    '0 20px 52px',
      }}>
        {/* Hero photo */}
        {heroPhoto ? (
          <img
            src={heroPhoto}
            alt="Hero"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #1a0a00, #1a1a1a)',
          }} />
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.65) 50%, rgba(10,10,10,0.2) 100%)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
          {/* Open now pill */}
          <div style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          '8px',
            background:   'rgba(15,15,15,0.75)',
            backdropFilter: 'blur(8px)',
            border:       '1px solid rgba(255,255,255,0.12)',
            borderRadius: '100px',
            padding:      '6px 14px',
            marginBottom: '20px',
            fontFamily:   "'Barlow Condensed', sans-serif",
            fontSize:      '13px',
            letterSpacing: '0.5px',
            color:         '#ddd',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
              display: 'inline-block', flexShrink: 0,
            }} />
            Open now · San Antonio
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily:   "'Bebas Neue', sans-serif",
            fontSize:      'clamp(48px, 10vw, 96px)',
            letterSpacing: '3px',
            lineHeight:    0.9,
            marginBottom:  '20px',
            color:         '#fff',
          }}>
            {demo.truckName.toUpperCase()}
          </h1>

          <p style={{
            fontSize:    '16px',
            color:       'rgba(255,255,255,0.6)',
            marginBottom: '28px',
            maxWidth:    '440px',
            lineHeight:  1.6,
            fontFamily:  "'Barlow Condensed', sans-serif",
            letterSpacing: '0.5px',
          }}>
            Fresh. Fast. Fire. Order ahead or find us on the block — bringing the heat to SA every day.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/foodtruck/order" style={{
              background:    c,
              color:         '#0f0f0f',
              border:        'none',
              borderRadius:  '8px',
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '15px',
              fontWeight:     700,
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              textDecoration: 'none',
              padding:        '14px 32px',
              display:        'inline-block',
              boxShadow:      `0 0 32px ${c}44`,
              transition:     'transform 0.15s, opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Order Now
            </Link>
            <Link to="/foodtruck/menu" style={{
              background:    'rgba(255,255,255,0.08)',
              color:         '#fff',
              border:        '1px solid rgba(255,255,255,0.2)',
              borderRadius:  '8px',
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '15px',
              fontWeight:     600,
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              textDecoration: 'none',
              padding:        '14px 32px',
              display:        'inline-block',
              backdropFilter: 'blur(8px)',
              transition:     'background 0.2s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              See the Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ────────────────────────────────── */}
      <div style={{
        background:   '#141414',
        borderTop:    '1px solid #1f1f1f',
        borderBottom: '1px solid #1f1f1f',
        padding:      '24px 20px',
      }}>
        <div style={{
          maxWidth:       '640px',
          margin:         '0 auto',
          display:        'flex',
          justifyContent: 'space-around',
          alignItems:     'center',
          flexWrap:       'wrap',
          gap:            '16px',
        }}>
          {[
            { icon: '✅', stat: '100% Fresh', label: 'Made Daily' },
            { icon: '📍', stat: 'SA Local',   label: '& Proud' },
            { icon: '⭐', stat: '5★ Rated',   label: 'Google Reviews' },
          ].map(({ icon, stat, label }) => (
            <div key={stat} style={{ textAlign: 'center', padding: '0 16px' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
              <div style={{
                fontFamily:   "'Bebas Neue', sans-serif",
                fontSize:      '22px',
                letterSpacing: '1.5px',
                color:         c,
                lineHeight:    1,
              }}>
                {stat}
              </div>
              <div style={{
                fontFamily:   "'Barlow Condensed', sans-serif",
                fontSize:      '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color:         '#555',
                marginTop:     '2px',
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Menu Preview (DoorDash style) ─────────────── */}
      <section style={{ padding: '64px 20px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            fontFamily:   "'Barlow Condensed', sans-serif",
            fontSize:      '11px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color:         c,
            marginBottom:  '8px',
          }}>
            What We're Serving
          </div>
          <h2 style={{
            fontFamily:   "'Bebas Neue', sans-serif",
            fontSize:      'clamp(32px, 6vw, 56px)',
            letterSpacing: '3px',
            lineHeight:    1,
            marginBottom:  '8px',
          }}>
            TODAY'S MENU
          </h2>
          <p style={{ color: '#555', fontSize: '14px' }}>
            Rotating specials. Consistent heat. Always fresh.
          </p>
        </div>

        {/* Cards — DoorDash style: text left, photo right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
          {demo.items.map((item, i) => (
            <div
              key={item.name + i}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '0',
                background:     '#141414',
                borderBottom:   i < demo.items.length - 1 ? '1px solid #1e1e1e' : 'none',
                transition:     'background 0.2s',
                cursor:         'default',
                minHeight:      '120px',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={e => e.currentTarget.style.background = '#141414'}
            >
              {/* Left: text */}
              <div style={{ flex: 1, padding: '20px 20px 20px 24px', minWidth: 0 }}>
                <div style={{
                  fontFamily:   "'Bebas Neue', sans-serif",
                  fontSize:      '20px',
                  letterSpacing: '1.5px',
                  marginBottom:  '4px',
                  color:         '#F5F5F5',
                }}>
                  {item.name}
                </div>
                <p style={{
                  fontSize:    '13px',
                  color:       '#666',
                  lineHeight:  1.5,
                  marginBottom: '12px',
                  display:     '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow:    'hidden',
                }}>
                  {item.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily:   "'Bebas Neue', sans-serif",
                    fontSize:      '20px',
                    color:         c,
                    letterSpacing: '1px',
                  }}>
                    ${item.price}
                  </span>
                  <Link to="/foodtruck/order" style={{
                    display:        'inline-flex',
                    alignItems:     'center',
                    gap:            '6px',
                    background:     c,
                    color:          '#0f0f0f',
                    borderRadius:   '6px',
                    fontFamily:     "'Barlow Condensed', sans-serif",
                    fontSize:        '12px',
                    fontWeight:      700,
                    letterSpacing:   '1.5px',
                    textTransform:   'uppercase',
                    textDecoration:  'none',
                    padding:         '7px 14px',
                    transition:      'opacity 0.2s, transform 0.15s',
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
                width:        '120px',
                height:       '120px',
                flexShrink:   0,
                background:   '#1e1e1e',
                overflow:     'hidden',
                position:     'relative',
              }}>
                {photos[item.name] ? (
                  <img
                    src={photos[item.name]}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '36px',
                    background: 'linear-gradient(135deg, #1a1a1a, #242424)',
                  }}>
                    {['🍔','🌮','🍟','🥤'][i]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/foodtruck/menu" style={{
            background:    'transparent',
            color:         c,
            border:        `1px solid ${c}55`,
            borderRadius:  '8px',
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
            onMouseEnter={e => { e.currentTarget.style.background = `${c}14` }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            View Full Menu →
          </Link>
        </div>
      </section>

      {/* ── Why Order Direct? ─────────────────────────── */}
      <section style={{ padding: '0 20px 72px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            fontFamily:   "'Barlow Condensed', sans-serif",
            fontSize:      '11px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color:         c,
            marginBottom:  '8px',
          }}>
            The Difference
          </div>
          <h2 style={{
            fontFamily:   "'Bebas Neue', sans-serif",
            fontSize:      'clamp(32px, 6vw, 56px)',
            letterSpacing: '3px',
            lineHeight:    1,
          }}>
            WHY ORDER DIRECT?
          </h2>
        </div>

        {/* 2x2 grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap:                 '12px',
        }}>
          {PERKS.map(({ icon, title, desc }) => (
            <div
              key={title}
              style={{
                background:   '#141414',
                border:       '1px solid #1e1e1e',
                borderRadius: '12px',
                padding:      'clamp(20px, 3vw, 28px)',
                transition:   'border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${c}44`; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
              <div style={{
                fontFamily:   "'Bebas Neue', sans-serif",
                fontSize:      '20px',
                letterSpacing: '2px',
                marginBottom:  '6px',
                color:         '#F5F5F5',
              }}>
                {title}
              </div>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────── */}
      <section style={{ padding: '0 20px 72px' }}>
        <div style={{
          maxWidth:     '860px',
          margin:       '0 auto',
          background:   `linear-gradient(135deg, ${c}18 0%, #111 100%)`,
          border:       `1px solid ${c}30`,
          borderRadius: '16px',
          padding:      'clamp(32px, 5vw, 56px)',
          textAlign:    'center',
          boxShadow:    `0 0 80px ${c}0a`,
        }}>
          <div style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          '8px',
            background:   `${c}18`,
            border:       `1px solid ${c}30`,
            borderRadius: '100px',
            padding:      '5px 14px',
            marginBottom: '20px',
            fontFamily:   "'Barlow Condensed', sans-serif",
            fontSize:      '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color:         c,
          }}>
            🔥 Ready When You Are
          </div>
          <h2 style={{
            fontFamily:   "'Bebas Neue', sans-serif",
            fontSize:      'clamp(30px, 6vw, 56px)',
            letterSpacing: '3px',
            lineHeight:    1,
            marginBottom:  '12px',
          }}>
            HUNGRY? WE'RE OUT THERE.
          </h2>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '32px' }}>
            Check today's location · Order ahead · Skip the line
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/foodtruck/location" style={{
              background:    'rgba(255,255,255,0.06)',
              color:         '#F5F5F5',
              border:        '1px solid #2a2a2a',
              borderRadius:  '8px',
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '15px',
              fontWeight:     600,
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              textDecoration: 'none',
              padding:        '14px 28px',
              whiteSpace:     'nowrap',
              transition:     'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c; e.currentTarget.style.color = c }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#F5F5F5' }}
            >
              Find Us →
            </Link>
            <Link to="/foodtruck/order" style={{
              background:    c,
              color:         '#0f0f0f',
              border:        'none',
              borderRadius:  '8px',
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontSize:       '15px',
              fontWeight:     700,
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              textDecoration: 'none',
              padding:        '14px 32px',
              whiteSpace:     'nowrap',
              boxShadow:      `0 0 32px ${c}30`,
              transition:     'transform 0.15s, opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
