import React, { useState, useCallback, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useEmblaCarousel from "embla-carousel-react"
import ReactBitsCarousel from "./components/ReactBitsCarousel"
import { motion } from "framer-motion"
import { navigate, prefetchRoute } from "../../lib/router"

gsap.registerPlugin(ScrollTrigger)

// ─── Shared data ──────────────────────────────────────────────────────────────

interface MenuItem {
  id: number
  title: string
  badge: string
  badgeColor: string
  ingredients: string
  price: string
  image: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    title: "MOMO",
    badge: "BESTSELLER",
    badgeColor: "bg-brand-red text-white border-brand-red",
    ingredients: "Hand-folded dumplings stuffed with seasoned potatoes, fresh spinach, and local Swiss cheese, steamed to perfection.",
    price: "PORTION OF 6: CHF 12 / PORTION OF 12: CHF 22",
    image: "/Images/menu-items/Momos.png",
  },
  {
    id: 2,
    title: "BOB'S SPECIAL",
    badge: "CHEF'S CHOICE",
    badgeColor: "bg-brand-yellow text-brand-charcoal border-brand-yellow",
    ingredients: "Signature momos press-smashed on a scorching griddle for a crisp outline, served with spicy sesame chutney.",
    price: "PORTION OF 6: CHF 14 / PORTION OF 12: CHF 25",
    image: "/Images/menu-items/Bobs-Special.png",
  },
  {
    id: 3,
    title: "THUPKA",
    badge: "SPICY",
    badgeColor: "bg-orange-500 text-white border-orange-500",
    ingredients: "Hand-pulled wheat noodles in a rich aromatically spiced broth, garnished with fresh cilantro and scallions.",
    price: "REGULAR: CHF 16.50 / LARGE: CHF 19.50",
    image: "/Images/menu-items/Thupka.png",
  },
  {
    id: 4,
    title: "ROLLS",
    badge: "VEG",
    badgeColor: "bg-green-600 text-white border-green-600",
    ingredients: "Crisp shredded vegetable rolls packed with glassed noodles and roasted spices, with sweet plum dipping sauce.",
    price: "PORTION OF 3: CHF 9 / PORTION OF 6: CHF 16",
    image: "/Images/menu-items/Rolls.png",
  },
  {
    id: 5,
    title: "QUENCHED",
    badge: "REFRESHING",
    badgeColor: "bg-blue-500 text-white border-blue-500",
    ingredients: "Refreshing yogurt drink blended with sweet mango pulp, cardamom, and infused spices, served chilled.",
    price: "GLASS: CHF 6.00 / BOTTLE: CHF 9.50",
    image: "/Images/menu-items/Quenched.png",
  },
]

const LEN = MENU_ITEMS.length

function mod(i: number, n: number) {
  return ((i % n) + n) % n
}

/**
 * Renders a "/" separated price string with tiered emphasis, matching the
 * reference: first segment neutral, every following segment in brand-red.
 * e.g. "PORTION OF 6: CHF 12 / PORTION OF 12: CHF 22"
 *  -> "PORTION OF 6: CHF 12" (charcoal)  /  "PORTION OF 12: CHF 22" (red)
 */
function PriceLine({ price }: { price: string }) {
  const segments = price.split("/").map((s) => s.trim())
  return (
    <p className="font-mono font-black text-[11px] tracking-widest uppercase text-center">
      {segments.map((seg, i) => (
        <React.Fragment key={i}>
          <span className={i === 0 ? "text-brand-charcoal" : "text-brand-red"}>
            {seg}
          </span>
          {i < segments.length - 1 && <span className="text-brand-charcoal/30 mx-1.5">/</span>}
        </React.Fragment>
      ))}
    </p>
  )
}

// ─── Mobile-only Embla Slider ─────────────────────────────────────────────────

function MobileMenuSlider() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? Math.min(window.innerWidth, 767) : 375
  )

  useEffect(() => {
    const handleResize = () => setScreenWidth(Math.min(window.innerWidth, 767))
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Refs for GSAP entrance
  const wrapRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
      tl.fromTo(headRef.current, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0)
        .fromTo(sliderRef.current, { y: 50, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: "power3.out" }, 0.12)
        .fromTo(ctaRef.current, { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, 0.24)
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="flex flex-col w-full bg-brand-beige relative overflow-hidden justify-center gap-2 py-4 px-4"
      style={{ height: "90vh" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.10] z-0"
        style={{
          backgroundImage: `url('/Images/bg-banner.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      {/* ── Heading — charcoal color, centered, two lines ── */}
      <div ref={headRef} className="text-center px-5 relative z-10 flex-shrink-0">
        <span className="text-[11px] font-mono font-bold tracking-widest text-brand-red uppercase block mb-1">
          DAMN TASTY HIMALAYAN BITES
        </span>
        <h2
          className="font-display font-black uppercase text-brand-charcoal leading-none tracking-tight"
          style={{ fontSize: "clamp(1.75rem, 9.5vw, 2.6rem)" }}
        >
          CHECK OUT OUR
        </h2>
        <h2
          className="font-display font-black uppercase text-brand-charcoal leading-none tracking-tight"
          style={{ fontSize: "clamp(1.75rem, 9.5vw, 2.6rem)" }}
        >
          ITEMS
        </h2>
      </div>

      {/* ── 3D Carousel Wrapper ── */}
      <div ref={sliderRef} className="relative z-10 w-full flex justify-center items-center flex-shrink-0 my-1">
        <ReactBitsCarousel
          items={MENU_ITEMS}
          baseWidth={screenWidth}
          autoplay={true}
          autoplayDelay={3000}
          pauseOnHover={true}
          loop={true}
          onItemSelect={setSelectedIndex}
        />
      </div>

      {/* ── CTA Button (Comfortable spacing, 85% width) ── */}
      <div ref={ctaRef} className="flex justify-center px-4 relative z-10 flex-shrink-0 mt-1 mb-2">
        <button
          onClick={() => navigate("/menu")}
          onMouseEnter={() => prefetchRoute("/menu")}
          className="w-[85%] py-[12px] bg-brand-red text-white hover:bg-brand-yellow hover:text-brand-charcoal font-mono text-[11px] uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl active:scale-95"
          data-cursor="pointer"
        >
          Explore Full Menu
        </button>
      </div>
    </div>
  )
}

// ─── Desktop / Tablet carousel (UNCHANGED — do not modify) ───────────────────

function DesktopTabletMenu() {
  const [center, setCenter] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const changeCenter = useCallback(
    (dir: 1 | -1) => {
      if (animating) return
      setAnimating(true)
      setCenter((p) => mod(p + dir, LEN))
      setTimeout(() => setAnimating(false), 700)
    },
    [animating]
  )

  const slideNext = () => changeCenter(1)
  const slidePrev = () => changeCenter(-1)

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    if (touchStart - touchEnd > 50) slideNext()
    else if (touchEnd - touchStart > 50) slidePrev()
    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <section
      id="menu-desktop"
      className="w-full bg-brand-beige text-brand-charcoal overflow-hidden relative flex flex-col"
      style={{ minHeight: "100vh" }}
    >
      {/* Subtle Background Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.10] z-0"
        style={{
          backgroundImage: `url('/Images/bg-banner.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />
      <div className="flex flex-col flex-1 items-center justify-center py-6 px-4 md:px-8 gap-5">

        {/* ── Section Heading ───────────────────────────────── */}
        <div className="text-center space-y-2 flex-shrink-0">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-red uppercase block">
            DAMN TASTY HIMALAYAN BITES
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter text-brand-charcoal uppercase leading-none">
            CHECK OUT OUR ITEMS
          </h2>
        </div>

        {/* ── Slider Viewport ───────────────────────────────── */}
        <div
          className="relative w-full flex items-center justify-center flex-shrink-0"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="relative w-full"
            style={{ height: "clamp(440px, 62vh, 680px)" }}
          >
            {MENU_ITEMS.map((item, index) => {
              let offset = index - center
              if (offset > LEN / 2) offset -= LEN
              if (offset < -LEN / 2) offset += LEN

              const isTablet = screenWidth >= 768 && screenWidth < 1024
              const isCenter = offset === 0
              const isLeft = offset === -1
              const isRight = offset === 1

              const isVisible = isTablet
                ? (offset === 0 || offset === 1)
                : Math.abs(offset) <= 1

              let translateXPct = offset * 24
              if (isTablet) {
                translateXPct = offset === 0 ? -22 : 22
              }

              const scale = isCenter ? 1.0 : 0.92
              const opacity = isVisible ? 1 : 0

              let cardWidth = isCenter ? "clamp(420px, 60vw, 780px)" : "clamp(240px, 28vw, 400px)"
              let cardHeight = isCenter ? "clamp(280px, 44vh, 480px)" : "clamp(170px, 24vh, 300px)"
              let infoWidth = isCenter ? "clamp(280px, 30vw, 440px)" : "clamp(180px, 20vw, 280px)"

              if (isTablet) {
                cardWidth = "38vw"
                cardHeight = "30vh"
                infoWidth = "38vw"
              }

              return (
                <div
                  key={item.id}
                  className="absolute inset-0 flex flex-col items-center justify-end will-change-transform"
                  style={{
                    transform: `translateX(${translateXPct}%) scale(${scale})`,
                    opacity,
                    transition: "transform 680ms cubic-bezier(0.25, 1, 0.5, 1), opacity 680ms cubic-bezier(0.25, 1, 0.5, 1)",
                    zIndex: isCenter ? 30 : isVisible ? 15 : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                    cursor: !isCenter ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (isLeft) slidePrev()
                    if (isRight) slideNext()
                  }}
                >
                  {/* Food Image */}
                  <div
                    className="flex items-end justify-center"
                    style={{ width: cardWidth, height: cardHeight }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full object-contain pointer-events-none will-change-transform ${isCenter
                          ? "drop-shadow-[0_32px_56px_rgba(26,26,26,0.28)]"
                          : "drop-shadow-[0_16px_28px_rgba(26,26,26,0.18)]"
                        }`}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* Food Info */}
                  <div className="text-center mt-2 space-y-1 px-2" style={{ width: infoWidth }}>
                    <h3 className={`font-display font-black uppercase tracking-tight leading-tight ${isCenter ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                      }`}>
                      {item.title}
                    </h3>
                    <p className={`font-sans leading-relaxed text-brand-charcoal/70 font-medium ${isCenter ? "text-sm md:text-base" : "text-xs md:text-sm"
                      }`}>
                      {item.ingredients}
                    </p>
                    <p className={`font-mono font-black text-brand-red tracking-wide ${isCenter ? "text-sm md:text-base" : "text-xs md:text-sm"
                      }`}>
                      {item.price}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Arrows */}
          <button
            onClick={slidePrev}
            disabled={animating}
            className="flex absolute left-4 xl:left-16 top-[40%] -translate-y-1/2 z-40 w-12 h-12 rounded-full border border-brand-charcoal/15 bg-white items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50"
            aria-label="Previous item"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={slideNext}
            disabled={animating}
            className="flex absolute right-4 xl:right-16 top-[40%] -translate-y-1/2 z-40 w-12 h-12 rounded-full border border-brand-charcoal/15 bg-white items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50"
            aria-label="Next item"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* ── Dot Indicators ────────────────────────────────── */}
        <div className="flex gap-2 items-center justify-center flex-shrink-0">
          {MENU_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => !animating && setCenter(i)}
              className={`rounded-full transition-all duration-500 ${i === center
                  ? "w-6 h-2 bg-brand-red"
                  : "w-2 h-2 bg-brand-charcoal/20 hover:bg-brand-charcoal/40"
                }`}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>

        {/* ── CTA Button ────────────────────────────────────── */}
        <div className="flex justify-center flex-shrink-0">
          <button
            onClick={() => navigate("/menu")}
            onMouseEnter={() => prefetchRoute("/menu")}
            className="px-10 py-5 bg-brand-red text-white hover:bg-brand-yellow hover:text-brand-charcoal font-mono text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
            data-cursor="pointer"
          >
            Explore Full Menu
          </button>
        </div>

      </div>
    </section>
  )
}

// ─── Exported Section ─────────────────────────────────────────────────────────

export default function MenuSection() {
  return (
    <>
      {/* Mobile only (< 768px) */}
      <section id="menu" className="block md:hidden">
        <MobileMenuSlider />
      </section>

      {/* Desktop + Tablet only (≥ 768px) */}
      <div className="hidden md:block">
        <DesktopTabletMenu />
      </div>
    </>
  )
}