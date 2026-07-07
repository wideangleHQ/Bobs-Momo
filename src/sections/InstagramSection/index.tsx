import React, { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Instagram } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaCarouselType } from "embla-carousel"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL MEDIA POSTS
// ─────────────────────────────────────────────────────────────────────────────
const POSTS = [
  {
    image: "/Images/Social-Media/1.png",
    href: "https://www.instagram.com/reel/DUCu5JviZTH/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: "Steamed to perfection 🫶",
  },
  {
    image: "/Images/Social-Media/2.png",
    href: "https://www.instagram.com/reel/DR3xJ9BCdHJ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: "Bob's Special is calling your name 🔥",
  },
  {
    image: "/Images/Social-Media/3.png",
    href: "https://www.instagram.com/reel/DNYSXYmxqTB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: "Stay quenched, stay happy 🥤",
  },
  {
    image: "/Images/Social-Media/4.png",
    href: "https://www.instagram.com/reel/DV0x7igExZv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    caption: "Crispy on the outside, juicy inside 🌯",
  },
  // {
  //   image: "/images/Social-Media/5.png",
  //   href:  "https://instagram.com/bobsmomo",
  //   caption: "Warm your soul with thukpa 🍜",
  // },
]

// 9:16 exact aspect ratio of the 1080x1920 images
const ASPECT_RATIO = 0.5625

// Stagger offsets for a premium masonry feel across responsive grids
const STAGGER_CLASSES = [
  "", // Card 0 (Col 1) - Baseline
  "min-[480px]:translate-y-6 md:translate-y-8 min-[1366px]:translate-y-10", // Card 1 (Col 2) - Always shifted down
  "", // Card 2 (Col 3) - Baseline
  "min-[480px]:translate-y-6 md:translate-y-0 min-[1366px]:translate-y-10", // Card 3 (Col 4 on desktop, Col 2 on mobile) - Shifted in 2-col and 4-col
  "md:translate-y-8 min-[1366px]:translate-y-0" // Card 4 (Col 2 on tablet) - Shifted only in 3-col
]

// ─── Shared hover overlay component ─────────────────────────────────────────
function HoverOverlay() {
  return (
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 ease-out flex items-center justify-center pointer-events-none">
      <div className="opacity-0 group-hover:opacity-100 transition-all duration-400 scale-75 group-hover:scale-100 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
          <Instagram size={22} className="text-white" />
        </div>
        <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
          View Post
        </span>
      </div>
    </div>
  )
}

// ─── Single image card ────────────────────────────────────────────────────────
interface CardProps {
  post: typeof POSTS[number]
  index: number
  className?: string
  style?: React.CSSProperties
}
function PostCard({ post, index, className = "", style }: CardProps) {
  return (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`insta-card group relative block overflow-hidden shadow-xl will-change-transform bg-transparent w-full aspect-[9/16] rounded-2xl ${className}`}
      style={style}
      data-cursor="pointer"
      aria-label={`View Instagram post ${index + 1}`}
    >
      {/* object-cover — the frame fits the image exactly since the aspect ratios match */}
      <img
        src={post.image}
        alt={post.caption}
        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.04] will-change-transform pointer-events-none"
        loading="lazy"
        draggable={false}
      />
      {/* Bottom gradient + caption */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
        <p className="text-white font-mono text-[11px] leading-snug">{post.caption}</p>
      </div>
      <HoverOverlay />
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────
export default function InstagramSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const mobileGalleryRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLDivElement>(null)

  // Mobile Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Click handler to prevent links from triggering while dragging the slider
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (!emblaApi || !emblaApi.clickAllowed()) {
      e.preventDefault()
    }
  }, [emblaApi])

  // Custom 3D Coverflow animation function using DOM screen positions to avoid loop wrap glitches
  const tweenScale = useCallback((emblaApi: EmblaCarouselType) => {
    const viewportNode = emblaApi.rootNode()
    const viewportRect = viewportNode.getBoundingClientRect()
    const viewportCenter = viewportRect.left + viewportRect.width / 2
    const slides = emblaApi.slideNodes()

    slides.forEach((slideNode) => {
      const slideRect = slideNode.getBoundingClientRect()
      const slideCenter = slideRect.left + slideRect.width / 2
      const distance = slideCenter - viewportCenter

      const slideWidth = slideRect.width || 210
      const progress = distance / slideWidth
      const absProgress = Math.min(Math.abs(progress), 2)

      // Calculate premium 3D transforms
      const scale = 1 - absProgress * 0.12          // Softer scale down to 0.88
      const opacity = 1 - absProgress * 0.40        // Softer opacity down to 0.60
      const rotateY = progress * -25               // Softer rotate to face center
      const translateZ = absProgress * -120         // Move backward in 3D
      const translateX = progress * -15             // Overlap offset
      const zIndex = Math.round(10 - absProgress * 5)

      const innerNode = slideNode.querySelector(".embla-mobile-slide-inner") as HTMLElement
      if (innerNode) {
        innerNode.style.transform = `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`
        innerNode.style.opacity = `${opacity}`
      }

      // Update parent wrapper's z-index dynamically to prevent iOS Safari overlay issues
      slideNode.style.zIndex = `${zIndex}`
    })
  }, [])

  // Auto-play timer setup (pauses during swipe/drag, resumes after 3s)
  useEffect(() => {
    if (!emblaApi) return

    let autoplayTimer: any = null

    const startAutoplay = () => {
      stopAutoplay()
      autoplayTimer = setInterval(() => {
        if (emblaApi) {
          emblaApi.scrollNext()
        }
      }, 4000)
    }

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer)
        autoplayTimer = null
      }
    }

    startAutoplay()

    // Pause on user pointer down, wait 3s before resuming after release
    emblaApi.on("pointerDown", stopAutoplay)

    let resumeTimeout: any = null
    const handlePointerUp = () => {
      if (resumeTimeout) clearTimeout(resumeTimeout)
      resumeTimeout = setTimeout(() => {
        startAutoplay()
      }, 3000)
    }

    emblaApi.on("pointerUp", handlePointerUp)

    return () => {
      stopAutoplay()
      if (resumeTimeout) clearTimeout(resumeTimeout)
      emblaApi.off("pointerDown", stopAutoplay)
      emblaApi.off("pointerUp", handlePointerUp)
    }
  }, [emblaApi])

  // Attach Embla events
  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("scroll", () => tweenScale(emblaApi))

    // Initial scale values
    tweenScale(emblaApi)
  }, [emblaApi, onSelect, tweenScale])

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(
        Array.from(headingRef.current?.children ?? []),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        }
      )

      // Desktop cards stagger
      const desktopCards = galleryRef.current?.querySelectorAll(".insta-card")
      if (desktopCards?.length) {
        gsap.fromTo(
          desktopCards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: galleryRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          }
        )
      }

      // Mobile gallery entrance
      if (mobileGalleryRef.current) {
        gsap.fromTo(
          mobileGalleryRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: mobileGalleryRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          }
        )
      }

      // CTA
      gsap.fromTo(btnRef.current, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.4)",
        scrollTrigger: { trigger: btnRef.current, start: "top 92%", toggleActions: "play none none reverse" },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="social"
      ref={sectionRef}
      className="w-full text-brand-charcoal overflow-hidden py-5 md:py-24 relative flex flex-col justify-center bg-[#FDFBF7]"
      style={{
        height: typeof window !== "undefined" && window.innerWidth < 768 ? "90vh" : undefined,
        minHeight: typeof window !== "undefined" && window.innerWidth < 768 ? "90vh" : "100vh"
      }}
    >
      {/* Dynamic inline styles for the premium caption fade-in transition */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes mobileCaptionFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 0.75; transform: translateY(0); }
        }
        .animate-caption-fade {
          animation: mobileCaptionFade 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}} />

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

      <div className="relative w-full max-w-[1600px] mx-auto px-0 md:px-12 lg:px-16">

        {/* ── Heading ── */}
        <div ref={headingRef} className="text-center mb-2 md:mb-16 space-y-1.5 px-6 md:px-0">
          <span className="text-[13px] md:text-xs font-mono font-bold tracking-[0.25em] text-brand-red uppercase block">
            @BOBSMOMO
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter text-brand-charcoal uppercase leading-none">
            JOIN OUR COMMUNITY
          </h2>
          <p className="font-mono text-[9px] md:text-sm tracking-wider uppercase text-brand-charcoal/50 font-medium max-w-sm mx-auto leading-relaxed pt-1">
            Follow the momo journey — behind the scenes, specials & more.
          </p>
        </div>

        {/* ── DESKTOP/TABLET RESPONSIVE GRID (visible >=768px only) ────────────────── */}
        <div
          ref={galleryRef}
          className="hidden md:grid md:grid-cols-3 min-[1366px]:grid-cols-4 gap-6 md:gap-8 lg:gap-10 justify-center px-2 pb-16"
        >
          {POSTS.map((post, i) => (
            <div key={i} className={`w-full ${STAGGER_CLASSES[i]} transition-transform duration-500`}>
              <PostCard
                post={post}
                index={i}
              />
            </div>
          ))}
        </div>

        {/* ── MOBILE 3D COVERFLOW GALLERY (visible <768px only) ───────────────────── */}
        <div ref={mobileGalleryRef} className="block md:hidden w-full relative select-none pb-0.5 mt-0.5 px-0">
          <div
            className="embla-mobile-viewport overflow-hidden w-full py-12 px-0" // Increased padding to prevent shadow clipping cuts, full-width viewport
            ref={emblaRef}
            style={{ perspective: "1000px" }}
          >
            <div
              className="embla-mobile-container flex"
              style={{ transformStyle: "preserve-3d" }}
            >
              {POSTS.map((post, i) => {
                // Static initial styling before Embla initializes to avoid layout shift
                const isFirst = i === 0
                const isSecond = i === 1
                const isLast = i === POSTS.length - 1

                const initialTransform = isFirst
                  ? "translate3d(0px, 0px, 0px) rotateY(0deg) scale(1)"
                  : isSecond
                    ? "translate3d(-15px, 0px, -120px) rotateY(-25deg) scale(0.88)"
                    : isLast
                      ? "translate3d(15px, 0px, -120px) rotateY(25deg) scale(0.88)"
                      : "translate3d(0px, 0px, -240px) rotateY(0deg) scale(0.76)"

                const initialOpacity = isFirst ? 1 : isSecond || isLast ? 0.65 : 0.3
                const initialZIndex = isFirst ? 10 : isSecond || isLast ? 5 : 2

                return (
                  <div
                    key={i}
                    className="embla-mobile-slide flex-[0_0_55%] min-w-[180px] max-w-[210px] px-2 relative"
                    style={{
                      transformStyle: "preserve-3d",
                      zIndex: initialZIndex,
                    }}
                  >
                    <a
                      href={post.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleCardClick}
                      className="embla-mobile-slide-inner group relative block aspect-[9/16] w-full rounded-[20px] overflow-hidden shadow-2xl bg-transparent will-change-transform"
                      style={{
                        transform: initialTransform,
                        opacity: initialOpacity,
                        transformStyle: "preserve-3d",
                        transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                      }}
                      data-cursor="pointer"
                      aria-label={`View Instagram post ${i + 1}`}
                    >
                      <img
                        src={post.image}
                        alt={post.caption}
                        className="w-full h-full object-cover pointer-events-none"
                        loading="lazy"
                        draggable={false}
                      />
                      {/* Caption overlay on card hover/focus */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/20 to-transparent p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                        <p className="text-white font-mono text-[11px] leading-snug">{post.caption}</p>
                      </div>

                      {/* Brand Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 ease-out flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-400 scale-75 group-hover:scale-100 flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                            <Instagram size={20} className="text-white" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Centered Active Card Caption display below the slider */}
          <div className="h-8 flex items-center justify-center mt-0 px-6 text-center">
            <p
              key={selectedIndex}
              className="text-brand-charcoal font-mono text-sm tracking-wider uppercase font-semibold animate-caption-fade"
            >
              {POSTS[selectedIndex]?.caption}
            </p>
          </div>
        </div>

        {/* ── CTA Button ── */}
        <div ref={btnRef} className="flex justify-center mt-1.5 md:mt-8 px-6 md:px-0">
          <a
            href="https://www.instagram.com/bobsmomo.qsr/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-brand-charcoal text-brand-beige hover:bg-brand-red font-mono text-[13px] md:text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
            data-cursor="pointer"
          >
            <Instagram size={16} />
            Follow on Instagram
          </a>
        </div>

      </div>
    </section>
  )
}