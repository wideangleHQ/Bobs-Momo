import React, { useEffect, useRef, useState } from "react"
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
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        const formatted = Math.floor(counter.val).toString().padStart(3, "0")
        numberText.innerText = formatted
      }
    }, "start")

    tl.to(line, {
      scaleX: 1,
      duration: 2.2,
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

  const title = "BOB'S MOMO"
  const words = title.split(" ")

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-screen bg-brand-red z-[99999] flex flex-col justify-between p-6 md:p-12 select-none pointer-events-auto h-[90vh] md:h-screen min-h-[90vh] md:min-h-screen"
      style={{
        willChange: "clip-path"
      }}
    >
      {/* CSS Steam Animation Style */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes steamAnimation {
          0% {
            transform: translateY(4px) scaleX(1);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(-8px) scaleX(1.15);
            opacity: 0.45;
          }
          100% {
            transform: translateY(-22px) scaleX(0.85);
            opacity: 0;
          }
        }
        .steam-line-1 {
          animation: steamAnimation 2.4s infinite ease-in-out;
          transform-origin: bottom center;
        }
        .steam-line-2 {
          animation: steamAnimation 2.4s infinite ease-in-out 0.8s;
          transform-origin: bottom center;
        }
        .steam-line-3 {
          animation: steamAnimation 2.4s infinite ease-in-out 1.6s;
          transform-origin: bottom center;
        }
      `}} />

      <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-white/40 uppercase flex-shrink-0">
        <span>STEAMED WITH LOVE</span>
        <span>4.6 Rating // BHUBANESWAR</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow py-4">
        {/* Steam Animation only */}
        <div className="mb-4 relative flex flex-col items-center">
          <svg className="w-16 h-12 overflow-visible" viewBox="0 0 60 40">
            <path
              className="steam-line-1"
              d="M18,35 Q14,23 18,13 T18,0"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="steam-line-2"
              d="M30,35 Q26,20 30,10 T30,0"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="steam-line-3"
              d="M42,35 Q38,23 42,13 T42,0"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Word-wrapped responsive letter anim container to fix wrapping glitches */}
        <div
          ref={textRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-ghayaty tracking-tighter text-white uppercase overflow-hidden flex flex-wrap justify-center gap-x-4 gap-y-2 text-center max-w-full px-4"
        >
          {words.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split("").map((letter, letterIdx) => (
                <span
                  key={letterIdx}
                  className="letter inline-block transform"
                  style={{ willChange: "transform" }}
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[10px] font-mono tracking-widest text-white/60 uppercase font-semibold text-center px-4">
          DAMN TASTY HIMALAYAN BITES
        </p>
      </div>

      <div className="space-y-4 flex-shrink-0">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">
              STEAMING MOMOS
            </span>
            <span className="text-xs font-mono text-white/60 block">
              Steamed to perfection...
            </span>
          </div>
          <div
            ref={numberRef}
            className="text-5xl sm:text-7xl font-display font-bold text-white font-mono tracking-tighter leading-none"
          >
            000
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/20 relative">
          <div
            ref={lineRef}
            className="absolute inset-0 bg-white origin-left h-full"
            style={{ willChange: "transform" }}
          />
        </div>
      </div>
    </div>
  )
}
