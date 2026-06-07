import { RESTAURANT_CONFIG as C } from './config'

export default function RestaurantGallery() {
  return (
    <div className="page">
      <div className="sec-header">
        <p className="sec-label">A Look Inside</p>
        <h1 className="sec-title">Gallery</h1>
        <p className="sec-desc">A taste of the food and atmosphere at {C.name}.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {C.galleryImages.map((src, i) => (
          <div key={i} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '4/3' }}>
            <img src={src} alt={`${C.name} dish ${i + 1}`} loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
