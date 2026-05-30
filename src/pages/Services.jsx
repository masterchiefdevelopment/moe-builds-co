import { Link } from 'react-router-dom'

const SERVICES = [
  { name: 'Skin Fade',        price: '$30', time: '45 min', desc: 'Clean bald or low fade with razor finish', popular: true },
  { name: 'Full Haircut',     price: '$25', time: '40 min', desc: 'Cut and style, any length or texture' },
  { name: 'Lineup / Edge Up', price: '$15', time: '20 min', desc: 'Crisp edges, temples, and neck cleanup' },
  { name: 'Beard Trim',       price: '$15', time: '20 min', desc: 'Shape, trim, and edge your beard' },
  { name: 'Cut + Beard',      price: '$40', time: '60 min', desc: 'Full service — haircut and beard combo', popular: true },
  { name: "Kid's Cut",        price: '$20', time: '30 min', desc: 'Ages 10 and under' },
  { name: 'Hot Towel Shave',  price: '$25', time: '30 min', desc: 'Classic straight razor shave with hot towel' },
  { name: 'Design / Part',    price: '$10', time: '15 min', desc: 'Custom lines, parts, or hair design add-on' },
]

export default function Services() {
  return (
    <div className="page">
      <div className="sec-header">
        <div className="sec-label">Menu</div>
        <h1 className="sec-title">SERVICES & PRICING</h1>
        <p className="sec-desc">Straightforward pricing. No surprises. Always quality.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px', marginBottom: '40px' }}>
        {SERVICES.map((s, i) => (
          <div key={s.name} className={`card fade-up d${Math.min(i + 1, 5)}`} style={{
            padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', overflow: 'hidden',
          }}>
            {s.popular && (
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '100px', padding: '2px 8px',
                fontFamily: "'Barlow Condensed'", fontSize: '10px', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: '#D4AF37',
              }}>Popular</div>
            )}
            <div style={{ flex: 1, paddingRight: '16px' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '22px', letterSpacing: '1.5px', marginBottom: '4px' }}>{s.name}</div>
              <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.5, marginBottom: '6px' }}>{s.desc}</p>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '1px', color: '#444' }}>⏱ {s.time}</div>
            </div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '30px', letterSpacing: '1px', color: '#D4AF37', whiteSpace: 'nowrap' }}>{s.price}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <Link to="/book" className="btn-primary" style={{ fontSize: '16px', padding: '16px 48px' }}>Book Your Service →</Link>
      </div>
    </div>
  )
}
