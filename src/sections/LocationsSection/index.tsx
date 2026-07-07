import React, { useEffect, useRef, useCallback, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// ─── Store Locations Data ──────────────────────────────────────────────────
const LOCATIONS = [
  {
    name: "Bob's Momo",
    address: "Baishnab Complex, Plot - 1344/1730, Sum Hospital Rd, Kalinga Nagar, Shampur, Bhubaneswar, Odisha 751029",
    phone: "+91 9938969029",
    hours: [
      "Mon - Sun : 4:00 - 10:00 Pm"
    ],
    image: "./public/Images/stores/store-2.jpeg",
    logo: "./public/Images/logo/logo.png",
    mapLink: "https://www.google.com/maps/place/Bob's+MoMo/@20.2861003,85.7706262,17z/data=!3m1!4b1!4m6!3m5!1s0x3a19091144b3e8b1:0xbd56ce38525ec012!8m2!3d20.2860953!4d85.7732011!16s%2Fg%2F11n3xg37tg?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    name: "Bob's Momo",
    address: "Plot No. 126, 200ft Road, near Shiv Temple, Patharagadia, Bhubaneswar, Odisha 751024",
    phone: "+91 9938969029",
    hours: [
      "Mon - Sun : 4:00 - 10:00 Pm"
    ],
    image: "./public/Images/stores/Bobs-Momo 1.webp",
    logo: "./public/Images/logo/logo.png",
    mapLink: "https://www.google.com/maps/place/Bob's+MoMo/@20.3661791,85.7918502,17z/data=!3m1!4b1!4m6!3m5!1s0x3a1909427fb9d50d:0x26ac871e9590c488!8m2!3d20.3661741!4d85.7944251!16s%2Fg%2F11y4nwlr9c?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
  }
]

export default function LocationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const localCursorRef = useRef<HTMLDivElement>(null)
  
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Embla Carousel Setup (Non-looping on desktop if all visible, but loopable for touch swipe)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  })

  // Navigation callbacks
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  // Branded Custom Cursor logic
  useEffect(() => {
    const section = sectionRef.current
    const cursor = localCursorRef.current
    if (!section || !cursor) return

    // Quick positioning with easing
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power2.out" })
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power2.out" })

    gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 })

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const handleMouseEnter = () => {
      // Hide global custom cursor
      const globalCursor = document.querySelector(".z-\\[9999\\]:not(.local-cursor)") as HTMLElement
      if (globalCursor) {
        gsap.to(globalCursor, { opacity: 0, duration: 0.15 })
      }
      // Show local branded cursor
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" })
    }

    const handleMouseLeave = () => {
      // Show global custom cursor
      const globalCursor = document.querySelector(".z-\\[9999\\]:not(.local-cursor)") as HTMLElement
      if (globalCursor) {
        gsap.to(globalCursor, { opacity: 1, duration: 0.15 })
      }
      // Hide local branded cursor
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.out" })
    }

    section.addEventListener("mousemove", handleMouseMove)
    section.addEventListener("mouseenter", handleMouseEnter)
    section.addEventListener("mouseleave", handleMouseLeave)

    // Scaling the cursor on interactive triggers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [data-cursor='pointer']")) {
        gsap.to(cursor, {
          scale: 1.6,
          backgroundColor: "rgba(255, 204, 0, 0.25)", // yellow transparent glow
          borderColor: "#FFCC00",
          duration: 0.25,
          ease: "power2.out"
        })
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [data-cursor='pointer']")) {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "transparent",
          borderColor: "#FFCC00",
          duration: 0.25,
          ease: "power2.out"
        })
      }
    }

    section.addEventListener("mouseover", handleMouseOver)
    section.addEventListener("mouseout", handleMouseOut)

    return () => {
      section.removeEventListener("mousemove", handleMouseMove)
      section.removeEventListener("mouseenter", handleMouseEnter)
      section.removeEventListener("mouseleave", handleMouseLeave)
      section.removeEventListener("mouseover", handleMouseOver)
      section.removeEventListener("mouseout", handleMouseOut)
    }
  }, [])

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      })

      // Heading elements stagger
      tl.fromTo(
        ".locations-header > *",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      )
      // Carousel wrapper
      .fromTo(
        ".locations-carousel-wrap",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.3"
      )
      // Card images scale and reveal
      .fromTo(
        ".store-card-image-wrap",
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" },
        "-=0.5"
      )
      // Floating information panels slide in
      .fromTo(
        ".store-info-panel",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" },
        "-=0.4"
      )
      // Direction button stagger
      .fromTo(
        ".store-dir-btn",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power3.out" },
        "-=0.3"
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="locations"
      ref={sectionRef}
      className="w-full h-auto md:h-screen md:max-h-screen bg-brand-red text-brand-beige flex flex-col justify-center py-[40px] px-[0.5%] relative overflow-hidden select-none md:cursor-none"
    >
      {/* Branded Section-Exclusive Custom Cursor */}
      <div
        ref={localCursorRef}
        className="local-cursor fixed top-0 left-0 w-7 h-7 rounded-full border-2 border-brand-yellow pointer-events-none z-[9999] hidden md:block"
        style={{ willChange: "transform" }}
      >
        <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-brand-yellow" />
      </div>

      {/* Subtle background decoration */}
      <div className="absolute right-[-120px] top-[-120px] text-white/[0.015] pointer-events-none text-[35rem] font-display font-extrabold select-none leading-none">
        PP
      </div>
      <div className="absolute left-[-120px] bottom-[-120px] text-white/[0.015] pointer-events-none text-[35rem] font-display font-extrabold select-none leading-none">
        PP
      </div>

      <div className="relative w-full max-w-[94%] mx-auto flex flex-col items-center">
        {/* ── Heading ── */}
        <div ref={headerRef} className="locations-header text-center mb-6 md:mb-8 space-y-2 max-w-3xl">
          <span className="text-sm md:text-base font-mono font-bold tracking-[0.25em] text-brand-yellow uppercase block">
            OUR STORES
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter text-white uppercase leading-none">
            VISIT OUR LOCATIONS
          </h2>
          <p className="font-mono text-sm md:text-base tracking-wider uppercase text-brand-cream/90 leading-relaxed pt-0.5">
            Experience premium burger craft in Zurich & Geneva.
          </p>
        </div>

        {/* ── Centered Carousel ── */}
        <div className="locations-carousel-wrap relative w-full px-0 lg:px-10">
          
          {/* Navigation Arrows (Desktop Only - positioned inside container gaps, no overlap) */}
          <button
            onClick={scrollPrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 hidden lg:flex w-12 h-12 rounded-full bg-white border border-brand-charcoal/10 items-center justify-center shadow-md hover:border-brand-red text-brand-charcoal hover:text-brand-red hover:scale-105 active:scale-95 transition-all duration-300 z-30"
            data-cursor="pointer"
            aria-label="Previous Location"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 hidden lg:flex w-12 h-12 rounded-full bg-white border border-brand-charcoal/10 items-center justify-center shadow-md hover:border-brand-red text-brand-charcoal hover:text-brand-red hover:scale-105 active:scale-95 transition-all duration-300 z-30"
            data-cursor="pointer"
            aria-label="Next Location"
          >
            <ArrowRight size={16} strokeWidth={2} />
          </button>

          {/* Carousel Viewport */}
          <div className="locations-carousel-viewport overflow-hidden w-full relative" ref={emblaRef}>
            <div className="flex -mx-4 md:-mx-6">
              {LOCATIONS.map((loc, idx) => (
                <div
                  key={loc.name}
                  className="px-4 md:px-6 min-w-0 flex-[0_0_100%] lg:flex-[0_0_50%] relative py-2"
                >
                  {/* Store Card Container (shorter height for 100vh layout) */}
                  <div className="group relative rounded-[2.2rem] overflow-hidden h-[46vh] sm:h-[42vh] md:h-[45vh] lg:h-[46vh] xl:h-[48vh] max-h-[460px] min-h-[340px] border-2 border-white/5 shadow-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_25px_50px_rgba(0,0,0,0.45)] hover:border-white/20">
                    
                    {/* Upper Store Image Section */}
                    <div className="absolute inset-0 store-card-image-wrap overflow-hidden rounded-[2.2rem]">
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03] pointer-events-none"
                        loading="lazy"
                      />
                      {/* Dark vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-75 transition-opacity duration-500" />
                    </div>

                    {/* Lower Floating Information Panel */}
                    <div className="absolute bottom-3 left-3 right-3 bg-brand-cream border border-brand-charcoal/30 p-4 rounded-[1.6rem] shadow-xl z-10 flex gap-4 items-center store-info-panel max-w-full">
                      
                      {/* Left: Store Logo */}
                      <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 bg-brand-red rounded-2xl overflow-hidden border border-brand-charcoal/15 flex items-center justify-center p-1.5">
                        <img
                          src={loc.logo}
                          alt="Bob's Momo Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Right: Info Details */}
                      <div className="flex-grow space-y-1 text-left min-w-0">
                        <h3 className="font-display font-extrabold text-2xl md:text-3xl lg:text-4xl text-brand-charcoal uppercase tracking-tight leading-none mb-1">
                          {loc.name}
                        </h3>
                        <div className="font-mono text-xs md:text-sm lg:text-[15px] text-brand-charcoal/95 leading-relaxed uppercase space-y-1 min-w-0 truncate-paths">
                          <p className="truncate">
                            <span className="font-bold text-brand-charcoal/40">ADD: </span>
                            {loc.address}
                          </p>
                          <p>
                            <span className="font-bold text-brand-charcoal/40">TEL: </span>
                            {loc.phone}
                          </p>
                          <div className="pt-0.5">
                            <span className="font-bold text-brand-charcoal/40 block leading-none mb-1">
                              OPEN:
                            </span>
                            {loc.hours.map((line, i) => (
                              <span key={i} className="block font-medium leading-none mb-1">
                                {line}
                              </span>
                            ))}
                          </div>
                        </div>
                        <a
                          href={loc.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="store-dir-btn mt-2 inline-flex items-center gap-1 text-xs md:text-sm lg:text-[15px] font-mono font-bold tracking-widest text-brand-red hover:text-brand-charcoal border-b border-brand-red hover:border-brand-charcoal transition-all duration-300"
                          data-cursor="pointer"
                        >
                          GET DIRECTIONS →
                        </a>
                      </div>
                    </div>

                    {/* WhatsApp Ordering Widget overlay */}
                    {loc.hasWhatsApp && loc.whatsappUrl && (
                      <div className="absolute bottom-[65px] right-[20px] md:bottom-[75px] md:right-[24px] z-20">
                        <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-brand-cream border border-brand-charcoal/15 shadow-lg select-none pointer-events-auto">
                          {/* Spinning Text SVG */}
                          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spinSlow">
                            <defs>
                              <path
                                id={`whatsappCirclePath-local`}
                                d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                              />
                            </defs>
                            <text className="text-[9.5px] font-mono font-bold fill-brand-charcoal uppercase tracking-[0.18em]">
                              <textPath href={`#whatsappCirclePath-local`} startOffset="0%">
                                • order fast • order fast • order fast
                              </textPath>
                            </text>
                          </svg>

                          {/* Central WhatsApp Button */}
                          <a
                            href={loc.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#25D366] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200 z-10 text-white"
                            data-cursor="pointer"
                            aria-label="Order Fast via WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.485.002 9.945-4.455 9.948-9.94.002-2.659-1.03-5.158-2.906-7.035A9.873 9.873 0 0 0 12.008 1.54c-5.482 0-9.94 4.457-9.944 9.943-.001 1.902.502 3.759 1.458 5.378L2.52 21.43l4.127-1.082-.001-.001zM17.1 14.167c-.28-.14-1.65-.815-1.906-.908-.256-.093-.443-.14-.63.14-.186.28-.72.907-.882 1.093-.163.186-.326.21-.605.07-1.157-.58-1.96-1.017-2.736-2.348-.204-.351.204-.326.584-1.087.062-.124.03-.233-.015-.327-.047-.093-.443-1.07-.605-1.467-.16-.385-.35-.332-.48-.332-.125-.004-.268-.004-.413-.004s-.38.054-.58.272c-.2.217-.763.746-.763 1.817 0 1.07.778 2.103.887 2.248.11.144 1.53 2.336 3.706 3.28.518.224.922.358 1.238.458.52.165.993.142 1.368.086.418-.062 1.65-.675 1.884-1.328.233-.653.233-1.213.163-1.328-.07-.116-.256-.209-.536-.349z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator (Mobile/Tablet Only for UX feedback) */}
          <div className="flex lg:hidden justify-center gap-2 mt-4">
            {LOCATIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi && emblaApi.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-350 ${
                  i === selectedIndex ? "w-6 bg-brand-yellow" : "w-2 bg-white/30"
                }`}
                aria-label={`Go to location ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
