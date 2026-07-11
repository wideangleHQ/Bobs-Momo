import React, { useEffect, useRef } from "react"
import { ArrowUp } from "lucide-react"
import { navigate } from "../../lib/router"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ── Respect prefers-reduced-motion ───────────────────────────────────────
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced || !footerRef.current || !contentRef.current || !titleRef.current) return

    const footer = footerRef.current
    const content = contentRef.current
    const title = titleRef.current

    // ── Rubber Stretch Configuration ─────────────────────────────────────────
    // These values control the elastic feel
    const config = {
      maxStretch: 1.18,          // Maximum scaleY on aggressive scroll
      minStretch: 1.0,           // Normal state
      scaleXCompensation: 0.98,  // Inverse scale to preserve volume
      springDuration: 0.6,       // Duration of spring-back animation
      springEase: "elastic.out(1, 0.4)", // Elastic spring ease
      velocityThreshold: 0.5,    // Minimum velocity to trigger stretch
      smoothing: 0.15,           // Lerp smoothing factor
    }

    // ── State tracking ───────────────────────────────────────────────────────
    let currentScaleY = 1
    let currentScaleX = 1
    let targetScaleY = 1
    let isStretching = false
    let rafId: number | null = null

    // ── Initial GPU setup ────────────────────────────────────────────────────
    gsap.set([content, title], {
      force3D: true,
      willChange: "transform",
      transformOrigin: "50% 0%", // Stretch from top edge
    })

    // ── Animation loop for smooth interpolation ──────────────────────────────
    const animate = () => {
      // Lerp towards target scale
      currentScaleY += (targetScaleY - currentScaleY) * config.smoothing
      
      // Calculate inverse X scale to preserve volume
      currentScaleX = 1 - (currentScaleY - 1) * 0.15
      
      // Apply transforms
      gsap.set(content, {
        scaleY: currentScaleY,
        scaleX: currentScaleX,
      })
      
      gsap.set(title, {
        scaleY: currentScaleY,
        scaleX: currentScaleX,
      })

      if (!isStretching && Math.abs(targetScaleY - currentScaleY) < 0.001) {
        rafId = null
        return
      }

      rafId = requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(animate)
      }
    }

    // ── ScrollTrigger to detect when footer is in view ───────────────────────
    const st = ScrollTrigger.create({
      trigger: footer,
      start: "top bottom",
      end: "bottom bottom",
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity())

        if (self.direction === 1 && self.progress > 0) {
          const velocityFactor = Math.min(velocity / 3000, 1)
          const stretchAmount = gsap.utils.interpolate(
            config.minStretch,
            config.maxStretch,
            velocityFactor
          )

          targetScaleY = stretchAmount
          isStretching = true
          startAnimation()
        }
      },
    })

    // ── Spring-back when scrolling stops ─────────────────────────────────────
    let scrollStopTimeout: ReturnType<typeof setTimeout>
    
    const handleScroll = () => {
      clearTimeout(scrollStopTimeout)
      
      scrollStopTimeout = setTimeout(() => {
        // Scroll stopped - spring back to normal
        targetScaleY = config.minStretch
        isStretching = false
        startAnimation()
        
        // Apply spring animation for smooth return
        gsap.to([content, title], {
          scaleY: config.minStretch,
          scaleX: 1,
          duration: config.springDuration,
          ease: config.springEase,
          overwrite: "auto",
        })
      }, 100) // 100ms of no scrolling = stopped
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      st.kill()
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollStopTimeout)
    }
  }, [])

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
    <footer
      ref={footerRef}
      className="w-full bg-brand-red text-brand-beige pt-16 px-6 md:px-12 border-t border-white/10 select-none relative overflow-hidden"
    >
      {/* ── Giant background title that stretches with footer ────────────────── */}
      <div
        ref={titleRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          zIndex: 0,
          transformOrigin: "50% 0%",
        }}
      >
        <span
          className="select-none"
          style={{
            fontFamily: "Boldfinger, sans-serif",
            fontSize: "clamp(7rem, 18vw, 42rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
            color: "rgba(126, 20, 26, 0.15)", // Darker red with lower opacity
            display: "block",
            userSelect: "none",
          }}
        >
          BOB&apos;S MOMO
        </span>
      </div>

      {/* ── Footer content — stretches with the footer ───────────────────────── */}
      <div ref={contentRef} className="relative z-10" style={{ transformOrigin: "50% 0%" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 md:gap-12 text-left">
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
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center mt-16 pt-8 border-t border-white/10 text-[9px] sm:text-xs font-mono text-white/50 w-full pb-6">
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
      </div>
    </footer>
  )
}
