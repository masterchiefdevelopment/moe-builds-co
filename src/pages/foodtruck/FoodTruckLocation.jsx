import { Link } from 'react-router-dom'

const SCHEDULE = [
  { day: 'Monday',    location: 'Pearl Brewery District',     address: '312 Pearl Pkwy San Antonio TX 78215',            hours: '11:00 AM - 7:00 PM', status: 'regular' },
  { day: 'Tuesday',   location: 'Southtown Arts District',    address: 'S Alamo St and Wickes Ave San Antonio TX 78210', hours: '11:00 AM - 7:00 PM', status: 'regular' },
  { day: 'Wednesday', location: 'UTSA Main Campus',           address: '1 UTSA Circle San Antonio TX 78249',             hours: '10:30 AM - 3:00 PM', status: 'regular' },
  { day: 'Thursday',  location: 'Alamo Heights',              address: 'Broadway St and Sunset Rd San Antonio TX 78209', hours: '11:00 AM - 7:00 PM', status: 'regular' },
  { day: 'Friday',    location: 'Downtown Main Plaza',        address: 'Main Plaza San Antonio TX 78205',                hours: '11:00 AM - 9:00 PM', status: 'regular' },
  { day: 'Saturday',  location: 'San Antonio Farmers Market', address: '302 Produce Row San Antonio TX 78207',           hours: '9:00 AM - 3:00 PM',  status: 'special' },
  { day: 'Sunday',    location: 'Brackenridge Park',          address: '3700 N St Marys St San Antonio TX 78212',        hours: '11:00 AM - 6:00 PM', status: 'regular' },
]

const DAYS       = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TODAY      = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
const TODAY_SPOT = SCHEDULE.find(s => s.day === TODAY)

export default function FoodTruckLocation() {
  return (
    <div style={{ minHeight: '100vh', padding: '80px 20px 60px', maxWidth: '1100px', margin: '0 auto' }}>

      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 8vw, 80px)', letterSpacing: '4px', lineHeight: 1, marginBottom: '12px' }}>
          FIND THE <span style={{ color: '#FF6B2B' }}>TRUCK</span>
        </h1>
        <p style={{ color: '#555', fontSize: '14px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
          We move around San Antonio daily. Check today stop before you roll out.
        </p>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a1008, #1a1a1a)', border: '1px solid rgba(255,107,43,0.3)', borderRadius: '12px', padding: 'clamp(24px, 4vw, 40px)', marginBottom: '40px' }}>
        <div style={{ color: '#FF6B2B', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Live Now - {TODAY}
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '3px', lineHeight: 1, marginBottom: '10px' }}>
          {TODAY_SPOT.location}
        </div>
        <div style={{ color: '#888', fontSize: '14px', marginBottom: '4px' }}>
          {TODAY_SPOT.address}
        </div>
        <div style={{ color: '#555', fontSize: '13px', marginBottom: '24px' }}>
          {TODAY_SPOT.hours}
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link to="/foodtruck/order" style={{ background: '#FF6B2B', color: '#0A0A0A', borderRadius: '6px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', padding: '12px 20px' }}>
            Order Ahead
          </Link>
        </div>
        <div style={{ width: '100%', height: '200px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>🚚</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '2px' }}>{TODAY_SPOT.location}</div>
          <div style={{ fontSize: '12px', color: '#555' }}>{TODAY_SPOT.address}</div>
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '3px', marginBottom: '20px' }}>WEEKLY SCHEDULE</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SCHEDULE.map(stop => {
            const isToday = stop.day === TODAY
            return (
              <div key={stop.day} style={{ background: isToday ? 'rgba(255,107,43,0.06)' : '#161616', border: '1px solid ' + (isToday ? 'rgba(255,107,43,0.35)' : '#1f1f1f'), borderRadius: '8px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '2px', color: isToday ? '#FF6B2B' : '#555', minWidth: '100px' }}>
                  {stop.day}
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '15px', fontWeight: 600, color: isToday ? '#F5F5F5' : '#CCC', marginBottom: '2px' }}>{stop.location}</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{stop.address}</div>
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', color: isToday ? '#FF6B2B' : '#555', whiteSpace: 'nowrap' }}>
                  {stop.hours}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ background: '#161616', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '28px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '3px', marginBottom: '6px' }}>NEVER MISS THE TRUCK</div>
          <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.5 }}>Follow us on Instagram for real-time updates and daily specials.</p>
        </div>
        <Link to="/foodtruck/order" style={{ background: '#FF6B2B', color: '#0A0A0A', borderRadius: '6px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', padding: '12px 22px' }}>
          Order Ahead
        </Link>
      </div>

    </div>
  )
}
