// src/App.jsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'
import ScrollToTop from './components/ScrollToTop'

// ── Barber demo (unchanged) ──────────────────────────────────
import Nav from './components/Nav'
import Footer from './components/Footer'
import Portfolio from './pages/Portfolio'
import Barbers from './pages/Barbers'
import Services from './pages/Services'
import Book from './pages/Book'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

// ── Barber demo (rebuilt, namespaced) ────────────────────────
import BarberNav      from './components/barber/BarberNav'
import BarberFooter   from './components/barber/BarberFooter'
import BarberHome     from './pages/barber/BarberHome'
import BarberLogin    from './pages/barber/BarberLogin'
import BarberRegister from './pages/barber/BarberRegister'
import BarberProfile  from './pages/barber/BarberProfile'
import BarberAdmin    from './pages/barber/BarberAdmin'

// ── Food truck demo (new) ────────────────────────────────────
import FoodTruckNav     from './components/foodtruck/FoodTruckNav'
import FoodTruckFooter  from './components/foodtruck/FoodTruckFooter'
import FoodTruckHome    from './pages/foodtruck/FoodTruckHome'
import FoodTruckMenu    from './pages/foodtruck/FoodTruckMenu'
import FoodTruckOrder   from './pages/foodtruck/FoodTruckOrder'
import FoodTruckLocation from './pages/foodtruck/FoodTruckLocation'
import FoodTruckLogin   from './pages/foodtruck/FoodTruckLogin'
import FoodTruckRegister from './pages/foodtruck/FoodTruckRegister'
import FoodTruckProfile from './pages/foodtruck/FoodTruckProfile'
import FoodTruckAdmin   from './pages/foodtruck/FoodTruckAdmin'

// ── Restaurant demo (new) ────────────────────────────────────
import RestaurantNav      from './components/restaurant/RestaurantNav'
import RestaurantFooter   from './components/restaurant/RestaurantFooter'
import RestaurantHome     from './pages/restaurant/RestaurantHome'
import RestaurantMenu     from './pages/restaurant/RestaurantMenu'
import RestaurantOrder    from './pages/restaurant/RestaurantOrder'
import RestaurantGallery  from './pages/restaurant/RestaurantGallery'
import RestaurantLocation from './pages/restaurant/RestaurantLocation'
import RestaurantLogin    from './pages/restaurant/RestaurantLogin'
import RestaurantRegister from './pages/restaurant/RestaurantRegister'
import RestaurantProfile  from './pages/restaurant/RestaurantProfile'
import RestaurantAdmin    from './pages/restaurant/RestaurantAdmin'

// ── Barber shell (unchanged) ─────────────────────────────────
function Shell({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}>
      <Nav />
      <main style={{ flex: 1, paddingTop: '64px' }}>{children}</main>
      <Footer />
    </div>
  )
}

// ── Barber shell (rebuilt) ───────────────────────────────────
function BarberShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
      <BarberNav />
      <main style={{ flex: 1 }}>{children}</main>
      <BarberFooter />
    </div>
  )
}

// ── Food truck shell (new) ───────────────────────────────────
function FoodTruckShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}>
      <FoodTruckNav />
      <main style={{ flex: 1, paddingTop: '64px' }}>{children}</main>
      <FoodTruckFooter />
    </div>
  )
}

// ── Restaurant shell (new) ───────────────────────────────────
function RestaurantShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}>
      <RestaurantNav />
      <main style={{ flex: 1, paddingTop: '64px' }}>{children}</main>
      <RestaurantFooter />
    </div>
  )
}

// ── Barber protected (unchanged) ─────────────────────────────
function Protected({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

// ── Barber protected (rebuilt) ───────────────────────────────
function BarberProtected({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return null
  return user ? children : <Navigate to="/barber/login" replace />
}

function BarberAdminProtected({ children }) {
  const { user, profile, loading } = useAuthStore()
  if (loading) return null
  if (!user) return <Navigate to="/barber/login" replace />
  if (profile && profile.role !== 'admin') return <Navigate to="/barber" replace />
  return children
}

// ── Food truck protected (new) ───────────────────────────────
function FoodTruckProtected({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return null
  return user ? children : <Navigate to="/foodtruck/login" replace />
}

// ── Restaurant protected (new) ───────────────────────────────
function RestaurantProtected({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return null
  return user ? children : <Navigate to="/restaurant/login" replace />
}

function FoodTruckAdminProtected({ children }) {
  const { user, profile, loading } = useAuthStore()
  if (loading) return null
  if (!user) return <Navigate to="/foodtruck/login" replace />
  if (profile && profile.role !== 'admin') return <Navigate to="/foodtruck" replace />
  return children
}

function RestaurantAdminProtected({ children }) {
  const { user, profile, loading } = useAuthStore()
  if (loading) return null
  if (!user) return <Navigate to="/restaurant/login" replace />
  if (profile && profile.role !== 'admin') return <Navigate to="/restaurant" replace />
  return children
}

// ── App ──────────────────────────────────────────────────────
export default function App() {
  const { setUser, setSession, setLoading } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [setUser, setSession, setLoading])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#161616', color: '#F5F5F5',
            border: '1px solid #222', fontFamily: "'Barlow', sans-serif",
          },
          success: { iconTheme: { primary: '#D4AF37', secondary: '#0A0A0A' } },
        }}
      />
      <Routes>

        {/* ── Portfolio (unchanged) ──────────────────── */}
        <Route path="/" element={<Portfolio />} />

        {/* ── Barber demo (rebuilt — premium showcase) ── */}
        <Route path="/barber"          element={<BarberShell><BarberHome /></BarberShell>} />
        <Route path="/barber/login"    element={<BarberShell><BarberLogin /></BarberShell>} />
        <Route path="/barber/register" element={<BarberShell><BarberRegister /></BarberShell>} />
        <Route path="/barber/profile"  element={
          <BarberProtected><BarberShell><BarberProfile /></BarberShell></BarberProtected>
        } />
        <Route path="/barber/admin"    element={
          <BarberAdminProtected><BarberShell><BarberAdmin /></BarberShell></BarberAdminProtected>
        } />

        {/* ── Old shared barber routes (legacy/orphaned — kept harmless, no longer linked from new demo) ── */}
        <Route path="/barbers"  element={<Shell><Barbers /></Shell>} />
        <Route path="/services" element={<Shell><Services /></Shell>} />
        <Route path="/book"     element={<Shell><Book /></Shell>} />
        <Route path="/login"    element={<Shell><Login /></Shell>} />
        <Route path="/register" element={<Shell><Register /></Shell>} />
        <Route path="/profile"  element={
          <Protected><Shell><Profile /></Shell></Protected>
        } />

        {/* ── Food truck demo (new) ──────────────────── */}
        <Route path="/foodtruck"          element={<FoodTruckShell><FoodTruckHome /></FoodTruckShell>} />
        <Route path="/foodtruck/menu"     element={<FoodTruckShell><FoodTruckMenu /></FoodTruckShell>} />
        <Route path="/foodtruck/order"    element={<FoodTruckShell><FoodTruckOrder /></FoodTruckShell>} />
        <Route path="/foodtruck/location" element={<FoodTruckShell><FoodTruckLocation /></FoodTruckShell>} />
        <Route path="/foodtruck/login"    element={<FoodTruckShell><FoodTruckLogin /></FoodTruckShell>} />
        <Route path="/foodtruck/register" element={<FoodTruckShell><FoodTruckRegister /></FoodTruckShell>} />
        <Route path="/foodtruck/profile"  element={
          <FoodTruckProtected>
            <FoodTruckShell><FoodTruckProfile /></FoodTruckShell>
          </FoodTruckProtected>
        } />
        <Route path="/foodtruck/admin"    element={
          <FoodTruckAdminProtected><FoodTruckShell><FoodTruckAdmin /></FoodTruckShell></FoodTruckAdminProtected>
        } />

        {/* ── Restaurant demo (new) ──────────────────── */}
        <Route path="/restaurant"          element={<RestaurantShell><RestaurantHome /></RestaurantShell>} />
        <Route path="/restaurant/menu"     element={<RestaurantShell><RestaurantMenu /></RestaurantShell>} />
        <Route path="/restaurant/order"    element={<RestaurantShell><RestaurantOrder /></RestaurantShell>} />
        <Route path="/restaurant/gallery"  element={<RestaurantShell><RestaurantGallery /></RestaurantShell>} />
        <Route path="/restaurant/location" element={<RestaurantShell><RestaurantLocation /></RestaurantShell>} />
        <Route path="/restaurant/login"    element={<RestaurantShell><RestaurantLogin /></RestaurantShell>} />
        <Route path="/restaurant/register" element={<RestaurantShell><RestaurantRegister /></RestaurantShell>} />
        <Route path="/restaurant/profile"  element={
          <RestaurantProtected><RestaurantShell><RestaurantProfile /></RestaurantShell></RestaurantProtected>
        } />
        <Route path="/restaurant/admin"    element={
          <RestaurantAdminProtected><RestaurantShell><RestaurantAdmin /></RestaurantShell></RestaurantAdminProtected>
        } />

        {/* ── Fallback (unchanged) ───────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}