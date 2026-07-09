import React, { useState, useEffect, useTransition, lazy, Suspense } from "react"
import { SmoothScrolling } from "./components/SmoothScrolling"
import { Preloader } from "./components/Preloader"
import { useAppStore } from "./store"

import { CustomCursor } from "./components/CustomCursor"
import CookieBanner from "./components/CookieBanner"
import Navbar from "./sections/Navbar"
import Footer from "./sections/Footer"
import { onRouteChange } from "./lib/router"

// Lazy-load page chunks to reduce initial bundle size
// Lazy-load Home page only
const HomePage = lazy(() => import("./pages/HomePage"))
// Import MenuPage directly to avoid blank screen on navigation
import MenuPage from "./pages/MenuPage"

export default function App() {
  const isLoading = useAppStore((state) => state.isLoading)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [isPending, startTransition] = useTransition()

  const [initialPath] = useState(window.location.pathname)

  useEffect(() => {
    // Subscribe to both programmatic navigation AND browser back/forward
    const unsubscribe = onRouteChange((path) => {
      // Use concurrent rendering: this keeps the old page visible and
      // interactive while the new lazy chunk downloads and renders in the background.
      startTransition(() => {
        setCurrentPath(path)
      })
    })
    return unsubscribe
  }, [])

  // Scroll to top ONLY after the new page is fully committed to the DOM.
  // This prevents the screen from jumping to the top of the old, unmounted layout.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPath])

  return (
    <SmoothScrolling>
      <div className="relative min-h-screen bg-brand-beige overflow-hidden">
        {/* Preloader — overlays everything on initial load */}
        <Preloader />

        {/* Cinematic custom cursor */}
        <CustomCursor />



        {/* Floating Utilities */}
        <CookieBanner />

        {/* Page structure */}
        <Navbar />

        {/* Top-level suspense acts as a fail-safe, but with startTransition, 
            React typically suspends in the background and keeps the old UI intact. */}
        <Suspense fallback={null}>
          <div style={{ opacity: isPending ? 0.8 : 1, transition: 'opacity 0.2s' }}>
            {currentPath.startsWith("/menu") ? <MenuPage /> : <HomePage />}
          </div>
        </Suspense>

        <Footer />
      </div>
    </SmoothScrolling>
  )
}

