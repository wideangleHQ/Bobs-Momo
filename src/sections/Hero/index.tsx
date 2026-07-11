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

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const getTargetScale = () => {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const circle = containerRef.current?.querySelector(".hero-circle-mask") as HTMLElement | null
        const initialDiameter = circle?.offsetWidth || 500
        return Math.hypot(vw, vh) / initialDiameter
      }

      // Initial States
      gsap.set([".hero-circle-mask", ".hero-circle-border"], {
        scale: 1,
        transformOrigin: "50% 50%",
        force3D: true,
      })

      gsap.set(".hero-circle-image", {
        xPercent: -50,
        yPercent: -50,
        scale: 1.08,
        transformOrigin: "50% 50%",
        force3D: true,
      })

      gsap.set(".hero-fullscreen-img", {
        opacity: 0,
        scale: 1.03,
        transformOrigin: "50% 50%",
        force3D: true,
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

      // 1. Expand the circular wrapper until it covers the viewport.
      tl.to(".hero-circle-mask", {
        scale: getTargetScale,
        duration: 0.5,
        ease: "power1.inOut",
      }, 0)

      tl.to(".hero-circle-image", {
        scale: () => 1.08 / getTargetScale(),
        duration: 0.5,
        ease: "power2.out",
      }, 0)

      // 2. Scale up and fade out the circle border overlay in perfect sync.
      tl.to(".hero-circle-border", {
        scale: getTargetScale,
        opacity: 0,
        duration: 0.5,
        ease: "power1.inOut",
      }, 0)

      // 3. Fade out and translate the background marquees smoothly out of view (completes at 40% scroll progress)
      tl.to(".hero-bg-marquee", {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.45,
        ease: "power1.out",
      }, 0)

      // 4. Fade out the pulsing blue glow (completes at 40% scroll progress)
      tl.to(".hero-bg-glow", {
        opacity: 0,
        scale: 1.3,
        duration: 0.45,
        ease: "power1.out",
      }, 0)

      // 5. Fade and slide in the headline/subtitle/CTA stack as one unit
      //    (starts at 35% scroll, completes at 75% scroll)
      tl.fromTo(".hero-title-container",
        {
          opacity: 0,
          y: 34,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        },
        0.52
      )

      tl.to(".hero-fullscreen-img", {
        opacity: 1,
        scale: 1,
        duration: 0.1,
        ease: "power1.out",
      }, 0.9)
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
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="hero-bg-glow w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] lg:w-[440px] lg:h-[440px] bg-brand-yellow/20 rounded-full blur-[60px] animate-pulse" />
      </div>

      {/* Decorative circle border overlay (fades out and scales on scroll) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="hero-circle-border w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] lg:w-[500px] lg:h-[500px] rounded-full border-[6px] border-brand-beige shadow-2xl bg-transparent" style={{ willChange: "transform, opacity" }} />
      </div>

      {/* Pinned Foreground Image Expander Container */}
      <div
        className="hero-foreground-img absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
        style={{
          transform: "translate3d(0,0,0)",
        }}
      >
        <div
          className="hero-circle-mask relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden"
          style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
        >
          <img
            src="/Images/Hero Section Background.png"
            alt="Bob's Momo Platter"
            className="hero-circle-image absolute left-1/2 top-1/2 h-screen w-screen max-w-none object-cover object-center select-none pointer-events-none brightness-[1.04] contrast-[1.04] saturate-[1.06]"
            style={{ willChange: "transform" }}
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
          />
        </div>
      </div>

      {/* ── Heading + Subtitle + CTA stack (Frame 2 — fades/slides in on scroll) ──
          All three now live together as one centered column, matching the
          reference's vertical order: heading → subtitle → CTA → food below. */}
      <div
        className="hero-title-container absolute top-28 sm:top-20 md:top-24 mt-[35px] sm:mt-[30px] md:mt-[30px] left-1/2 -translate-x-1/2 z-30 w-full text-center px-6 opacity-0 flex flex-col items-center"
        style={{ willChange: "transform, opacity" }}
      >
        {/* First line — Poppins ExtraBold, ~35-40% smaller than the second line */}
        <h1 className="font-sans font-extrabold text-brand-red uppercase tracking-tight leading-none text-[11vw] sm:text-4xl md:text-5xl lg:text-6xl text-center">
          NOT JUST<br className="sm:hidden" /> MOMOS
        </h1>

        {/* Second line — Bold Finger, the dominant visual element of the Hero */}
        <h2
          className="text-brand-red uppercase tracking-tighter leading-[0.82] mt-1 sm:-mt-2 text-[18vw] sm:text-7xl md:text-8xl lg:text-9xl text-center"
          style={{ fontFamily: "Boldfinger, sans-serif" }}
        >
          PURE<br className="sm:hidden" /> CRAVINGS
        </h2>

        {/* Subtitle */}
        <p className="font-sans font-medium text-brand-red uppercase tracking-wide mt-3 md:mt-4 text-sm sm:text-base md:text-lg">
          Best Authentic Momos
        </p>

        {/* CTA — pill button: yellow fill, thick black border, black drop shadow */}
       
      </div>
    </section>
  )
}

export default Hero
