import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ImageRevealProps {
  children: React.ReactNode
  className?: string
  direction?: "left" | "right" | "top" | "bottom"
  delay?: number
}

export function ImageReveal({
  children,
  className = "",
  direction = "left",
  delay = 0,
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    if (!container || !image) return

    let initialClip = "polygon(0 0, 0 0, 0 100%, 0% 100%)" // left
    if (direction === "right") {
      initialClip = "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
    } else if (direction === "top") {
      initialClip = "polygon(0 0, 100% 0, 100% 0, 0 0)"
    } else if (direction === "bottom") {
      initialClip = "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)"
    }

    gsap.set(container, { clipPath: initialClip })
    gsap.set(image, { scale: 1.25 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      })

      tl.to(container, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.2,
        ease: "power4.inOut",
        delay: delay,
      })

      tl.to(image, {
        scale: 1,
        duration: 1.4,
        ease: "power3.out",
        delay: delay,
      }, 0)
    }, container)

    return () => ctx.revert()
  }, [direction, delay])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ willChange: "clip-path" }}
    >
      <div ref={imageRef} className="w-full h-full" style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  )
}
