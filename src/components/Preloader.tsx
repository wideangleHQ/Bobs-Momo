import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { useAppStore } from "../store"

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const finishLoading = useAppStore((state) => state.finishLoading)

  useEffect(() => {
    const container = containerRef.current
    const numberText = numberRef.current
    const line = lineRef.current
    const textLetters = textRef.current?.querySelectorAll(".letter")

    if (!container || !numberText || !line) return

    const tl = gsap.timeline({
      onComplete: () => {
        finishLoading()
        gsap.set(container, { display: "none" })
      }
    })

    // Initial States
    gsap.set(container, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" })
    gsap.set(line, { scaleX: 0, transformOrigin: "left" })
    if (textLetters) {
      gsap.set(textLetters, { y: "100%" })
    }

    const counter = { val: 0 }
    tl.to(counter, {
      val: 100,
      duration: 2.0,
      ease: "power2.out",
      onUpdate: () => {
        const formatted = Math.floor(counter.val).toString().padStart(3, "0")
        numberText.innerText = formatted
      }
    }, "start")

    tl.to(line, {
      scaleX: 1,
      duration: 2.0,
      ease: "power2.out",
    }, "start")

    if (textLetters && textLetters.length > 0) {
      tl.to(textLetters, {
        y: "0%",
        duration: 0.8,
        stagger: 0.04,
        ease: "power4.out",
      }, "start+=0.3")
    }

    // Slide up clip-path outro
    tl.to(container, {
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
      duration: 1.0,
      ease: "power4.inOut",
      delay: 0.2
    })

    tl.to([numberText, textRef.current, line], {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    }, "-=0.8")

  }, [finishLoading])

  const title = "PRETTYPATTY"

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-brand-charcoal z-[99999] flex flex-col justify-between p-8 md:p-12 select-none pointer-events-auto"
      style={{ willChange: "clip-path" }}
    >
      <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-brand-beige/40 uppercase">
        <span>KITCHEN RUNNING</span>
        <span>EST. 2024 // GENEVA</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div
          ref={textRef}
          className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter text-brand-beige overflow-hidden flex"
        >
          {title.split("").map((letter, i) => (
            <span
              key={i}
              className="letter inline-block transform"
              style={{ willChange: "transform" }}
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[10px] font-mono tracking-widest text-brand-red uppercase font-semibold">
          DAMN TASTY SMASHED BURGERS
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-brand-beige/40 uppercase block">
              PREHEATING GRIDDLE
            </span>
            <span className="text-xs font-mono text-brand-beige/60 block">
              Smashed to perfection...
            </span>
          </div>
          <div
            ref={numberRef}
            className="text-5xl sm:text-7xl font-display font-bold text-brand-red font-mono tracking-tighter leading-none"
          >
            000
          </div>
        </div>

        <div className="w-full h-[1px] bg-brand-beige/10 relative">
          <div
            ref={lineRef}
            className="absolute inset-0 bg-brand-red origin-left h-full"
            style={{ willChange: "transform" }}
          />
        </div>
      </div>
    </div>
  )
}
