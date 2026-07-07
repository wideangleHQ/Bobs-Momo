import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface MenuItem {
  id: number
  title: string
  ingredients: string
  price: string
  image: string
  category: string
  tags?: string[]
}

interface MobileCarouselProps {
  items: MenuItem[]
  activeCategory: string
}

export default function MobileCarousel({ items, activeCategory }: MobileCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const lastInteractionRef = useRef(Date.now())

  // Reset index to 0 when category changes
  useEffect(() => {
    setActiveIndex(0)
    lastInteractionRef.current = Date.now()
  }, [activeCategory])

  // Custom Autoplay: slide every 4.5 seconds unless user has interacted recently (within 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - lastInteractionRef.current > 5000) {
        setActiveIndex((prev) => (prev + 1) % items.length)
      }
    }, 4500)
    return () => clearInterval(timer)
  }, [items.length])

  const getOffset = (index: number) => {
    const diff = index - activeIndex
    const half = Math.floor(items.length / 2)
    if (diff > half) return diff - items.length
    if (diff < -half) return diff + items.length
    return diff
  }

  const handleDragEnd = (event: any, info: any) => {
    lastInteractionRef.current = Date.now()
    const swipeThreshold = 40
    if (info.offset.x < -swipeThreshold) {
      setActiveIndex((prev) => (prev + 1) % items.length)
    } else if (info.offset.x > swipeThreshold) {
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
    }
  }

  const getBadgeText = (catId: string) => {
    if (catId === "dumplings") return "DUMPLINGS"
    if (catId === "noodles") return "NOODLES"
    if (catId === "snacks") return "SNACKS"
    return catId.toUpperCase()
  }

  return (
    <div className="w-full flex flex-col items-center overflow-visible py-0">
      {/* 3D Coverflow Viewport Container - height fits card + unclipped shadow */}
      <div
        className="w-full h-[58vh] max-h-[500px] flex items-center justify-center relative overflow-visible"
        style={{ perspective: "1200px" }}
      >
        {items.map((item, index) => {
          const offset = getOffset(index)
          const isCenter = offset === 0
          const isVisible = Math.abs(offset) <= 1

          return (
            <motion.div
              key={item.id}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.65}
              onDragEnd={handleDragEnd}
              style={{
                transformStyle: "preserve-3d",
                zIndex: 10 - Math.abs(offset),
                pointerEvents: isCenter ? "auto" : "none",
              }}
              animate={{
                x: `${offset * 66}vw`,
                scale: isCenter ? 1.0 : 0.85,
                rotateY: 0, // Flat look matching the reference
                z: isCenter ? 0 : -80, // Subtle depth
                opacity: isVisible ? (isCenter ? 1.0 : 0.7) : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 24,
                mass: 1.0,
              }}
              className="absolute w-[76vw] max-w-[310px] h-[54vh] max-h-[460px] bg-white rounded-[2.5rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-brand-charcoal/5 flex flex-col justify-between items-center text-center select-none"
            >
              {/* Product Badge */}
              <span className="text-[11px] font-mono tracking-widest text-brand-red bg-brand-red/10 px-4 py-1.5 rounded-full uppercase font-black shrink-0">
                {getBadgeText(activeCategory)}
              </span>

              {/* Product Image - Centered, occupies 66% of card height */}
              <div className="w-[200%] h-[50%] flex items-center justify-center select-none bg-transparent relative shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>

              {/* Product Details - Name, Description & Price */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 w-full mb-1">
                <h3 className="font-display font-black text-2xl text-brand-charcoal uppercase tracking-tight leading-none">
                  {item.title}
                </h3>
                <p className="font-sans text-[12px] sm:text-[13px] leading-normal text-brand-charcoal/60 max-w-[95%] line-clamp-2 font-medium">
                  {item.ingredients}
                </p>
                <p className="font-mono font-black text-brand-red text-lg tracking-widest mt-0.5">
                  {item.price}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Clean & Modern Pagination Dots */}
      <div className="flex gap-2.5 items-center justify-center mt-2 shrink-0">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveIndex(i)
              lastInteractionRef.current = Date.now()
            }}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex 
                ? "w-6 h-1.5 bg-brand-red shadow-sm" 
                : "w-1.5 h-1.5 bg-brand-charcoal/20 hover:bg-brand-charcoal/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            data-cursor="pointer"
          />
        ))}
      </div>
    </div>
  )
}
