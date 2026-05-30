// src/App.jsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'

// ── Barber demo (unchanged) ──────────────────────────────────
import Nav from './components/Nav'
import Footer from './components/Footer'
import Portfolio from './pages/Portfolio'
import Home from './pages/Home'
import Barbers from './pages/Barbers'
import Services from './pages/Services'
import Book from './pages/Book'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

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

// ── Barber protected (unchanged) ─────────────────────────────
function Protected({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

// ── Food truck protected (new) ───────────────────────────────
function FoodTruckProtected({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return null
  return user ? children : <Navigate to="/foodtruck/login" replace />
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

        {/* ── Barber demo (unchanged) ────────────────── */}
        <Route path="/barber"   element={<Shell><Home /></Shell>} />
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

        {/* ── Fallback (unchanged) ───────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}