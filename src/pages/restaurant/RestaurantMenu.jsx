import { RESTAURANT_CONFIG as C } from './config'

export default function RestaurantMenu() {
  return (
    <div className="page">
      <div className="sec-header">
        <p className="sec-label">Fresh Daily</p>
        <h1 className="sec-title">Our Menu</h1>
        <p className="sec-desc">{C.tagline}</p>
      </div>

      {Object.entries(C.menu).map(([category, items]) => (
        <div key={category} style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2, color: C.accentColor,
            borderBottom: `1px solid ${C.accentColor}33`, paddingBottom: 10, marginBottom: 18,
          }}>{category}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {items.map(({ name, desc, price }) => (
              <div key={name} className="card" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, color: C.accentColor, whiteSpace: 'nowrap' }}>
                  ${price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
