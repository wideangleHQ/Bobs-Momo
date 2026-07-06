import React, { useEffect, useRef } from "react"
import gsap from "gsap"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
    if (isTouchDevice) {
      if (cursorRef.current) {
        cursorRef.current.style.display = "none"
      }
      return
    }

    document.documentElement.classList.add("desktop-cursor-none")

    const cursor = cursorRef.current
    const label = cursorLabelRef.current
    if (!cursor) return

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" })
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" })

    gsap.set(cursor, { xPercent: -50, yPercent: -50 })

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorTarget = target.closest("[data-cursor]") as HTMLElement

      if (cursorTarget) {
        const type = cursorTarget.getAttribute("data-cursor")

        if (type === "pointer") {
          gsap.to(cursor, {
            scale: 2.2,
            backgroundColor: "rgba(227, 41, 41, 0.15)", // Subtle red glow
            borderColor: "#E32929",
            borderWidth: "1px",
            mixBlendMode: "difference",
            duration: 0.25,
            ease: "power2.out",
          })
        } else if (type === "view") {
          if (label) {
            label.innerText = "VIEW"
            gsap.to(label, { opacity: 1, scale: 1, duration: 0.2 })
          }
          gsap.to(cursor, {
            scale: 3.5,
            backgroundColor: "#E32929",
            borderColor: "#E32929",
            borderWidth: "0px",
            mixBlendMode: "normal",
            duration: 0.25,
            ease: "power2.out",
          })
          if (label) {
            gsap.set(label, { color: "#FCFAF6" })
          }
        }
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorTarget = target.closest("[data-cursor]") as HTMLElement

      if (cursorTarget) {
        if (label) {
          gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.15 })
        }
        gsap.to(cursor, {
          scale: 1,
          width: "16px",
          height: "16px",
          borderRadius: "9999px",
          backgroundColor: "transparent",
          borderColor: "rgba(26, 26, 26, 0.4)",
          borderWidth: "2px",
          mixBlendMode: "normal",
          duration: 0.25,
          ease: "power2.out",
        })
      }
    }

    window.addEventListener("mouseover", handleMouseOver)
    window.addEventListener("mouseout", handleMouseOut)

    const handleMouseLeave = () => gsap.to(cursor, { opacity: 0, duration: 0.25 })
    const handleMouseEnter = () => gsap.to(cursor, { opacity: 1, duration: 0.25 })

    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("mouseout", handleMouseOut)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.documentElement.classList.remove("desktop-cursor-none")
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-[16px] h-[16px] border-2 border-brand-charcoal/40 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-normal transition-opacity duration-200"
      style={{ willChange: "transform" }}
    >
      <span
        ref={cursorLabelRef}
        className="text-[6px] font-bold text-brand-beige opacity-0 select-none scale-50 font-mono tracking-tighter"
      ></span>
    </div>
  )
}
