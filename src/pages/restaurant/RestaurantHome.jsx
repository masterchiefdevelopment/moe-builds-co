import { Link } from 'react-router-dom'
import { RESTAURANT_CONFIG as C } from './config'

const COMING_SOON = [
  { title: 'Promo Codes & Discounts', desc: 'Custom discount codes and promotional campaigns for your customers.', price: 'Ask for pricing' },
  { title: 'Online Reservations', desc: 'Let guests book tables online with automatic confirmations.', price: 'Ask for pricing' },
  { title: 'Delivery Integrations', desc: 'Direct links to DoorDash and Uber Eats from your menu.', price: '$50 add-on' },
]

const ADDONS = [
  { name: 'Custom domain setup', price: '$50' },
  { name: 'Rush delivery', price: '+$200' },
  { name: 'Extra revision', price: '$75/round' },
  { name: 'Extra page', price: '$75' },
  { name: 'Logo design', price: '$100' },
  { name: 'Third-party delivery links', price: '$50' },
  { name: 'Stripe payment integration', price: '$300' },
  { name: 'Professional photo shoot', price: '$75–$200' },
  { name: 'Promo codes + discounts', price: 'Ask us (Coming Soon)' },
  { name: 'Online reservation system', price: 'Ask us (Coming Soon)' },
]

export default function RestaurantHome() {
  return (
    <div>
      {/* Hero */}
      <section className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '88vh' }}>
        <div className="fade-up" style={{
          width: 88, height: 88, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: C.primaryColor, color: C.accentColor, border: `2px solid ${C.accentColor}`,
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: 2, marginBottom: 24,
        }}>{C.logoText}</div>
        <h1 className="fade-up d1" style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px, 9vw, 92px)', letterSpacing: 4, lineHeight: 1.02,
        }}>{C.fullName}</h1>
        <p className="fade-up d2" style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 520, margin: '18px auto 0' }}>
          {C.tagline}
        </p>
        <div className="fade-up d3" style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/restaurant/order" className="btn-primary" style={{ background: C.accentColor }}>Order Now</Link>
          <Link to="/restaurant/menu" className="btn-outline">View Menu</Link>
        </div>
      </section>

      {/* Quick info strip */}
      <section style={{ borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', background: '#0d0d0d' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '28px 20px', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, textAlign: 'center',
        }}>
          {[
            { label: 'Address', value: C.address },
            { label: 'Phone', value: C.phone },
            { label: 'Today', value: C.hours[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].time },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: C.accentColor, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 14, color: '#ccc' }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section">
        <div className="sec-header">
          <p className="sec-label">What's Next</p>
          <h2 className="sec-title">Coming Soon</h2>
          <p className="sec-desc">Features available to add to your restaurant's platform.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {COMING_SOON.map(({ title, desc, price }) => (
            <div key={title} className="card" style={{ padding: 24, position: 'relative' }}>
              <span style={{
                position: 'absolute', top: 16, right: 16, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                fontFamily: "'Barlow Condensed', sans-serif", color: '#0A0A0A', background: C.accentColor,
                padding: '4px 10px', borderRadius: 4, fontWeight: 700,
              }}>Coming Soon</span>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 1, marginBottom: 8, paddingRight: 90 }}>{title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{desc}</p>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 1, color: C.accentColor }}>{price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons & pricing */}
      <section className="section" style={{ background: '#0d0d0d' }}>
        <div className="sec-header">
          <p className="sec-label">Customize Your Build</p>
          <h2 className="sec-title">Add-Ons & Pricing</h2>
          <p className="sec-desc">Optional extras available for this platform — pick what fits your business.</p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, maxWidth: 1000, margin: '0 auto',
        }}>
          {ADDONS.map(({ name, price }) => (
            <div key={name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px 20px',
            }}>
              <span style={{ fontSize: 14, color: '#ddd' }}>{name}</span>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 1, color: C.accentColor, whiteSpace: 'nowrap' }}>{price}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
