import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function MenuHero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current) return
    gsap.fromTo(
      heroRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
  }, [])

  return (
    <div
      ref={heroRef}
      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-12 items-start mb-1 md:mb-4 text-left px-4 md:px-0"
    >
      {/* Left: Heading */}
      <div className="lg:col-span-7">
        <h1 className="font-display font-black text-brand-red uppercase leading-[0.9] tracking-tighter text-[11vw] sm:text-7xl lg:text-[7.5vw]">
          LOCAL, FRESH,<br />DAMN TASTY.
        </h1>
      </div>

      {/* Right: Description */}
      <div className="lg:col-span-5 lg:pt-3">
        <p className="font-sans text-[11px] sm:text-[13px] text-black uppercase tracking-normal leading-relaxed font-semibold max-w-lg">
          ALL OF OUR MOMOS FEATURE HAND-STRETCHED DOUGH, FRESHLY SOURCED INGREDIENTS, AND HOUSE-MADE SPICED FILLINGS—STEAMED, FRIED, AND SMASHED TO PERFECT BITES OF ULTIMATE COMFORT.
        </p>
      </div>
    </div>
  )
}
