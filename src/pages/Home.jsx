import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '✂', title: 'Expert Cuts',      desc: 'Every barber is a specialist. No bad cuts here.' },
  { icon: '📅', title: 'Easy Booking',     desc: 'Book online in seconds, no back-and-forth.' },
  { icon: '💈', title: 'Walk-Ins Welcome', desc: 'Pull up anytime. We will get you right.' },
  { icon: '⭐', title: 'Loyalty Rewards',  desc: 'Earn points every visit. 10 cuts = free lineup.' },
]

export default function Home() {
  return (
    <div>
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 20px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 80% 55% at 50% 40%, rgba(212,175,55,0.07) 0%, transparent 70%)`,
        }} />

        <div className="fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(212,175,55,0.3)', borderRadius: '100px',
          padding: '6px 16px', marginBottom: '28px',
          fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '2px',
          textTransform: 'uppercase', color: '#D4AF37',
        }}>
          ✦ San Antonio's Premier Barbershop
        </div>

        <h1 className="fade-up d1" style={{
          fontFamily: "'Bebas Neue'",
          fontSize: 'clamp(54px, 13vw, 120px)',
          letterSpacing: '4px', lineHeight: 0.9, marginBottom: '20px',
        }}>
          ONE SHOP.<br />
          <span style={{ color: '#D4AF37' }}>ONE APP.</span><br />
          ALL BARBERS.
        </h1>

        <p className="fade-up d2" style={{
          fontFamily: "'Barlow Condensed'", fontSize: 'clamp(16px, 3.5vw, 24px)',
          letterSpacing: '4px', textTransform: 'uppercase',
          color: '#555', marginBottom: '14px',
        }}>
          Premier Barbershop
        </p>

        <p className="fade-up d3" style={{
          fontSize: '15px', color: '#666', maxWidth: '400px',
          marginBottom: '40px', lineHeight: 1.7,
        }}>
          <strong style={{ color: '#D4AF37' }}>Walk-ins always welcome.</strong> Book your barber online or pull up — we got you every time.
        </p>

        <div className="fade-up d4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '64px' }}>
          <Link to="/book"    className="btn-primary">Book Now</Link>
          <Link to="/barbers" className="btn-outline">Meet the Barbers</Link>
        </div>

        <div className="fade-up d5" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['4+', 'Master Barbers'], ['1', 'Unified App'], ['5★', 'Google Rating']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '44px', letterSpacing: '2px', color: '#D4AF37', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginTop: '4px' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ padding: '0 20px' }}><div className="gold-line" /></div>

      <section className="section">
        <div className="sec-header">
          <div className="sec-label">Why Us</div>
          <h2 className="sec-title">THE PLAYMAKERS WAY</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div key={title} className={`card fade-up d${i + 1}`} style={{ padding: '28px 24px' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '22px', letterSpacing: '2px', marginBottom: '8px' }}>{title}</div>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 20px 80px' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          background: 'linear-gradient(135deg, #161616 0%, #1a1a1a 100%)',
          border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px',
          padding: 'clamp(32px, 5vw, 64px)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
        }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(30px, 5vw, 52px)', letterSpacing: '3px', lineHeight: 1 }}>
              READY FOR YOUR BEST CUT?
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>Walk-ins welcome · Online booking available 24/7</p>
          </div>
          <Link to="/book" className="btn-primary" style={{ fontSize: '16px', padding: '16px 40px', whiteSpace: 'nowrap' }}>
            Book Appointment →
          </Link>
        </div>
      </section>
    </div>
  )
}
