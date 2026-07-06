import React, { useState, useEffect } from "react"
import { ShoppingBag } from "lucide-react"

export default function FloatingOrderButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 md:left-auto md:right-12 bg-brand-red text-brand-beige p-5 rounded-full z-40 shadow-2xl hover:bg-brand-charcoal transition-all duration-300 hover:scale-105 animate-[pulse_2s_infinite]"
      data-cursor="pointer"
      aria-label="Order online"
    >
      <div className="flex items-center space-x-2 font-display font-extrabold tracking-widest text-xs uppercase px-2">
        <ShoppingBag size={16} />
        <span className="hidden sm:inline">ORDER ONLINE</span>
      </div>
    </button>
  )
}
