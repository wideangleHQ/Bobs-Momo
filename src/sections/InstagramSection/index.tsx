import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Instagram } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL MEDIA POSTS
// ─────────────────────────────────────────────────────────────────────────────
const POSTS = [
  {
    image: "/public/images/Social-Media/1.png",
    href:  "https://instagram.com/bobsmomo",
    caption: "Steamed to perfection 🫶",
  },
  {
    image: "/public/images/Social-Media/2.png",
    href:  "https://instagram.com/bobsmomo",
    caption: "Bob's Special is calling your name 🔥",
  },
  {
    image: "/public/images/Social-Media/3.png",
    href:  "https://instagram.com/bobsmomo",
    caption: "Stay quenched, stay happy 🥤",
  },
  {
    image: "/public/images/Social-Media/4.png",
    href:  "https://instagram.com/bobsmomo",
    caption: "Crispy on the outside, juicy inside 🌯",
  },
  // {
  //   image: "/public/images/Social-Media/5.png",
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
  const btnRef     = useRef<HTMLDivElement>(null)

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
      // Cards stagger
      const cards = galleryRef.current?.querySelectorAll(".insta-card")
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: galleryRef.current, start: "top 80%", toggleActions: "play none none reverse" },
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
      className="w-full text-brand-charcoal overflow-hidden py-16 md:py-24 relative flex flex-col justify-center bg-[#FDFBF7]"
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

      <div className="relative w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">

        {/* ── Heading ──────────────────────────────────────────────────── */}
        <div ref={headingRef} className="text-center mb-12 md:mb-16 space-y-2">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-brand-red uppercase block">
            @BOBSMOMO
          </span>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter text-brand-charcoal uppercase leading-none">
            JOIN OUR COMMUNITY
          </h2>
          <p className="font-mono text-xs md:text-sm tracking-wider uppercase text-brand-charcoal/50 font-medium max-w-sm mx-auto leading-relaxed pt-1">
            Follow the momo journey — behind the scenes, specials & more.
          </p>
        </div>

        {/* ── RESPONSIVE GRID ─────────────────────────────────────────── */}
        <div
          ref={galleryRef}
          className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 min-[1366px]:grid-cols-4 gap-6 md:gap-8 lg:gap-10 justify-center px-2 pb-16"
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

        {/* ── CTA Button ───────────────────────────────────────────────── */}
        <div ref={btnRef} className="flex justify-center mt-10 md:mt-12">
          <a
            href="https://instagram.com/bobsmomo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-brand-charcoal text-brand-beige hover:bg-brand-red font-mono text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
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