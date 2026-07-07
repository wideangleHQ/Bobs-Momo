import React from "react"
import { ArrowUp } from "lucide-react"
import { navigate } from "../../lib/router"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href === "#menu") {
      navigate("/menu")
      return
    }

    if (window.location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const targetElement = document.querySelector(href)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 150)
    } else {
      const targetElement = document.querySelector(href)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <footer className="w-full bg-brand-red text-brand-beige py-16 px-6 md:px-12 border-t border-white/10 select-none relative overflow-hidden">
      {/* Decorative large brand letters */}
      <div className="absolute left-1/2 bottom-[-20px] -translate-x-1/2 text-white/[0.04] text-[15vw] font-ghayaty font-extrabold tracking-tighter leading-none w-full text-center pointer-events-none select-none">
        BOBSMOMO
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 md:gap-12 relative z-10 text-left">
        {/* Column 1: Info and logo */}
        <div className="space-y-4 col-span-4 md:col-span-2">
          <h3 className="text-3xl font-ghayaty font-extrabold tracking-tighter uppercase text-white">
            BOB'S <span className="text-brand-yellow">MOMO</span>
          </h3>
          <p className="text-sm text-white/80 max-w-sm leading-relaxed font-sans font-medium">
            We steam, fry, and smash the finest momos in Bhubaneswar, delivering a juicy burst of taste with every single bite.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4 col-span-2 md:col-span-1">
          <h4 className="text-[10px] font-mono tracking-widest text-white/50 uppercase block font-bold">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm font-semibold uppercase tracking-wider">
            <li>
              <a href="#about" onClick={(e) => handleLinkClick(e, "#about")} className="hover:text-brand-yellow transition-colors duration-200" data-cursor="pointer">
                About Us
              </a>
            </li>
            <li>
              <a href="#menu" onClick={(e) => handleLinkClick(e, "#menu")} className="hover:text-brand-yellow transition-colors duration-200" data-cursor="pointer">
                Our Menu
              </a>
            </li>
            <li>
              <a href="#locations" onClick={(e) => handleLinkClick(e, "#locations")} className="hover:text-brand-yellow transition-colors duration-200" data-cursor="pointer">
                Locations
              </a>
            </li>
            <li>
              <a href="#careers" onClick={(e) => handleLinkClick(e, "#careers")} className="hover:text-brand-yellow transition-colors duration-200" data-cursor="pointer">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Social/Legal */}
        <div className="space-y-4 col-span-2 md:col-span-1">
          <h4 className="text-[10px] font-mono tracking-widest text-white/50 uppercase block font-bold">
            Connect
          </h4>
          <ul className="space-y-2 text-sm font-semibold uppercase tracking-wider">
            <li>
              <a href="https://www.instagram.com/bobsmomo.qsr/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors duration-200" data-cursor="pointer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/people/Bobs-MoMo/61576971560742/#" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors duration-200" data-cursor="pointer">
                Facebook
              </a>
            </li>
            <li>
              <a href="mailto:bobsmomobbsr@gmail.com" className="hover:text-brand-yellow transition-colors duration-200 lowercase" data-cursor="pointer">
                bobsmomobbsr@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center mt-16 pt-8 border-t border-white/10 relative z-10 text-[9px] sm:text-xs font-mono text-white/50 w-full">
        <div>
          © BOB'S MOMO 2026 // EST. BHUBANESWAR // ALL RIGHTS RESERVED
        </div>

        {/* Scroll back up button */}
        <button
          onClick={scrollToTop}
          className="flex items-center space-x-2 text-white/70 hover:text-brand-yellow transition-colors duration-200"
          data-cursor="pointer"
          aria-label="Scroll to top"
        >
          <span>Back to top</span>
          <div className="p-2 border border-white/20 rounded-full">
            <ArrowUp size={12} />
          </div>
        </button>
      </div>
    </footer>
  )
}
