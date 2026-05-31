import { Link } from 'react-router-dom'

const DEMOS = [
  {
    id: 1,
    industry: 'Barbershop',
    name: 'Premier Barbershop',
    desc: 'Full booking app with barber profiles, services, loyalty punch card, and customer accounts.',
    features: ['Online Booking', 'Barber Profiles', 'Loyalty System', 'Customer Accounts'],
    link: '/barber',
    status: 'Live Demo',
  },
  {
    id: 2,
    industry: 'Food Truck',
    name: "Moe's Food Truck",
    desc: 'Mobile ordering, menu management, location tracking, and loyalty rewards for food truck businesses.',
    features: ['Mobile Ordering', 'Menu Management', 'Location Tracking', 'Loyalty Rewards'],
    link: '/foodtruck',
    status: 'Live Demo',
  },
]

const PROBLEMS = [
  { num: '01', title: 'No Digital Presence', desc: 'Customers cannot find you or book online.' },
  { num: '02', title: 'Bad UI', desc: 'Generic templates that look cheap and confuse customers.' },
  { num: '03', title: 'Overpriced', desc: 'Agencies charging $5,000+ for what we build in days.' },
  { num: '04', title: 'Shared Marketplaces', desc: 'Vagaro shows your competitors right next to you.' },
]

export default function Portfolio() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#F5F5F5', fontFamily: "'Barlow', sans-serif" }}>

      {/* ── Nav ───────────────────────────────────────── */}
      <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', letterSpacing: '4px', color: '#D4AF37' }}>MOE BUILDS CO.</div>
        <a href="mailto:moebuildsco@gmail.com?subject=I want to build an app" style={{ fontFamily: "'Barlow Condensed'", fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', padding: '8px 16px', textDecoration: 'none' }}>
          Let's Build
        </a>
      </div>

      {/* ── Hero ──────────────────────────────────────── */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 32px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a1a1a, #252525)', border: '2px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', overflow: 'hidden', fontFamily: "'Bebas Neue'", fontSize: '32px', color: 'rgba(212,175,55,0.4)' }}>
          MC
        </div>

        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '18px', letterSpacing: '3px', color: '#F5F5F5', marginBottom: '4px' }}>MOSES CADENA</div>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '24px' }}>Founder · Moe Builds Co.</div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '100px', padding: '6px 16px', marginBottom: '20px', fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#D4AF37' }}>
          ✦ San Antonio, TX · Custom App Development
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(48px, 10vw, 96px)', letterSpacing: '4px', lineHeight: 0.95, marginBottom: '20px' }}>
          BUILT FOR<br />
          <span style={{ color: '#D4AF37' }}>SAN ANTONIO.</span><br />
          BY SAN ANTONIO.
        </h1>

        <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#BBBBBB', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.6, fontFamily: "'Barlow Condensed'", letterSpacing: '1px' }}>
          Custom apps for local businesses that want to<br />
          <span style={{ color: '#D4AF37', fontWeight: 700 }}>own their brand — not rent it.</span>
        </p>

        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
          {[['$1,000', 'Starting Price'], ['$100/mo', 'Maintenance'], ['3-5 Days', 'Avg Delivery']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '32px', letterSpacing: '2px', color: '#D4AF37', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginTop: '4px' }}>{l}</div>
            </div>
          ))}
        </div>

        <a href="#demos" style={{ background: '#D4AF37', color: '#0A0A0A', borderRadius: '6px', fontFamily: "'Barlow Condensed'", fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', padding: '14px 40px' }}>
          View Demos →
        </a>
      </div>

      {/* ── About ─────────────────────────────────────── */}
      <div style={{ padding: '0 32px 60px', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', margin: '0 auto 28px' }} />
        <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.8, marginBottom: '16px' }}>
          San Antonio native. Builder. Operator. I started Moe Builds Co. because I saw local businesses getting overcharged and underserved by agencies that did not understand their community.
        </p>
        <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.8 }}>
          I build custom apps that local businesses in San Antonio own outright — no marketplaces, no monthly platform fees, no sharing your customers with competitors. Just your brand, your clients, your app.
        </p>
        <div style={{ width: '60px', height: '1px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', margin: '28px auto 0' }} />
      </div>

      {/* ── 4 Problems ────────────────────────────────── */}
      <div style={{ padding: '0 32px 60px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#D4AF37', textAlign: 'center', marginBottom: '24px' }}>— Problems We Solve —</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {PROBLEMS.map(p => (
            <div key={p.num} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '13px', letterSpacing: '2px', color: '#D4AF37', marginBottom: '6px' }}>{p.num}</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '16px', letterSpacing: '1.5px', marginBottom: '6px' }}>{p.title}</div>
              <p style={{ fontSize: '12px', color: '#444', lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Demos ─────────────────────────────────────── */}
      <div id="demos" style={{ padding: '60px 32px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#D4AF37', textAlign: 'center', marginBottom: '16px' }}>— Live Demos —</div>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: '3px', textAlign: 'center', marginBottom: '40px' }}>SEE IT IN ACTION</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {DEMOS.map(demo => (
            <div key={demo.id} style={{ background: '#161616', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', padding: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '100px', padding: '3px 10px', fontFamily: "'Barlow Condensed'", fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#D4AF37' }}>
                {demo.status}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>{demo.industry}</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '28px', letterSpacing: '2px', marginBottom: '10px' }}>{demo.name}</div>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, marginBottom: '20px' }}>{demo.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {demo.features.map(f => (
                  <span key={f} style={{ fontFamily: "'Barlow Condensed'", fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#555', background: '#111', border: '1px solid #222', borderRadius: '4px', padding: '4px 8px' }}>{f}</span>
                ))}
              </div>
              <Link to={demo.link} style={{ display: 'block', textAlign: 'center', fontFamily: "'Barlow Condensed'", fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', color: '#0A0A0A', background: '#D4AF37', borderRadius: '4px', padding: '12px' }}>
                View Live Demo →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact CTA ───────────────────────────────── */}
      <div style={{ padding: '0 32px 60px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #161616, #1a1a1a)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '36px', textAlign: 'center', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(22px, 4vw, 32px)', letterSpacing: '3px', lineHeight: 1, marginBottom: '6px' }}>READY TO OWN YOUR APP?</div>
            <p style={{ color: '#555', fontSize: '13px', lineHeight: 1.5 }}>$500 deposit. Live in days. You own everything.</p>
          </div>
          <a href="mailto:moebuildsco@gmail.com?subject=I want to build an app" style={{ background: '#D4AF37', color: '#0A0A0A', borderRadius: '6px', fontFamily: "'Barlow Condensed'", fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', padding: '14px 32px', whiteSpace: 'nowrap' }}>
            Let's Build →
          </a>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #1a1a1a', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: '11px', color: '#333' }}>© {new Date().getFullYear()} Moe Builds Co. · San Antonio, TX</p>
        <p style={{ fontSize: '11px', color: '#333' }}>Built for San Antonio. By San Antonio.</p>
      </div>

    </div>
  )
}
