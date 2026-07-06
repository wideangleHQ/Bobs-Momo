import React, { useState, useEffect } from "react"
import { Menu as MenuIcon, X, Bike } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "About Us", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Locations", href: "#locations" },
  ]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const targetElement = document.querySelector(href)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-brand-beige/95 border-b border-brand-charcoal/10 py-3 shadow-sm backdrop-blur-md"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Left Navigation links (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base md:text-xl font-display font-black tracking-tight uppercase text-brand-charcoal hover:text-brand-red transition-colors duration-200"
                data-cursor="pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Logo (Centered, Stacked) */}
          <a
            href="#"
            className="flex flex-col items-center leading-[0.8] text-brand-red font-ghayaty tracking-tighter uppercase text-center select-none"
            data-cursor="pointer"
          >
            <span className="text-2xl md:text-3xl font-medium">BOB'S</span>
            <span className="text-2xl md:text-3xl">MOMO</span>
          </a>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Selector (UK Flag in Circle) - Hidden on extra small screens */}
            <button
              className="hidden sm:flex w-12 h-12 rounded-full border border-brand-charcoal/15 bg-white items-center justify-center shadow-sm hover:border-brand-red hover:scale-105 active:scale-95 transition-all duration-200"
              data-cursor="pointer"
              aria-label="Language Selector"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shadow-inner">
                <svg className="w-full h-full object-cover" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="30" fill="#012169"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                  <path d="M0,0 L30,15 M60,30 L30,15 M60,0 L30,15 M0,30 L30,15" stroke="#C8102E" strokeWidth="4"/>
                  <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="10"/>
                  <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6"/>
                </svg>
              </div>
            </button>

            {/* Delivery/Bicycle Icon in Circle - Hidden on extra small screens */}
            <button
              className="hidden sm:flex w-12 h-12 rounded-full border border-brand-charcoal/15 bg-white items-center justify-center shadow-sm hover:border-brand-red hover:scale-105 active:scale-95 transition-all duration-200 text-brand-charcoal hover:text-brand-red"
              data-cursor="pointer"
              aria-label="Delivery Details"
            >
              <Bike size={20} strokeWidth={2} />
            </button>

            {/* Capsule Order Button */}
            <a
              href="#menu"
              onClick={(e) => handleLinkClick(e, "#menu")}
              className="inline-block bg-brand-red text-white px-10 py-4 text-base font-display font-extrabold tracking-wider uppercase rounded-full hover:bg-brand-red/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md shadow-brand-red/20"
              data-cursor="pointer"
            >
              Contact Us
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-brand-charcoal hover:text-brand-red transition-colors duration-200"
              data-cursor="pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 w-full h-full bg-brand-beige z-40 transition-transform duration-500 ease-in-out md:hidden flex flex-col justify-between p-8 pt-24 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-4xl font-display font-black tracking-tight uppercase text-brand-charcoal hover:text-brand-red transition-colors duration-200"
              data-cursor="pointer"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="space-y-4">
          <a
            href="#menu"
            onClick={(e) => handleLinkClick(e, "#menu")}
            className="block text-center bg-brand-red text-white w-full py-4 text-sm font-display font-black tracking-widest uppercase rounded-full hover:bg-brand-red/90 transition-colors duration-300"
            data-cursor="pointer"
          >
            Order Online
          </a>
          <div className="text-[10px] font-mono text-center text-brand-charcoal/40 uppercase tracking-widest">
            © BOB'S MOMO 2026 // EST. GENEVA
          </div>
        </div>
      </div>
    </>
  )
}
