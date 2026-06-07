import { useEffect } from 'react'
import { RESTAURANT_CONFIG as C } from '../../pages/restaurant/config'

const COMING_SOON = [
  { title: 'Promo Codes & Discount System', price: 'Ask for pricing' },
  { title: 'Online Reservation System', price: 'Ask for pricing' },
  { title: 'Third-party delivery links (DoorDash, Uber Eats)', price: '$50 add-on' },
]

const ADDONS = [
  { name: 'Custom domain setup', price: '$50' },
  { name: 'Rush delivery', price: '+$200' },
  { name: 'Extra revision round', price: '$75' },
  { name: 'Extra page', price: '$75' },
  { name: 'Logo design', price: '$100' },
  { name: 'Stripe payment integration', price: '$300' },
  { name: 'Professional photo shoot', price: '$75–$200' },
]

export default function AddOnsDrawer({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s',
      }} />
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 201, maxHeight: '88vh', overflowY: 'auto',
        background: C.bgSecondary, borderTop: `1px solid ${C.borderSubtle}`, borderRadius: '20px 20px 0 0',
        padding: '28px 24px 40px', transform: open ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 34px)', color: C.textPrimary, fontWeight: 700 }}>
              Upgrade Your App
            </h2>
            <button type="button" onClick={onClose} aria-label="Close" style={{
              background: 'transparent', border: `1px solid ${C.borderSubtle}`, color: C.textPrimary, borderRadius: '50%',
              width: 36, height: 36, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>

          {/* Coming Soon */}
          <div style={{ marginBottom: 36 }}>
            <span style={{
              display: 'inline-block', fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
              fontWeight: 700, color: '#0A0A0A', background: C.accentColor, borderRadius: 100, padding: '5px 14px', marginBottom: 16,
            }}>🔜 Coming Soon</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              {COMING_SOON.map(({ title, price }) => (
                <div key={title} style={{
                  background: C.bgCard, border: `1px solid ${C.borderSubtle}`, borderRadius: 12, padding: 18,
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: C.accentColor, fontSize: 16 }}>🔒</span>
                    <span style={{ color: C.textPrimary, fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{title}</span>
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.accentColor }}>{price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Add-ons */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.textPrimary, marginBottom: 14 }}>Available Add-Ons</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ADDONS.map(({ name, price }) => (
                <div key={name} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: `1px solid ${C.borderSubtle}`, padding: '12px 4px',
                }}>
                  <span style={{ color: C.textSecondary, fontSize: 14 }}>{name}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: C.accentColor, fontSize: 14, whiteSpace: 'nowrap' }}>{price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
