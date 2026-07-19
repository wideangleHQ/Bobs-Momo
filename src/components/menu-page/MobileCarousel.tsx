import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { MenuItem } from "../../pages/MenuPage"

interface MobileCarouselProps {
  items: MenuItem[]
  activeCategory: string
}

interface CardItemProps {
  item: MenuItem
  index: number
  activeIndex: number
  setActiveIndex: (idx: number) => void
  cardWidth: number
  cardHeight: number
  gap: number
  x: any
  cardVariants: any
}

const VegIndicator = ({ isVeg }: { isVeg: boolean }) => (
  <div 
    className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 shrink-0 bg-white/90 rounded-sm shadow-sm ${
      isVeg ? "border-green-600" : "border-red-600"
    }`}
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
  cardHeight,
  gap,
  x,
  cardVariants,
}: CardItemProps) {
  const isCenter = index === activeIndex

  // Track the precise offset of this card from the center of the track (in pixels)
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
    return 1 - normalized * 0.6 // Softer fade on mobile for adjacent cards visibility
  })

  const scale = useTransform(cardOffset, (ox) => {
    const distance = Math.abs(ox)
    const maxDistance = (cardWidth + gap) * 1.5
    const normalized = Math.min(distance / maxDistance, 1)
    return 1.0 - normalized * 0.12 // Scale down neighbor cards slightly
  })

  return (
    <motion.div
      variants={cardVariants}
      onClick={() => {
        if (!isCenter) setActiveIndex(index)
      }}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
        scale,
        opacity,
        rotateY,
        y: translateY,
        z: translateZ,
        x: translateX,
        zIndex: isCenter ? 10 : 5,
      }}
      className={`relative flex flex-col justify-between bg-white rounded-[2rem] p-4 border border-brand-charcoal/5 shadow-[0_8px_24px_rgba(26,26,26,0.02)] transition-shadow duration-300 ${
        isCenter ? "shadow-[0_16px_32px_rgba(26,26,26,0.05)]" : ""
      }`}
    >
      {/* Image Section - occupies ~88% of card, edge-to-edge cover */}
      <div className="relative w-full h-[88%] rounded-[1.5rem] overflow-hidden bg-brand-cream/40 flex items-center justify-center shrink-0">
        {/* Veg Indicator & Category Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 z-20">
          <VegIndicator isVeg={item.isVeg} />
        </div>
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="text-[8px] font-mono tracking-widest text-brand-charcoal/60 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase font-black shadow-sm">
            {getCategoryLabel(item.category)}
          </span>
        </div>

        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover object-center select-none pointer-events-none filter"
          draggable={false}
        />
      </div>

      {/* Details Section below image with reduced gap */}
      <div className="w-full flex flex-col justify-end px-0.5 mt-2 flex-grow">
        <div className="w-full flex items-baseline justify-between gap-1">
          <h3 className="font-display font-black text-lg text-brand-charcoal uppercase tracking-tight leading-none text-left">
            {item.title}
          </h3>
          <span className="font-sans font-black text-brand-red text-sm tracking-wider whitespace-nowrap">
            {item.price}
          </span>
        </div>

        {/* Description displayed when active card is centered */}
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
            <p className="font-sans text-[10px] text-brand-charcoal/65 leading-relaxed mt-1 text-left w-full line-clamp-2">
              {item.ingredients}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function MobileCarousel({ items, activeCategory }: MobileCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 375)
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 667)

  // Track the horizontal position using a MotionValue
  const x = useMotionValue(0)

  // Reset index to 0 when category changes
  useEffect(() => {
    setActiveIndex(0)
  }, [activeCategory])

  // Track window resizing to dynamically compute responsive pixel values
  useEffect(() => {
    const handleResize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Calculate card sizes and gap in pixels dynamically (preserving sizes exactly)
  const cardWidth = vw * 0.70
  const gap = vw * 0.04
  const cardHeight = vh * 0.55

  // Sync active index change to MotionValue
  useEffect(() => {
    x.set(-activeIndex * (cardWidth + gap))
  }, [activeIndex, cardWidth, gap, x])

  if (items.length === 0) return null

  const slideNext = () => {
    if (activeIndex < items.length - 1) {
      setActiveIndex((prev) => prev + 1)
    }
  }

  const slidePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 140, damping: 22 },
    },
  }

  return (
    <div className="w-full flex flex-col items-center overflow-visible select-none py-1">
      {/* Viewport wrapper */}
      <div 
        className="w-full h-[62vh] flex items-center justify-center relative overflow-visible"
        style={{ perspective: "1000px" }}
      >
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
              dragElastic={0.2}
              style={{
                x,
                left: `calc(50% - ${cardWidth / 2}px)`,
                gap: `${gap}px`,
                width: `${items.length * cardWidth + (items.length - 1) * gap}px`,
                transformStyle: "preserve-3d",
              }}
              onDragEnd={(e, info) => {
                const { offset, velocity } = info
                const swipeThreshold = 40
                const velocityThreshold = 150

                // Premium mobile snapping with inertia
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
              transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.9 }}
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
                  cardHeight={cardHeight}
                  gap={gap}
                  x={x}
                  cardVariants={cardVariants}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Indicators / Dots */}
      {items.length > 1 && (
        <div className="flex gap-2 items-center justify-center mt-2 shrink-0 z-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex 
                  ? "w-5 h-1.5 bg-brand-red" 
                  : "w-1.5 h-1.5 bg-brand-charcoal/20"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
