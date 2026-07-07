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
  const imgRef = useRef<HTMLDivElement>(null)

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
      className="w-full h-auto md:h-screen md:max-h-screen bg-brand-beige py-12 md:py-0 overflow-hidden relative flex flex-col justify-center items-center select-none"
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
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start mb-3 lg:mb-6 relative z-10 -mt-6 lg:-mt-12">

          {/* Left: Heading */}
          <div ref={headingRef} className="lg:col-span-5 text-left select-none">
            <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-[7vw] leading-[0.8] text-brand-red uppercase tracking-tighter">
              JOIN<br />THE TEAM
            </h2>
          </div>

          {/* Center: Description Paragraph */}
          <div ref={descRef} className="lg:col-span-4 text-left">
            <p className="font-mono text-[12px] sm:text-base lg:text-xl text-brand-charcoal uppercase tracking-wider leading-relaxed font-semibold max-w-lg">
              IF YOU&apos;RE INTERESTED IN JOINING OUR AMAZING TEAM AND WORKING WITH US, PLEASE REACH OUT TO{" "}
              <a
                href="mailto:bobsmomo@gmail.com"
                className="text-brand-red hover:underline transition-colors duration-200"
                data-cursor="pointer"
              >
                BOBSMOMO@GMAIL.COM
              </a>{" "}
              ENCLOSING YOUR CV AND COVER LETTER. WE ARE SUPER EXCITED TO HEAR FROM YOU!
            </p>
          </div>

          {/* Right: CTA Button */}
          <div className="lg:col-span-3 flex lg:justify-end justify-start mt-2 lg:mt-0">
            <a
              ref={btnRef}
              href="mailto:bobsmomo@gmail.com"
              className="px-8 py-3.5 md:px-12 md:py-5 bg-brand-charcoal text-brand-beige hover:bg-brand-red hover:text-brand-beige font-mono text-xs md:text-sm lg:text-base uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
              data-cursor="pointer"
            >
              REACH OUT TO US
            </a>
          </div>

        </div>

        {/* Bottom Section: Team Landscape Image */}
        <div
          ref={imgContainerRef}
          className="career-image-container w-full max-h-[50vh] lg:max-h-[52vh] aspect-[16/10] lg:aspect-[16/9] overflow-hidden rounded-[1.8rem] border-[8px] lg:border-[12px] border-white shadow-2xl relative cursor-pointer group mt-2.5 lg:-mt-16 z-20"
          data-cursor="pointer"
        >
          {/* Parallax Wrapper */}
          <div
            ref={imgRef}
            className="w-[102%] h-[122%] absolute top-[-11%] left-[-1%] overflow-hidden"
          >
            {/* Parallax Image Target */}
            <img
              src="/Images/careers/team.png"
              alt="Bob's Momo Restaurant Team Crew"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] block"
              loading="lazy"
            />
          </div>
          {/* Dark vignette tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
        </div>

      </div>
    </section>
  )
}
