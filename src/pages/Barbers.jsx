import { Link } from 'react-router-dom'

const BARBERS = [
  { id: 1, name: 'Marcus',  specialty: 'Skin Fades & Designs',    exp: '8 yrs',  emoji: '✂' },
  { id: 2, name: 'Jordan',  specialty: 'Tapers & Beard Sculpt',   exp: '6 yrs',  emoji: '💈' },
  { id: 3, name: 'Devon',   specialty: 'Textured & Curly Cuts',   exp: '10 yrs', emoji: '⭐' },
  { id: 4, name: 'Xavier',  specialty: 'Classic & Modern Blends', exp: '5 yrs',  emoji: '🔥' },
]

function BarberCard({ barber, delay }) {
  return (
    <div className={`card fade-up d${delay}`}>
      <div style={{
        width: '100%', aspectRatio: '1',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #222 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        <span style={{ fontSize: '64px', opacity: 0.15 }}>{barber.emoji}</span>
        <div style={{
          position: 'absolute', bottom: '12px', right: '12px',
          fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '1.5px',
          textTransform: 'uppercase', color: '#555',
          background: '#111', border: '1px solid #222', borderRadius: '4px', padding: '4px 8px',
        }}>{barber.exp} exp</div>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '26px', letterSpacing: '2px', marginBottom: '4px' }}>{barber.name}</div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '12px', letterSpacing: '1px', color: '#666', marginBottom: '16px' }}>{barber.specialty}</div>
        <Link to="/book" style={{
          display: 'block', width: '100%', textAlign: 'center',
          fontFamily: "'Barlow Condensed'", fontSize: '12px', fontWeight: 700,
          letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
          color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', padding: '10px',
        }}>Book {barber.name} →</Link>
      </div>
    </div>
  )
}

export default function Barbers() {
  return (
    <div className="page">
      <div className="sec-header">
        <div className="sec-label">The Team</div>
        <h1 className="sec-title">OUR BARBERS</h1>
        <p className="sec-desc">Every barber is a specialist. Pick yours and book direct.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {BARBERS.map((b, i) => <BarberCard key={b.id} barber={b} delay={i + 1} />)}
      </div>
      <div style={{ textAlign: 'center', marginTop: '48px', padding: '28px', background: '#111', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '22px', letterSpacing: '2px', marginBottom: '8px' }}>NO PREFERENCE? NO PROBLEM.</div>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '16px' }}>Book with any available barber or just walk in.</p>
        <Link to="/book" className="btn-primary">Book Any Barber</Link>
      </div>
    </div>
  )
}
