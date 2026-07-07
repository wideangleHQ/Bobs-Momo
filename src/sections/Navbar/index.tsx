import React, { useState, useEffect } from "react"
import { Menu as MenuIcon, X, Tag } from "lucide-react"

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { label: "Menu", href: "#menu" },
    { label: "Games", href: "#games" },
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
            ? "bg-brand-beige/95 border-b border-brand-charcoal/10 py-3 md:py-1 shadow-sm backdrop-blur-md"
            : "bg-transparent py-5 md:py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Left Navigation links (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm md:text-base lg:text-xl font-display font-black tracking-tight uppercase text-brand-charcoal hover:text-brand-red transition-colors duration-200"
                data-cursor="pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Logo */}
          <a
            href="#"
            className="flex items-center justify-center select-none"
            data-cursor="pointer"
          >
            <img
              src="/Images/logo/logo.png"
              alt="Bob's Momo Logo"
              className="h-14 md:h-20 w-auto object-contain"
            />
          </a>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Offers (Tag Icon in Circle) - Hidden on extra small screens */}
            <button
              className="hidden sm:flex w-12 h-12 rounded-full border border-brand-charcoal/15 bg-white items-center justify-center shadow-sm hover:border-brand-red hover:scale-105 active:scale-95 transition-all duration-200 text-brand-charcoal hover:text-brand-red"
              data-cursor="pointer"
              aria-label="Offers"
            >
              <Tag size={20} strokeWidth={2} />
            </button>

            {/* Capsule Order Button */}
            <a
              href="#menu"
              onClick={(e) => handleLinkClick(e, "#menu")}
              className="inline-block bg-brand-red text-white px-6 py-3 lg:px-10 lg:py-4 text-xs md:text-sm lg:text-base font-display font-extrabold tracking-wider uppercase rounded-full hover:bg-brand-red/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md shadow-brand-red/20"
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
            © BOB'S MOMO 2026 // EST. BHUBANESWAR
          </div>
        </div>
      </div>
    </>
  )
}
