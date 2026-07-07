import React from "react"
import { SmoothScrolling } from "./components/SmoothScrolling"
import { Preloader } from "./components/Preloader"
import { CustomCursor } from "./components/CustomCursor"
import CookieBanner from "./components/CookieBanner"
import Navbar from "./sections/Navbar"
import Hero from "./sections/Hero"
import MainContent from "./sections/MainContent"
import Footer from "./sections/Footer"

export default function App() {
  return (
    <SmoothScrolling>
      <div className="relative min-h-screen bg-brand-beige overflow-hidden">
        {/* Cinematic custom cursor */}
        <CustomCursor />

        {/* Global preloader overlay */}
        <Preloader />

        {/* Floating Utilities */}
        <CookieBanner />

        {/* Page structure */}
        <Navbar />
        <Hero />
        <MainContent />
        <Footer />
      </div>
    </SmoothScrolling>
  )
}
