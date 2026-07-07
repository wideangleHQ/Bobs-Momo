import React from "react"

export default function MenuCTA() {
  return (
    <div className="hidden md:flex justify-center mt-16 relative z-10 w-full">
      <button
        className="px-10 py-5 bg-brand-red text-white hover:bg-brand-charcoal font-mono text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
        data-cursor="pointer"
      >
        Explore Full Menu
      </button>
    </div>
  )
}
