import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  text: string
  className?: string
  stagger?: number
  delay?: number
}

export function TextReveal({ text, className = "", stagger = 0.02, delay = 0 }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const words = container.querySelectorAll(".reveal-word")

    const ctx = gsap.context(() => {
      gsap.from(words, {
        scrollTrigger: {
          trigger: container,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: "110%",
        opacity: 0,
        duration: 0.9,
        stagger: stagger,
        ease: "power4.out",
        delay: delay,
      })
    }, container)

    return () => ctx.revert()
  }, [text, stagger, delay])

  const words = text.split(" ")

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap overflow-hidden py-1 leading-normal ${className}`}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block overflow-hidden mr-[0.25em] pb-[0.05em]"
        >
          <span
            className="reveal-word inline-block transform"
            style={{ willChange: "transform" }}
          >
            {word}
          </span>
        </span>
      ))}
    </div>
  )
}
