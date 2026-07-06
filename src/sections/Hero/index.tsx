import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface MarqueeRowProps {
  text: string
  outline?: boolean
  reverse?: boolean
}

function MarqueeRow({ text, outline = false, reverse = false }: MarqueeRowProps) {
  // Repeating text multiple times to ensure it overflows the screen width cleanly
  const repeatedText = Array(4).fill(text).join(" ")

  return (
    <div className="w-full overflow-hidden select-none marquee-track py-2 md:py-3 border-y border-brand-charcoal/5">
      <div
        className={`flex shrink-0 whitespace-nowrap text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-display font-black tracking-tighter uppercase leading-none ${reverse ? "animate-marqueeReverse" : "animate-marquee"
          }`}
        style={{ willChange: "transform", fontFamily: "Boldfinger, sans-serif" }}
      >
        <span className={outline ? "text-outline px-4" : "text-brand-red px-4"}>
          {repeatedText}
        </span>
        <span className={outline ? "text-outline px-4" : "text-brand-red px-4"}>
          {repeatedText}
        </span>
      </div>
    </div>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dynamic circle radius based on screen size
      const getRadius = () => {
        const vw = window.innerWidth
        if (vw < 640) return 160
        if (vw < 768) return 200
        return 240
      }

      // Calculate initial scale so the image covers the circle bounds exactly
      const getInitialScale = () => {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const radius = getRadius()
        const diameter = radius * 2
        const minDimension = Math.min(vw, vh)
        return diameter / minDimension
      }

      const initialRadius = getRadius()
      const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 1.25
      const initialScale = getInitialScale()
      const targetBorderScale = maxRadius / initialRadius

      // Initial States
      gsap.set(".hero-foreground-img", {
        clipPath: `circle(${initialRadius}px at 50% 50%)`,
      })
      gsap.set(".hero-foreground-img img", {
        scale: initialScale,
      })

      // Entrance Animations on load (before user scrolls)
      gsap.from(".hero-circle-border", {
        scale: 0.75,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
      })

      gsap.from(".hero-foreground-img", {
        scale: 0.75,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
      }, "<")

      gsap.from(".whatsapp-badge", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 1.0,
      })

      // Scroll-driven animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%", // Pin for one viewport scroll height
          pin: true,
          scrub: true, // binds animation directly to scroll without lag to prevent snapping glitches on unpin
          anticipatePin: 1, // prevents layout jumps when pinning starts
          invalidateOnRefresh: true,
        },
      })

      // 1. Expand the circle mask of the foreground image (completes at 60% scroll progress)
      tl.to(".hero-foreground-img", {
        clipPath: `circle(${maxRadius}px at 50% 50%)`,
        duration: 0.6,
        ease: "power1.inOut",
      }, 0)

      // 1b. Zoom the image from the circle bounds to full-screen cover (completes at 60% scroll progress)
      tl.to(".hero-foreground-img img", {
        scale: 1,
        duration: 0.6,
        ease: "power1.inOut",
      }, 0)

      // 2. Scale up and fade out the circle border overlay in perfect sync (completes at 60% scroll progress)
      tl.to(".hero-circle-border", {
        scale: targetBorderScale,
        opacity: 0,
        duration: 0.6,
        ease: "power1.inOut",
      }, 0)

      // 3. Fade out and translate the background marquees smoothly out of view (completes at 40% scroll progress)
      tl.to(".hero-bg-marquee", {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.4,
        ease: "power1.out",
      }, 0)

      // 4. Fade out the pulsing blue glow (completes at 40% scroll progress)
      tl.to(".hero-bg-glow", {
        opacity: 0,
        scale: 1.3,
        duration: 0.4,
        ease: "power1.out",
      }, 0)

      // 5. Fade and slide in the headline/subtitle/CTA stack as one unit
      //    (starts at 35% scroll, completes at 75% scroll)
      tl.fromTo(".hero-title-container",
        {
          opacity: 0,
          y: -30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0.35 // Start at 35% scroll
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-brand-beige overflow-hidden flex items-center justify-center pt-24 pb-16"
    >
      {/* Tilted Marquee Background (Frame 1 Background - already visible on load) */}
      <div className="hero-bg-marquee absolute inset-0 z-0 flex flex-col justify-center items-center pointer-events-none overflow-hidden select-none rotate-[-8deg] scale-11" style={{ willChange: "transform, opacity" }}>
        <MarqueeRow text="DAMN TASTY LOCAL," outline={false} reverse={false} />
        <MarqueeRow text="YOUR FRIENDLY, NEIGHBORHOOD MOMOS JOINT" outline={true} reverse={true} />
        <MarqueeRow text="DAMN TASTY LOCAL," outline={false} reverse={false} />
        <MarqueeRow text="YOUR FRIENDLY, NEIGHBORHOOD MOMOS JOINT" outline={true} reverse={true} />
      </div>

      {/* Subtle pulsing background glow to make the initial circle pop */}
      <div className="hero-bg-glow absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] lg:w-[440px] lg:h-[440px] bg-brand-yellow/20 rounded-full blur-[60px] z-0 animate-pulse pointer-events-none" />

      {/* Decorative circle border overlay (fades out and scales on scroll) */}
      <div className="hero-circle-border absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] lg:w-[500px] lg:h-[500px] rounded-full border-[6px] border-brand-beige shadow-2xl bg-transparent z-20 pointer-events-none" style={{ willChange: "transform, opacity" }} />

      {/* Pinned Foreground Image Expander Container */}
      <div
        className="hero-foreground-img absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden"
        style={{
          clipPath: "circle(240px at 50% 50%)",
          willChange: "clip-path",
        }}
      >
        <img
          src="/Images/Hero Section Background.png"
          alt="Pretty Patty Smashburger Meal Tray"
          className="w-full h-full object-cover select-none pointer-events-none brightness-[1.04] contrast-[1.04] saturate-[1.06]"
          style={{ willChange: "transform" }}
        />
      </div>

      {/* ── Heading + Subtitle + CTA stack (Frame 2 — fades/slides in on scroll) ──
          All three now live together as one centered column, matching the
          reference's vertical order: heading → subtitle → CTA → food below. */}
      <div
        className="hero-title-container absolute top-16 sm:top-20 md:top-24 mt-[15px] md:mt-[30px] left-1/2 -translate-x-1/2 z-30 w-full text-center px-6 opacity-0 flex flex-col items-center"
        style={{ willChange: "transform, opacity" }}
      >
        {/* First line — Poppins ExtraBold, ~35-40% smaller than the second line */}
        <h1 className="font-sans font-extrabold text-brand-red uppercase tracking-tight leading-none text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Not Just Momos
        </h1>

        {/* Second line — Bold Finger, the dominant visual element of the Hero */}
        <h2
          className="text-brand-red uppercase tracking-tighter leading-[0.85] -mt-1 sm:-mt-2 text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ fontFamily: "Boldfinger, sans-serif" }}
        >
          PURE CRAVINGS
        </h2>

        {/* Subtitle */}
        <p className="font-sans font-medium text-brand-red uppercase tracking-wide mt-3 md:mt-4 text-sm sm:text-base md:text-lg">
          Best Authentic Momos
        </p>

        {/* CTA — pill button: yellow fill, thick black border, black drop shadow */}
       
      </div>

      {/* Floating circular WhatsApp widget at bottom-right */}
      <div className="whatsapp-badge absolute bottom-6 right-6 md:bottom-8 md:right-8 z-30 flex items-center justify-center" style={{ willChange: "transform, opacity" }}>
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
          {/* Rotating circular text */}
          <div className="absolute inset-0 animate-spinSlow">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <path
                  id="circleTextPath"
                  d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                />
              </defs>
              <text className="text-[7.5px] font-mono font-black fill-brand-charcoal tracking-widest">
                <textPath href="#circleTextPath" startOffset="0%">
                  ORDER FAST • ORDER FAST • ORDER FAST •
                </textPath>
              </text>
            </svg>
          </div>
          {/* Central Green WhatsApp Icon */}
          <a
            href="https://wa.me/41220000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 z-10"
            data-cursor="pointer"
            aria-label="Order via WhatsApp"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 2.006 14.115.98 11.5.98c-5.448 0-9.886 4.374-9.89 9.802 0 1.838.497 3.633 1.439 5.2l-.99 3.616 3.73-.966c1.52.884 3.033 1.32 4.288 1.32zm10.963-7.228c-.28-.14-1.654-.82-1.91-.911-.254-.09-.44-.136-.624.14-.184.277-.714.91-.874 1.092-.16.182-.32.203-.6.062-.28-.14-1.18-.433-2.248-1.39-1.12-1.002-1.233-1.028-1.513-1.308-.28-.28-.03-.312.11-.452.128-.128.28-.328.42-.492.14-.164.185-.28.28-.464.093-.186.046-.347-.02-.487-.068-.14-.624-1.503-.856-2.062-.225-.544-.453-.472-.624-.48-.163-.008-.35-.01-.537-.01-.186 0-.49.07-.747.35-.257.28-.98.96-.98 2.34 0 1.38 1.002 2.71 1.143 2.89.14.18 1.97 3.01 4.773 4.218 2.802 1.208 2.802.805 3.303.76.502-.046 1.653-.675 1.884-1.328.23-.653.23-1.213.16-1.328-.07-.11-.253-.178-.532-.32z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}