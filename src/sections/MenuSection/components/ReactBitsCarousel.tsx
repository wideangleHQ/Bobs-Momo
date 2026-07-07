// ReactBitsCarousel.tsx
import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import "./Carousel.css"

interface MenuItem {
  id: number
  title: string
  badge: string
  badgeColor: string
  ingredients: string
  price: string
  image: string
}

interface CarouselItemProps {
  item: MenuItem
  index: number
  itemWidth: number
  trackItemOffset: number
  x: any
}

function CarouselItem({ item, index, itemWidth, trackItemOffset, x }: CarouselItemProps) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ]

  // Refined coverflow effects: softer rotateY, softer scale, and controlled z depth
  const rotateY = useTransform(x, range, [25, 0, -25], { clamp: false })
  const scale = useTransform(x, range, [0.88, 1.0, 0.88], { clamp: false })
  const opacity = useTransform(x, range, [0.7, 1.0, 0.7], { clamp: false })
  
  // Custom depth and offset translations
  const translateZ = useTransform(x, range, [-120, 0, -120], { clamp: false })
  const translateX = useTransform(x, range, [25, 0, -25], { clamp: false })
  const zIndex = useTransform(x, range, [5, 10, 5])

  return (
    <motion.div
      className="carousel-item flex flex-col items-center justify-center"
      style={{
        width: itemWidth,
        rotateY,
        scale,
        opacity,
        transformPerspective: 1000,
        z: translateZ,
        x: translateX,
        transformStyle: "preserve-3d",
        zIndex,
      }}
    >
      {/* 1. Category Badge */}
      <span className="carousel-item-badge select-none">
        {item.badge}
      </span>

      {/* 2. Large Food Image (20-25% larger, object-contain, high quality) */}
      <div className="carousel-item-image-wrapper">
        <img
          src={item.image}
          alt={item.title}
          className="carousel-item-image transition-transform duration-500 scale-[1.04]"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* 3. Food Name, Description & Price */}
      <div className="carousel-item-content">
        <h3 className="carousel-item-title font-display text-2xl font-black text-brand-charcoal">
          {item.title}
        </h3>
        <p className="carousel-item-description font-mono text-[11px] text-brand-charcoal/70 uppercase">
          {item.ingredients}
        </p>
        <span className="carousel-item-price font-sans text-sm font-bold text-brand-red">
          {item.price.split("/")[0]}
        </span>
      </div>
    </motion.div>
  )
}

interface ReactBitsCarouselProps {
  items: MenuItem[]
  baseWidth?: number
  autoplay?: boolean
  autoplayDelay?: number
  pauseOnHover?: boolean
  loop?: boolean
  onItemSelect?: (index: number) => void
}

const DRAG_BUFFER = 10
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 }

export default function ReactBitsCarousel({
  items,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  onItemSelect,
}: ReactBitsCarouselProps) {
  // Set padding to 5% on each side so the card occupies exactly 90% of baseWidth
  const containerPadding = baseWidth * 0.05
  const itemWidth = baseWidth - containerPadding * 2
  const trackItemOffset = itemWidth + GAP

  const itemsForRender = useMemo(() => {
    if (!loop) return items
    if (items.length === 0) return []
    return [items[items.length - 1], ...items, items[0]]
  }, [items, loop])

  const [position, setPosition] = useState(loop ? 1 : 0)
  const x = useMotionValue(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Hover detection
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current
      const handleMouseEnter = () => setIsHovered(true)
      const handleMouseLeave = () => setIsHovered(false)
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [pauseOnHover])

  // Autoplay (pauses during drag/hover)
  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined
    if (pauseOnHover && isHovered) return undefined
    if (isAnimating) return undefined

    const timer = setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1))
    }, autoplayDelay)

    return () => clearInterval(timer)
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length, isAnimating])

  // Reset starting position when props change
  useEffect(() => {
    const startingPosition = loop ? 1 : 0
    setPosition(startingPosition)
    x.set(-startingPosition * trackItemOffset)
  }, [items.length, loop, trackItemOffset, x])

  // Bounds check
  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1))
    }
  }, [itemsForRender.length, loop, position])

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS

  const handleAnimationStart = () => {
    setIsAnimating(true)
  }

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false)
      return
    }
    const lastCloneIndex = itemsForRender.length - 1

    if (position === lastCloneIndex) {
      setIsJumping(true)
      const target = 1
      setPosition(target)
      x.set(-target * trackItemOffset)
      requestAnimationFrame(() => {
        setIsJumping(false)
        setIsAnimating(false)
      })
      return
    }

    if (position === 0) {
      setIsJumping(true)
      const target = items.length
      setPosition(target)
      x.set(-target * trackItemOffset)
      requestAnimationFrame(() => {
        setIsJumping(false)
        setIsAnimating(false)
      })
      return
    }

    setIsAnimating(false)
  }

  const handleDragEnd = (_: any, info: any) => {
    const { offset, velocity } = info
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0

    if (direction === 0) return

    setPosition((prev) => {
      const next = prev + direction
      const max = itemsForRender.length - 1
      return Math.max(0, Math.min(next, max))
    })
  }

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        },
      }

  const activeIndex =
    items.length === 0
      ? 0
      : loop
        ? (position - 1 + items.length) % items.length
        : Math.min(position, items.length - 1)

  // Notify parent index change
  useEffect(() => {
    if (onItemSelect) {
      onItemSelect(activeIndex)
    }
  }, [activeIndex, onItemSelect])

  return (
    <div
      ref={containerRef}
      className="carousel-container"
      style={{ width: `${baseWidth}px` }}
    >
      <motion.div
        className="carousel-track"
        drag="x"
        dragElastic={0.2}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            trackItemOffset={trackItemOffset}
            x={x}
          />
        ))}
      </motion.div>
      <div className="carousel-indicators-container">
        <div className="carousel-indicators">
          {items.map((_, index) => (
            <motion.button
              type="button"
              key={index}
              className={`carousel-indicator ${activeIndex === index ? "active" : "inactive"}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index}
              animate={{
                scale: activeIndex === index ? 1.25 : 1,
              }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
