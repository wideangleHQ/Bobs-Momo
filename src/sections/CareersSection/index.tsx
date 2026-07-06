import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function CareersSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)
  const imgContainerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animations
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      })

      entranceTl
        .fromTo(
          headingRef.current,
          { y: 50, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
        )
        .fromTo(
          descRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.45"
        )
        .fromTo(
          btnRef.current,
          { y: 25, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" },
          "-=0.4"
        )
        .fromTo(
          imgContainerRef.current,
          { y: 60, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
          "-=0.35"
        )

      // 2. Parallax Scrolling Animation (Desktop & Large screens only)
      gsap.matchMedia().add("(min-width: 768px)", () => {
        if (!imgRef.current) return
        gsap.fromTo(
          imgRef.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: imgContainerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="careers"
      ref={sectionRef}
      className="w-full h-auto md:h-screen md:max-h-screen bg-[#F8F2E7] py-12 md:py-0 overflow-hidden relative flex flex-col justify-center items-center select-none"
    >
      {/* Subtle Background Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.10] z-0"
        style={{
          backgroundImage: `url('/Images/bg-banner.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />
      <div className="w-full max-w-[90vw] mx-auto flex flex-col items-center">
        
        {/* Top Header Row (3-column layout) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-4 md:mb-6 relative z-10 -mt-6 md:-mt-12">
          
          {/* Left: Heading */}
          <div ref={headingRef} className="md:col-span-5 text-left select-none">
            <h2 className="font-display font-black text-7xl md:text-8xl lg:text-[7vw] leading-[0.8] text-brand-red uppercase tracking-tighter">
              JOIN<br />THE TEAM
            </h2>
          </div>

          {/* Center: Description Paragraph */}
          <div ref={descRef} className="md:col-span-4 text-left">
            <p className="font-mono text-base md:text-lg lg:text-xl text-brand-charcoal uppercase tracking-wider leading-relaxed font-semibold max-w-lg">
              IF YOU&apos;RE INTERESTED IN JOINING OUR AMAZING TEAM AND WORKING WITH US, PLEASE REACH OUT TO{" "}
              <a
                href="mailto:hello@prettypatty.ch"
                className="text-brand-red hover:underline transition-colors duration-200"
                data-cursor="pointer"
              >
                HELLO@PRETTYPATTY.CH
              </a>{" "}
              ENCLOSING YOUR CV AND COVER LETTER. WE ARE SUPER EXCITED TO HEAR FROM YOU!
            </p>
          </div>

          {/* Right: CTA Button */}
          <div className="md:col-span-3 flex md:justify-end">
            <a
              ref={btnRef}
              href="mailto:hello@prettypatty.ch"
              className="px-12 py-5 bg-brand-charcoal text-brand-beige hover:bg-brand-red hover:text-brand-beige font-mono text-sm md:text-base uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
              data-cursor="pointer"
            >
              REACH OUT TO US
            </a>
          </div>

        </div>

        {/* Bottom Section: Team Landscape Image */}
        <div
          ref={imgContainerRef}
          className="career-image-container w-full max-h-[50vh] md:max-h-[52vh] aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-[1.8rem] border-[8px] md:border-[12px] border-white shadow-2xl relative cursor-pointer group -mt-8 md:-mt-16 z-20"
          data-cursor="pointer"
        >
          {/* Parallax Image Target */}
          <img
            ref={imgRef}
            src="./public/images/careers/team.png"
            alt="Pretty Patty Restaurant Team Crew"
            className="career-parallax-img w-full h-[115%] object-cover absolute top-0 left-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
          {/* Dark vignette tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
        </div>

      </div>
    </section>
  )
}
