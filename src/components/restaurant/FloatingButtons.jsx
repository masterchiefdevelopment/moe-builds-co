import { useEffect, useState } from 'react'
import { RESTAURANT_CONFIG as C } from '../../pages/restaurant/config'

export default function FloatingButtons({ onOpenAddOns }) {
  const [pastHero, setPastHero] = useState(false)
  const [pastFold, setPastFold] = useState(false)

  useEffect(() => {
    const fn = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.8)
      setPastFold(window.scrollY > 400)
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <button type="button" onClick={onOpenAddOns} style={{
        position: 'fixed', right: 20, bottom: 20, zIndex: 90,
        background: C.accentColor, color: '#0A0A0A', border: 'none', borderRadius: 100,
        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1,
        padding: '12px 22px', cursor: 'pointer', boxShadow: '0 6px 24px rgba(201,162,39,0.35)',
        opacity: pastHero ? 1 : 0, transform: pastHero ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.94)',
        pointerEvents: pastHero ? 'auto' : 'none', transition: 'all 0.3s',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = pastHero ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.94)'}
      >See Add-Ons ✦</button>

      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" style={{
        position: 'fixed', right: 20, bottom: pastHero ? 76 : 20, zIndex: 89,
        width: 44, height: 44, borderRadius: '50%', background: C.bgCard, color: C.accentColor,
        border: `1px solid ${C.borderSubtle}`, fontSize: 18, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: pastFold ? 1 : 0, transform: pastFold ? 'scale(1)' : 'scale(0.8)',
        pointerEvents: pastFold ? 'auto' : 'none', transition: 'all 0.25s',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = pastFold ? 'scale(1)' : 'scale(0.8)'}
      >↑</button>
    </>
  )
}
