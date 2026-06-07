import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Browsers preserve scroll position across client-side route changes,
// which makes navigating to a shorter page look like it "jumped to the bottom".
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
