import React, { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MenuItem {
  id: number
  title: string
  ingredients: string
  price: string
  image: string
  category: string
}

interface DesktopCarouselProps {
  items: MenuItem[]
  activeCategory: string
}

function mod(i: number, n: number) {
  return ((i % n) + n) % n
}

function PriceFormatter({ price }: { price: string }) {
  const segments = price.split("/").map((s) => s.trim())
  return (
    <span className="font-mono font-black text-xs md:text-sm tracking-widest uppercase">
      {segments.map((seg, idx) => {
        if (seg.includes(":")) {
          const parts = seg.split(":")
          return (
            <React.Fragment key={idx}>
              <span className="text-brand-charcoal">{parts[0]}: </span>
              <span className="text-brand-red">{parts[1].trim()}</span>
              {idx < segments.length - 1 && <span className="text-brand-charcoal/30 mx-3">/</span>}
            </React.Fragment>
          )
        } else {
          return (
            <React.Fragment key={idx}>
              <span className="text-brand-red">{seg}</span>
              {idx < segments.length - 1 && <span className="text-brand-charcoal/30 mx-3">/</span>}
            </React.Fragment>
          )
        }
      })}
    </span>
  )
}

export default function DesktopCarousel({ items, activeCategory }: DesktopCarouselProps) {
  const [centerIndex, setCenterIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const len = items.length

  // Reset index when category changes
  useEffect(() => {
    setCenterIndex(0)
  }, [activeCategory])

  const slide = useCallback(
    (dir: 1 | -1) => {
      if (animating || len <= 1) return
      setAnimating(true)
      setCenterIndex((p) => mod(p + dir, len))
      setTimeout(() => setAnimating(false), 600)
    },
    [animating, len]
  )

  const slideNext = () => slide(1)
  const slidePrev = () => slide(-1)

  if (len === 0) return null

  return (
    <div className="w-full flex flex-col items-center select-none py-4 relative">
      {/* Carousel Track Container */}
      <div 
        className="w-full flex items-center justify-center relative overflow-visible"
        style={{ height: "clamp(380px, 48vh, 520px)" }}
      >
        {items.map((item, index) => {
          let offset = index - centerIndex
          if (offset > len / 2) offset -= len
          if (offset < -len / 2) offset += len

          const isCenter = offset === 0
          const isLeft = offset === -1
          const isRight = offset === 1
          const isVisible = Math.abs(offset) <= 1

          // Positions and dimensions to match the reference exactly
          const scale = isCenter ? 1.0 : 0.72
          const opacity = isVisible ? (isCenter ? 1.0 : 0.6) : 0
          const zIndex = isCenter ? 30 : 15

          // Precise horizontal translation percentages
          let translateXPct = offset * 32
          if (offset === 0) translateXPct = 0

          return (
            <div
              key={item.id}
              className="absolute inset-0 flex flex-col items-center justify-start transition-all duration-600 ease-out-quint will-change-transform"
              style={{
                transform: `translateX(${translateXPct}%) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: isVisible ? "auto" : "none",
                transition: "transform 600ms cubic-bezier(0.25, 1, 0.5, 1), opacity 600ms cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              {/* Product Image Frame */}
              <div 
                className="relative flex items-center justify-center bg-transparent"
                style={{ 
                  width: isCenter ? "clamp(280px, 24vw, 360px)" : "clamp(180px, 16vw, 240px)",
                  height: isCenter ? "clamp(240px, 20vw, 320px)" : "clamp(150px, 13vw, 210px)"
                }}
              >
                {/* Rotated circular Badge for center product */}
                {isCenter && (
                  <div className="absolute top-4 left-[12%] w-14 h-14 rounded-full bg-brand-yellow text-brand-charcoal font-display font-black text-[9px] flex flex-col items-center justify-center text-center uppercase tracking-tighter border-2 border-white shadow-md rotate-[-12deg] z-25 leading-tight select-none">
                    <span>BOB'S</span>
                    <span className="text-brand-red">BEST</span>
                  </div>
                )}

                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-contain pointer-events-none filter ${
                    isCenter 
                      ? "drop-shadow-[0_24px_48px_rgba(0,0,0,0.12)]" 
                      : "drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
                  }`}
                  draggable={false}
                />

                {/* Left Navigation Arrow Overlay on Left Card */}
                {isLeft && (
                  <button
                    onClick={slidePrev}
                    disabled={animating}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full border border-brand-red/35 bg-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200"
                    aria-label="Previous Item"
                    data-cursor="pointer"
                  >
                    <ChevronLeft size={18} className="text-brand-red" />
                  </button>
                )}

                {/* Right Navigation Arrow Overlay on Right Card */}
                {isRight && (
                  <button
                    onClick={slideNext}
                    disabled={animating}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full border border-brand-red/35 bg-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-200"
                    aria-label="Next Item"
                    data-cursor="pointer"
                  >
                    <ChevronRight size={18} className="text-brand-red" />
                  </button>
                )}
              </div>

              {/* Product Details below Image */}
              <div 
                className="text-center mt-4 flex flex-col items-center gap-1.5 px-4"
                style={{ 
                  width: isCenter ? "clamp(340px, 30vw, 460px)" : "clamp(240px, 20vw, 300px)",
                  opacity: isCenter ? 1.0 : 0.65 
                }}
              >
                {/* Title */}
                <h3 className={`font-display font-black uppercase tracking-tight text-brand-charcoal ${
                  isCenter ? "text-xl md:text-2xl" : "text-sm md:text-base"
                }`}>
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-mono text-[10px] md:text-[11px] font-bold text-brand-charcoal/70 uppercase leading-relaxed max-w-sm tracking-wide">
                  <span className="text-brand-charcoal">INGREDIENTS: </span>
                  {item.ingredients}
                </p>

                {/* Price Format */}
                <PriceFormatter price={item.price} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Center Counter (e.g. 1 OF 4) */}
      {len > 1 && (
        <div className="mt-8 px-5 py-2 border border-brand-charcoal/20 rounded-full font-mono text-[10px] font-black uppercase tracking-widest text-brand-charcoal bg-white/40 shadow-sm shrink-0">
          {centerIndex + 1} OF {len}
        </div>
      )}
    </div>
  )
}
