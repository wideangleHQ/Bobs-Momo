import React, { useState, useEffect } from "react"

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 bg-brand-charcoal text-brand-beige p-6 border border-brand-beige/10 max-w-sm z-50 shadow-2xl font-mono text-[11px] leading-relaxed flex flex-col space-y-4">
      <p>
        WE USE COOKIES TO ENHANCE YOUR SMASHED BURGER ORDERING EXPERIENCE. BY CONTINUOUS BROWSING, YOU ACCEPT OUR COOKIES.
      </p>
      <button
        onClick={accept}
        className="bg-brand-red text-brand-beige py-2.5 font-bold tracking-widest uppercase hover:bg-brand-beige hover:text-brand-charcoal transition-colors duration-300"
        data-cursor="pointer"
      >
        I ACCEPT
      </button>
    </div>
  )
}
