import React, { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaCarouselType } from "embla-carousel"

gsap.registerPlugin(ScrollTrigger)

interface GalleryItem {
  id: number
  src: string
  alt: string
  shapeClass: string           // Desktop card shape classes
  mobileShape: string          // Mobile carousel slide shape (border-radius only)
  mobileAspect: string         // Mobile aspect ratio class
  parallaxSpeed: number
}

const GALLERY_IMAGES: GalleryItem[] = [
  {
    id: 1,
    src: "/images/frame-images/Momos full.png",
    alt: "Authentic Steamed Momos",
    shapeClass: "rounded-[200px] w-[280px] sm:w-[320px] md:w-[400px] lg:w-[480px] aspect-[3/4]",
    mobileShape: "rounded-[120px]",
    mobileAspect: "aspect-[3/4]",
    parallaxSpeed: 10,
  },
  {
    id: 2,
    src: "/images/frame-images/Bobs special full.png",
    alt: "Bob's Special Momo Platter",
    shapeClass: "rounded-[32px] w-[300px] sm:w-[340px] md:w-[420px] lg:w-[500px] aspect-[3/4]",
    mobileShape: "rounded-[32px]",
    mobileAspect: "aspect-[3/4]",
    parallaxSpeed: 18,
  },
  {
    id: 3,
    src: "/images/frame-images/Quenched full.png",
    alt: "Quenched Refreshments",
    shapeClass: "rounded-full w-[260px] sm:w-[300px] md:w-[380px] lg:w-[460px] aspect-square",
    mobileShape: "rounded-full",
    mobileAspect: "aspect-square",
    parallaxSpeed: 12,
  },
  {
    id: 4,
    src: "/images/frame-images/WhatsApp Image 2026-05-22 at 11.17.09 PM.jpeg",
    alt: "Smashed Momo Preparation",
    shapeClass: "rounded-[32px] w-[300px] sm:w-[340px] md:w-[420px] lg:w-[500px] aspect-[3/4]",
    mobileShape: "rounded-[40px]",
    mobileAspect: "aspect-[4/5]",
    parallaxSpeed: 22,
  },
  {
    id: 5,
    src: "/images/frame-images/spring roll full.png",
    alt: "Crispy Spring Rolls",
    shapeClass: "rounded-t-[200px] rounded-b-[32px] w-[280px] sm:w-[320px] md:w-[400px] lg:w-[480px] aspect-[3/4]",
    mobileShape: "rounded-t-[100px] rounded-b-[32px]",
    mobileAspect: "aspect-[3/4]",
    parallaxSpeed: 15,
  },
  {
    id: 6,
    src: "/images/frame-images/thupla full.png",
    alt: "Flavorful Thukpa Soup",
    shapeClass: "rounded-full w-[260px] sm:w-[300px] md:w-[380px] lg:w-[460px] aspect-square",
    mobileShape: "rounded-full",
    mobileAspect: "aspect-square",
    parallaxSpeed: 25,
  },
]

// ─── Mobile Embla Carousel ────────────────────────────────────────────────────
function MobileGallery({ items }: { items: GalleryItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // 3D Coverflow depth animation function using DOM screen positions to avoid wrap glitches
  const tweenScale = useCallback((emblaApi: EmblaCarouselType) => {
    const viewportNode = emblaApi.rootNode()
    const viewportRect = viewportNode.getBoundingClientRect()
    const viewportCenter = viewportRect.left + viewportRect.width / 2
    const slides = emblaApi.slideNodes()

    slides.forEach((slideNode) => {
      const slideRect = slideNode.getBoundingClientRect()
      const slideCenter = slideRect.left + slideRect.width / 2
      const distance = slideCenter - viewportCenter
      
      const slideWidth = slideRect.width || 200
      const progress = distance / slideWidth
      const absProgress = Math.min(Math.abs(progress), 2)

      // Calculate premium 3D transforms
      const scale = 1 - absProgress * 0.12          // Scale down to 0.88
      const opacity = 1 - absProgress * 0.40        // Opacity down to 0.60
      const rotateY = progress * -25               // Rotate Y to face center
      const translateZ = absProgress * -120         // Move backward in 3D
      const translateX = progress * -15             // Overlap offset
      const zIndex = Math.round(10 - absProgress * 5)

      const innerNode = slideNode.querySelector(".embla-mobile-slide-inner") as HTMLElement
      if (innerNode) {
        innerNode.style.transform = `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`
        innerNode.style.opacity = `${opacity}`
      }
      
      slideNode.style.zIndex = `${zIndex}`
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("scroll", () => tweenScale(emblaApi))

    // Initial transforms calculation
    tweenScale(emblaApi)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect, tweenScale])

  return (
    <div className="mobile-gallery w-full flex flex-col items-center py-2">
      {/* Viewport — py-12 gives breathing room so box-shadows are not clipped */}
      <div className="overflow-hidden w-full py-12" ref={emblaRef} style={{ perspective: "1000px" }}>
        <div className="flex" style={{ transformStyle: "preserve-3d" }}>
          {items.map((item, i) => {
            // Static initial styling before Embla initializes to avoid layout shift
            const isFirst = i === 0
            const isSecond = i === 1
            const isLast = i === items.length - 1
            
            const initialTransform = isFirst 
              ? "translate3d(0px, 0px, 0px) rotateY(0deg) scale(1)"
              : isSecond 
              ? "translate3d(-15px, 0px, -120px) rotateY(-25deg) scale(0.88)"
              : isLast 
              ? "translate3d(15px, 0px, -120px) rotateY(25deg) scale(0.88)"
              : "translate3d(0px, 0px, -240px) rotateY(0deg) scale(0.76)"

            const initialOpacity = isFirst ? 1 : isSecond || isLast ? 0.6 : 0.3
            const initialZIndex = isFirst ? 10 : isSecond || isLast ? 5 : 2

            return (
              <div
                key={item.id}
                className="embla-mobile-slide flex-[0_0_65%] min-w-[190px] max-w-[230px] px-2 relative"
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: initialZIndex,
                }}
              >
                {/* embla-mobile-slide-inner receives the 3D transforms */}
                <div
                  className="embla-mobile-slide-inner w-full flex justify-center will-change-transform"
                  style={{
                    transform: initialTransform,
                    opacity: initialOpacity,
                    transformStyle: "preserve-3d",
                    transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                  }}
                >
                  {/* Outer: shadow + border, NO overflow-hidden so nothing clips */}
                  <div
                    className={`relative w-full ${item.mobileShape} ${item.mobileAspect} shadow-[0_20px_60px_rgba(0,0,0,0.45)] border-[3px] border-white/30`}
                  >
                    {/* Inner: overflow-hidden clips image to the shape */}
                    <div className={`absolute inset-0 ${item.mobileShape} overflow-hidden bg-brand-cream`}>
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover scale-105"
                        loading="lazy"
                        draggable={false}
                      />
                      {/* Subtle vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-2 mt-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi && emblaApi.scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-6 bg-brand-yellow"
                : "w-2 bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function AboutSection() {
  const containerRef    = useRef<HTMLDivElement>(null)
  const trackRef        = useRef<HTMLDivElement>(null)
  const title1Ref       = useRef<HTMLHeadingElement>(null)
  const title2Ref       = useRef<HTMLHeadingElement>(null)
  const descRef         = useRef<HTMLDivElement>(null)
  const btnRef          = useRef<HTMLButtonElement>(null)
  // Mobile-specific refs
  const mobileWrapRef   = useRef<HTMLDivElement>(null)
  const mobileTitle1Ref = useRef<HTMLHeadingElement>(null)
  const mobileTitle2Ref = useRef<HTMLHeadingElement>(null)
  const mobileGalleryRef = useRef<HTMLDivElement>(null)
  const mobileDescRef   = useRef<HTMLDivElement>(null)
  const mobileBtnRef    = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── 1. Desktop & Tablet: Pinned horizontal scroll gallery ──────────────
      gsap.matchMedia().add("(min-width: 768px)", () => {
        if (!containerRef.current || !trackRef.current) return

        const track = trackRef.current
        const container = containerRef.current

        const getScrollAmount = () => {
          const trackWidth = track.scrollWidth
          const windowWidth = window.innerWidth
          return -(trackWidth - windowWidth + 120)
        }

        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.5}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        mainTl
          .fromTo(
            descRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.18, ease: "power3.out" },
            0.1
          )
          .fromTo(
            btnRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.15, ease: "back.out(1.5)" },
            0.2
          )
          // ── Gallery reveals AFTER headings complete ────────────────────────
          .fromTo(
            track,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: "power3.out" },
            0.3
          )
          // ── Horizontal scroll begins once gallery is visible ───────────────
          .to(
            track,
            { x: getScrollAmount, ease: "none" },
            0.45
          )

        const cards = track.querySelectorAll(".gallery-card")
        cards.forEach((card, index) => {
          const img = card.querySelector(".gallery-img")
          const item = GALLERY_IMAGES[index]
          if (img) {
            gsap.fromTo(
              img,
              { xPercent: -item.parallaxSpeed },
              {
                xPercent: item.parallaxSpeed,
                ease: "none",
                scrollTrigger: {
                  trigger: container,
                  start: "top top",
                  end: () => `+=${window.innerHeight * 1.5}`,
                  scrub: 1,
                },
              }
            )
          }
        })
      })

      // ── 2. Mobile: staggered entrance animations ───────────────────────────
      gsap.matchMedia().add("(max-width: 767px)", () => {
        if (!mobileWrapRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: mobileWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })

        tl.fromTo(
          mobileGalleryRef.current,
          { y: 50, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
          0.15
        )
        .fromTo(
          mobileDescRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          0.3
        )
        .fromTo(
          mobileBtnRef.current,
          { scale: 0.88, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)" },
          0.42
        )
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={containerRef}
      className="w-full bg-brand-red text-white relative overflow-hidden flex flex-col justify-between"
      style={{ minHeight: "100vh" }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP / TABLET LAYOUT  (md and above)
          Unchanged — pinned horizontal scrolling gallery
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex w-full h-screen flex-col justify-between py-16 md:py-24">
        {/* Top Header Row */}
        <div className="w-full grid md:grid-cols-12 gap-8 items-end px-6 md:px-12 lg:px-24 relative z-20">
          {/* Left: Title */}
          <div className="md:col-span-7 text-left overflow-hidden">
            <h2
              ref={title1Ref}
              className="font-display font-black text-5xl md:text-8xl lg:text-[7.5vw] leading-[0.8] text-brand-yellow uppercase tracking-tighter"
            >
              ABOUT
            </h2>
            <h2
              ref={title2Ref}
              className="font-display font-black text-5xl md:text-8xl lg:text-[7.5vw] leading-[0.8] text-brand-yellow uppercase tracking-tighter mt-2"
            >
              BOB&apos;S MOMO
            </h2>
          </div>

          {/* Center: Description */}
          <div ref={descRef} className="md:col-span-3 text-left">
            <p className="font-mono text-[20px] md:text-m tracking-wider uppercase text-white/90 leading-relaxed font-semibold">
              BOB&apos;S Momos started from street-side steam and bold Himalayan flavors, serving fresh, handcrafted momos that quickly became a local obsession driven by taste, warmth, and authenticity.

            </p>
          </div>

          {/* Right: CTA */}
          <div className="md:col-span-2 flex md:justify-end">
            <button
              ref={btnRef}
              className="about-btn md:px-10 md:py-3.5 md:text-xs lg:px-14 lg:py-4 lg:text-sm xl:px-16 xl:py-6 xl:text-lg bg-brand-yellow text-brand-charcoal hover:bg-brand-beige font-mono uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
              data-cursor="pointer"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Horizontal Gallery Track */}
        <div className="w-full -mt-12 relative z-30 flex-grow flex items-center">
          <div
            ref={trackRef}
            className="flex flex-row items-center gap-12 px-24 w-auto h-[50vh] mb-24"
          >
            {GALLERY_IMAGES.map((item) => (
              <div
                key={item.id}
                className={`gallery-card relative overflow-hidden bg-brand-cream border border-white/10 shadow-2xl shadow-black/35 group transition-transform duration-500 hover:scale-[1.02] will-change-transform ${item.shapeClass}`}
              >
                <div className="w-full h-full overflow-hidden relative">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="gallery-img w-full h-full object-cover scale-110 transition-transform duration-500 group-hover:scale-115 will-change-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (below md — max-width: 767px)
          Dedicated swipeable Embla carousel with pagination dots
         ═══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={mobileWrapRef}
        className="flex md:hidden flex-col w-full justify-between py-6 px-0"
        style={{ height: "90vh", minHeight: "90vh" }}
      >
        {/* ── Heading ── */}
        <div className="mb-4 px-6">
          <h2 ref={mobileTitle1Ref} className="font-display font-black text-[clamp(3.2rem,16vw,5rem)] leading-[0.85] text-brand-yellow uppercase tracking-tighter">
            ABOUT
          </h2>
          <h2 ref={mobileTitle2Ref} className="font-display font-black text-[clamp(3.2rem,16vw,5rem)] leading-[0.85] text-brand-yellow uppercase tracking-tighter mt-1">
            BOB&apos;S MOMO
          </h2>
        </div>

        {/* ── Embla Carousel Gallery ── */}
        <div ref={mobileGalleryRef} className="w-full px-0">
          <MobileGallery items={GALLERY_IMAGES} />
        </div>

        {/* ── Description ── */}
        <div ref={mobileDescRef} className="mt-4 px-6">
          <p className="font-mono text-sm tracking-wider uppercase text-white/90 leading-relaxed font-semibold">
            BOB&apos;S MOMO WAS BORN OUT OF A PASSION FOR AUTHENTIC HIMALAYAN FLAVORS.
            WE STEAM, FRY, AND SMASH THE FINEST MOMOS IN BHUBANESWAR, DELIVERING
            A JUICY BURST OF TASTE WITH EVERY SINGLE BITE. EST. 2026.
          </p>
        </div>

        {/* ── CTA Button ── */}
        <div className="mt-4 px-6">
          <button
            ref={mobileBtnRef}
            className="px-10 py-4 bg-brand-yellow text-brand-charcoal hover:bg-brand-beige font-mono text-sm uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl active:scale-95"
            data-cursor="pointer"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
