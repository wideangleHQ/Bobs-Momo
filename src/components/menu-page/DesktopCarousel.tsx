import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MenuItem } from "../../pages/MenuPage"

interface DesktopCarouselProps {
  items: MenuItem[]
  activeCategory: string
}

interface CardItemProps {
  item: MenuItem
  index: number
  activeIndex: number
  setActiveIndex: (idx: number) => void
  cardWidth: number
  gap: number
  x: any
  cardVariants: any
}

const VegIndicator = ({ isVeg }: { isVeg: boolean }) => (
  <div 
    className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 shrink-0 bg-white/90 rounded-sm shadow-sm ${
      isVeg ? "border-green-600" : "border-red-600"
    }`}
    title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
  >
    <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
  </div>
)

const getCategoryLabel = (category: string) => {
  if (category === "momos") return "MOMOS"
  if (category === "noodles") return "NOODLES"
  if (category === "fried_rice") return "FRIED RICE"
  if (category === "thukpa") return "THUKPA"
  if (category === "snacks") return "SNACKS"
  if (category === "beverages") return "BEVERAGES"
  return category.toUpperCase()
}

function CardItem({
  item,
  index,
  activeIndex,
  setActiveIndex,
  cardWidth,
  gap,
  x,
  cardVariants,
}: CardItemProps) {
  const isCenter = index === activeIndex

  // Track the precise offset of this card from the center of the track
  const cardOffset = useTransform(x, (currentX: number) => currentX + index * (cardWidth + gap))

  // Trigonometric Circular Gallery Math for Curved Bend (bend = 2 baseline)
  const R = (cardWidth + gap) * 3.5 // Radius of curvature

  const rotateY = useTransform(cardOffset, (ox) => {
    const angle = ox / R
    return -angle * (180 / Math.PI) * 1.1 // Curved rotation angle
  })

  const translateY = useTransform(cardOffset, (ox) => {
    const angle = ox / R
    return (1 - Math.cos(angle)) * R * 0.4 // Parabolic vertical arc (bending path)
  })

  const translateZ = useTransform(cardOffset, (ox) => {
    const angle = ox / R
    return (Math.cos(angle) - 1) * R * 0.8 // 3D depth perspective pushing neighbors back
  })

  const translateX = useTransform(cardOffset, (ox) => {
    const angle = ox / R
    return -Math.sin(angle) * R * 0.15 // Overlap adjustment along the circular bend path
  })

  const opacity = useTransform(cardOffset, (ox) => {
    const distance = Math.abs(ox)
    const maxDistance = (cardWidth + gap) * 1.5
    const normalized = Math.min(distance / maxDistance, 1)
    return 1 - normalized * 0.9 // Fade out cards as they recede
  })

  const scale = useTransform(cardOffset, (ox) => {
    const distance = Math.abs(ox)
    const maxDistance = (cardWidth + gap) * 1.5
    const normalized = Math.min(distance / maxDistance, 1)
    return 1.02 - normalized * 0.14 // Scale down cards as they recede
  })

  return (
    <motion.div
      variants={cardVariants}
      onClick={() => {
        if (!isCenter) setActiveIndex(index)
      }}
      whileHover={isCenter ? { y: -6 } : {}}
      style={{
        width: `${cardWidth}px`,
        height: window.innerWidth >= 1200 ? "550px" : "430px",
        transformStyle: "preserve-3d",
        transformPerspective: 1200,
        scale,
        opacity,
        rotateY,
        y: translateY,
        z: translateZ,
        x: translateX,
        zIndex: isCenter ? 30 : 10 - Math.abs(index - activeIndex),
      }}
      className={`group relative flex flex-col justify-between bg-white rounded-[2rem] p-4 border border-brand-charcoal/5 shadow-[0_12px_36px_rgba(26,26,26,0.02)] transition-shadow duration-300 ${
        isCenter ? "shadow-[0_20px_40px_rgba(26,26,26,0.05)] pointer-events-auto" : "pointer-events-auto cursor-pointer"
      }`}
    >
      {/* Image Wrapper - occupies ~88% of card, edge-to-edge cover */}
      <div className="relative w-full h-[88%] rounded-[1.5rem] overflow-hidden bg-brand-cream/40 flex items-center justify-center shrink-0">
        {/* Indicators Overlay */}
        <div className="absolute top-3 left-3 z-20">
          <VegIndicator isVeg={item.isVeg} />
        </div>
        <div className="absolute top-3 right-3 z-20">
          <span className="text-[8px] font-mono tracking-widest text-brand-charcoal/60 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase font-black shadow-sm">
            {getCategoryLabel(item.category)}
          </span>
        </div>

        <img
          src={item.image}
          alt={item.title}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out ${
            isCenter ? "group-hover:scale-105" : "opacity-90"
          }`}
          draggable={false}
        />
      </div>

      {/* Details Section */}
      <div className="w-full flex flex-col justify-end px-1 mt-2 flex-grow">
        <div className="w-full flex items-baseline justify-between gap-2">
          <h3 className="font-display font-black text-xl lg:text-2xl text-brand-charcoal uppercase tracking-tight leading-none text-left">
            {item.title}
          </h3>
          <span className="font-sans font-black text-brand-red text-base lg:text-lg tracking-wider whitespace-nowrap">
            {item.price}
          </span>
        </div>

        {/* Description revealed on center card only */}
        <div className="w-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isCenter ? 1 : 0,
              height: isCenter ? "auto" : 0,
            }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            <p className="font-sans text-[11px] lg:text-[12px] text-brand-charcoal/65 leading-relaxed mt-1 text-left w-full line-clamp-2">
              {item.ingredients}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function DesktopCarousel({ items, activeCategory }: DesktopCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(400)
  const [gap, setGap] = useState(28)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastWheelTime = useRef(0)

  // Track the horizontal position using a MotionValue
  const x = useMotionValue(0)

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0)
  }, [activeCategory])

  // Sync index with motion value position
  useEffect(() => {
    x.set(-activeIndex * (cardWidth + gap))
  }, [activeIndex, cardWidth, gap, x])

  // Track window resizing to scale card widths and gaps
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setCardWidth(400)
        setGap(28)
      } else {
        setCardWidth(300) // Tablet / Small Laptop
        setGap(20)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const slideNext = useCallback(() => {
    if (activeIndex < items.length - 1) {
      setActiveIndex((prev) => prev + 1)
    }
  }, [activeIndex, items.length])

  const slidePrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1)
    }
  }, [activeIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        slideNext()
      } else if (e.key === "ArrowLeft") {
        slidePrev()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [slideNext, slidePrev])

  // Mouse wheel scroll to slide next/prev with touchpad support and cooldown
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const now = Date.now()
      if (now - lastWheelTime.current < 450) return

      const delta = e.deltaY || e.deltaX
      if (Math.abs(delta) > 15) {
        if (delta > 0) {
          if (activeIndex < items.length - 1) {
            setActiveIndex((prev) => prev + 1)
            lastWheelTime.current = now
          }
        } else {
          if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1)
            lastWheelTime.current = now
          }
        }
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [activeIndex, items.length])

  if (items.length === 0) return null

  // Card list container transition animation settings (stagger children on mount)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.25 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 140, damping: 22 },
    },
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[570px] overflow-visible flex items-center justify-center select-none"
    >
      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={slidePrev}
            disabled={activeIndex === 0}
            className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full border border-brand-charcoal/10 bg-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all duration-300"
            aria-label="Previous Item"
          >
            <ChevronLeft size={20} className="text-brand-charcoal" />
          </button>
          <button
            onClick={slideNext}
            disabled={activeIndex === items.length - 1}
            className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full border border-brand-charcoal/10 bg-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all duration-300"
            aria-label="Next Item"
          >
            <ChevronRight size={20} className="text-brand-charcoal" />
          </button>
        </>
      )}

      {/* Outer wrapper */}
      <div className="w-full h-full relative overflow-visible flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full h-full relative overflow-visible flex items-center justify-center"
          >
            <motion.div
              drag="x"
              dragConstraints={{
                left: -(items.length - 1) * (cardWidth + gap),
                right: 0,
              }}
              dragElastic={0.15}
              style={{
                x,
                left: `calc(50% - ${cardWidth / 2}px)`,
                gap: `${gap}px`,
                width: `${items.length * cardWidth + (items.length - 1) * gap}px`,
              }}
              onDragEnd={(e, info) => {
                const { offset, velocity } = info
                const swipeThreshold = 50
                const velocityThreshold = 150

                // Premium inertia snapping
                const velocityCardOffset = Math.round(velocity.x / 550)
                const dragCardOffset = Math.round(offset.x / (cardWidth + gap))
                let indexChange = -dragCardOffset - velocityCardOffset

                if (indexChange === 0) {
                  if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
                    indexChange = 1
                  } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
                    indexChange = -1
                  }
                }

                const targetIndex = Math.max(0, Math.min(items.length - 1, activeIndex + indexChange))
                setActiveIndex(targetIndex)
              }}
              animate={{ x: -activeIndex * (cardWidth + gap) }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              className="absolute flex items-center h-full cursor-grab active:cursor-grabbing will-change-transform"
            >
              {items.map((item, index) => (
                <CardItem
                  key={item.id}
                  item={item}
                  index={index}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                  cardWidth={cardWidth}
                  gap={gap}
                  x={x}
                  cardVariants={cardVariants}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination counter */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 border border-brand-charcoal/10 rounded-full font-mono text-[9px] font-black uppercase tracking-widest text-brand-charcoal bg-white/40 backdrop-blur-sm z-30">
          {activeIndex + 1} OF {items.length}
        </div>
      )}
    </div>
  )
}
