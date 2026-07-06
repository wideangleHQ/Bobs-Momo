import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface GalleryItem {
  id: number
  src: string
  alt: string
  shapeClass: string
  parallaxSpeed: number // speed multiplier for parallax (e.g. 10 to 30)
}

const GALLERY_IMAGES: GalleryItem[] = [
  {
    id: 1,
    src: "/images/frame-images/Momos full.png",
    alt: "Authentic Steamed Momos",
    shapeClass: "rounded-[200px] w-[300px] md:w-[480px] aspect-[3/4]",
    parallaxSpeed: 10,
  },
  {
    id: 2,
    src: "/images/frame-images/Bobs special full.png",
    alt: "Bob's Special Momo Platter",
    shapeClass: "rounded-[32px] w-[320px] md:w-[500px] aspect-[3/4]",
    parallaxSpeed: 18,
  },
  {
    id: 3,
    src: "/images/frame-images/Quenched full.png",
    alt: "Quenched Refreshments",
    shapeClass: "rounded-full w-[280px] md:w-[460px] aspect-square",
    parallaxSpeed: 12,
  },
  {
    id: 4,
    src: "/images/frame-images/WhatsApp Image 2026-05-22 at 11.17.09 PM.jpeg",
    alt: "Smashed Momo Preparation",
    shapeClass: "rounded-[32px] w-[320px] md:w-[500px] aspect-[3/4]",
    parallaxSpeed: 22,
  },
  {
    id: 5,
    src: "/images/frame-images/spring roll full.png",
    alt: "Crispy Spring Rolls",
    shapeClass: "rounded-t-[200px] rounded-b-[32px] w-[300px] md:w-[480px] aspect-[3/4]",
    parallaxSpeed: 15,
  },
  {
    id: 6,
    src: "/images/frame-images/thupla full.png",
    alt: "Flavorful Thukpa Soup",
    shapeClass: "rounded-full w-[280px] md:w-[460px] aspect-square",
    parallaxSpeed: 25,
  },
]

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const title1Ref = useRef<HTMLHeadingElement>(null)
  const title2Ref = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Desktop & Tablet Layout: Pinned scroll horizontal gallery
      gsap.matchMedia().add("(min-width: 768px)", () => {
        if (!containerRef.current || !trackRef.current) return

        const track = trackRef.current
        const container = containerRef.current

        // Calculate total scrollable width
        const getScrollAmount = () => {
          const trackWidth = track.scrollWidth
          const windowWidth = window.innerWidth
          return -(trackWidth - windowWidth + 120) // Add margin offset for premium breathing room
        }

        // Entrance timeline linked to the main ScrollTrigger
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.5}`, // 2.5x viewport height scroll length
            pin: true,
            scrub: 1, // smooth scroll scrubbing
            anticipatePin: 1, // prevents visual stutters when pinning starts
            invalidateOnRefresh: true, // handles dynamic screen size changes
          },
        })

        // Setup individual sub-animations synchronized within the single ScrollTrigger progress
        mainTl
          // 0% - 15%: Title entrance
          .fromTo(
            [title1Ref.current, title2Ref.current],
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, stagger: 0.05, ease: "power3.out" },
            0
          )
          // 10% - 25%: Description entrance
          .fromTo(
            descRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: "power3.out" },
            0.1
          )
          // 15% - 30%: Button entrance
          .fromTo(
            btnRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(1.5)" },
            0.15
          )
          // 20% - 40%: Gallery slide up
          .fromTo(
            track,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" },
            0.2
          )
          // 35% - 95%: Horizontal translation of the gallery track
          .to(
            track,
            {
              x: getScrollAmount,
              ease: "none",
            },
            0.35
          )

        // Subtle image parallax animations during scroll
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
                  end: () => `+=${window.innerHeight * 2.5}`,
                  scrub: 1,
                },
              }
            );
          }
        })
      })

      // 2. Mobile Layout: Vertical stack scroll entrance animation
      gsap.matchMedia().add("(max-width: 767px)", () => {
        // Entrance animations for headers
        gsap.fromTo(
          [title1Ref.current, title2Ref.current],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: title1Ref.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        )

        // Description entrance
        gsap.fromTo(
          descRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: descRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        )

        // Button entrance
        gsap.fromTo(
          btnRef.current,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: btnRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        )

        // Card reveal animations as they enter the screen
        const cards = document.querySelectorAll(".gallery-card")
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          )
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={containerRef}
      className="w-full bg-brand-red text-white py-16 md:py-24 relative overflow-hidden flex flex-col justify-between h-screen"
      style={{ minHeight: "100vh" }}
    >
      {/* Top Header Row (Title, Description, Button) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-end px-6 md:px-12 lg:px-24 relative z-20">
        {/* Left: Main Typography */}
        <div className="md:col-span-7 text-left overflow-hidden">
          <h2
            ref={title1Ref}
            className="font-display font-black text-6xl md:text-8xl lg:text-[7.5vw] leading-[0.8] text-brand-yellow uppercase tracking-tighter"
          >
            ABOUT
          </h2>
          <h2
            ref={title2Ref}
            className="font-display font-black text-6xl md:text-8xl lg:text-[7.5vw] leading-[0.8] text-brand-yellow uppercase tracking-tighter mt-2"
          >
            BOB&apos;S MOMO
          </h2>
        </div>

        {/* Center: Story Description */}
        <div ref={descRef} className="md:col-span-3 text-left">
          <p className="font-mono text-[20px] md:text-m tracking-wider uppercase text-white/90 leading-relaxed font-semibold">
            BOB&apos;S MOMO WAS BORN OUT OF A PASSION FOR AUTHENTIC HIMALAYAN FLAVORS. WE STEAM, FRY, AND SMASH THE FINEST MOMOS IN GENEVA, DELIVERING A JUICY BURST OF TASTE WITH EVERY SINGLE BITE. EST. 2026.
          </p>
        </div>

        {/* Right: Learn More CTA */}
        <div className="md:col-span-2 flex md:justify-end">
          <button
            ref={btnRef}
            className="about-btn px-16 py-6 bg-brand-yellow text-brand-charcoal hover:bg-brand-beige font-mono text-lg uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
            data-cursor="pointer"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Horizontal Gallery Track (Desktop) / Vertical Stack (Mobile) */}
      <div className="w-full -mt-24 md:-mt-12 relative z-30 flex-grow flex items-center">
        <div
          ref={trackRef}
          className="flex flex-col md:flex-row items-center gap-8 md:gap-12 px-6 md:px-24 w-full md:w-auto h-auto md:h-[50vh] mb-20 md:mb-24"
        >
          {GALLERY_IMAGES.map((item) => (
            <div
              key={item.id}
              className={`gallery-card relative overflow-hidden bg-brand-cream border border-white/10 shadow-2xl shadow-black/35 group transition-transform duration-500 hover:scale-[1.02] will-change-transform mb-12 md:mb-0 ${item.shapeClass}`}
            >
              {/* Image with Parallax & Hover scale effect */}
              <div className="w-full h-full overflow-hidden relative">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="gallery-img w-full h-full object-cover scale-110 transition-transform duration-500 group-hover:scale-115 will-change-transform"
                  loading="lazy"
                />
                {/* Subtle vignette/overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
