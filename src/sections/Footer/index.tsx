import React from "react"
import { ArrowUp } from "lucide-react"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="w-full bg-brand-charcoal text-brand-beige py-16 px-6 md:px-12 border-t border-brand-beige/5 select-none relative overflow-hidden">
      {/* Decorative large brand letters */}
      <div className="absolute left-1/2 bottom-[-20px] -translate-x-1/2 text-brand-beige/[0.02] text-[15vw] font-ghayaty font-extrabold tracking-tighter leading-none w-full text-center pointer-events-none select-none">
        BOBSMOMO
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 text-left">
        {/* Column 1: Info and logo */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-3xl font-ghayaty font-extrabold tracking-tighter uppercase">
            BOB'S <span className="text-brand-red">MOMO</span>
          </h3>
          <p className="text-sm text-brand-beige/60 max-w-sm leading-relaxed font-sans">
            Smashed beef patties, premium ingredients, crispy edges, caramelized onions. The best burger experience in Geneva, Switzerland.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono tracking-widest text-brand-beige/40 uppercase block">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm font-semibold uppercase tracking-wider">
            <li>
              <a href="#about" className="hover:text-brand-red transition-colors duration-200" data-cursor="pointer">
                About Us
              </a>
            </li>
            <li>
              <a href="#menu" className="hover:text-brand-red transition-colors duration-200" data-cursor="pointer">
                Our Menu
              </a>
            </li>
            <li>
              <a href="#locations" className="hover:text-brand-red transition-colors duration-200" data-cursor="pointer">
                Locations
              </a>
            </li>
            <li>
              <a href="#careers" className="hover:text-brand-red transition-colors duration-200" data-cursor="pointer">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Social/Legal */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono tracking-widest text-brand-beige/40 uppercase block">
            Connect
          </h4>
          <ul className="space-y-2 text-sm font-semibold uppercase tracking-wider">
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors duration-200" data-cursor="pointer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors duration-200" data-cursor="pointer">
                Facebook
              </a>
            </li>
            <li>
              <a href="mailto:hello@prettypatty.ch" className="hover:text-brand-red transition-colors duration-200" data-cursor="pointer">
                hello@prettypatty.ch
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mt-16 pt-8 border-t border-brand-beige/10 relative z-10 text-xs font-mono text-brand-beige/40 space-y-4 sm:space-y-0">
        <div>
          © BOB'S MOMO 2026 // EST. GENEVA // ALL RIGHTS RESERVED
        </div>

        {/* Scroll back up button */}
        <button
          onClick={scrollToTop}
          className="flex items-center space-x-2 text-brand-beige/60 hover:text-brand-red transition-colors duration-200"
          data-cursor="pointer"
          aria-label="Scroll to top"
        >
          <span>Back to top</span>
          <div className="p-2 border border-brand-beige/15 rounded-full">
            <ArrowUp size={12} />
          </div>
        </button>
      </div>
    </footer>
  )
}
