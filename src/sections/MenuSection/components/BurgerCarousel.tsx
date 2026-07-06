import React, { useState, useRef, useEffect } from "react"
import gsap from "gsap"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BurgerItem {
  id: string
  title: string
  subtitle: string
  desc: string
  calories: string
  price: string
  image: string
  bgAccent: string
}

const BURGERS: BurgerItem[] = [
  {
    id: "classic",
    title: "Classic Smash",
    subtitle: "DOUBLE CHEESE // SECRET SAUCE",
    desc: "Two smashed beef patties, double cheddar cheese, dill pickles, minced onions, and our signature burger sauce in a toasted brioche bun.",
    calories: "740 KCAL",
    price: "CHF 16.50",
    image: "/Images/burger_classic.png",
    bgAccent: "#F2EBE1",
  },
  {
    id: "fancy",
    title: "Fancy Patty",
    subtitle: "SMOKED BACON // TRUFFLE MAYO",
    desc: "Two smashed beef patties, double cheddar cheese, crispy smoked bacon, caramelized balsamico onions, and luxury truffle mayo.",
    calories: "890 KCAL",
    price: "CHF 19.50",
    image: "/Images/burger_fancy.png",
    bgAccent: "#EBDAC9",
  },
  {
    id: "oklahoma",
    title: "Oklahoma Onion",
    subtitle: "SWEET ONION // YELLOW MUSTARD",
    desc: "Two beef patties smashed paper-thin directly with shaved sweet onions, melted cheddar cheese, yellow mustard, and crunch pickles.",
    calories: "690 KCAL",
    price: "CHF 17.00",
    image: "/Images/burger_oklahoma.png",
    bgAccent: "#E6DEC6",
  },
  {
    id: "green",
    title: "Green Smash",
    subtitle: "PLANT-BASED // HERB MAQUIS",
    desc: "Our house-crafted veggie smash patty, melted cheddar cheese, fresh Batavia lettuce, tomatoes, and organic green herb mayo.",
    calories: "580 KCAL",
    price: "CHF 16.00",
    image: "/Images/burger_green.png",
    bgAccent: "#DCE1D3",
  },
]

export default function BurgerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  const slideNext = () => {
    setActiveIndex((prev) => (prev + 1) % BURGERS.length)
  }

  const slidePrev = () => {
    setActiveIndex((prev) => (prev - 1 + BURGERS.length) % BURGERS.length)
  }

  useEffect(() => {
    if (!trackRef.current) return

    // GSAP animation for sliding transition
    gsap.to(trackRef.current, {
      xPercent: -activeIndex * 100,
      duration: 0.85,
      ease: "power4.out",
    })

    // Animate active image scaling
    imageRefs.current.forEach((ref, idx) => {
      if (!ref) return
      if (idx === activeIndex) {
        gsap.to(ref.querySelector("img"), {
          scale: 1.05,
          rotation: 2,
          duration: 1.0,
          ease: "power2.out",
        })
      } else {
        gsap.to(ref.querySelector("img"), {
          scale: 0.9,
          rotation: -5,
          duration: 1.0,
          ease: "power2.out",
        })
      }
    })
  }, [activeIndex])

  return (
    <div className="relative w-full overflow-hidden select-none py-12">
      {/* Slider Track Container */}
      <div ref={trackRef} className="flex w-full" style={{ willChange: "transform" }}>
        {BURGERS.map((burger, index) => (
          <div
            key={burger.id}
            className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center px-6 md:px-12"
          >
            {/* Left Side: Text Details */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1 text-left">
              <div className="space-y-2">
                <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-brand-red uppercase block">
                  {burger.subtitle}
                </span>
                <h3 className="text-4xl md:text-6xl font-display font-extrabold tracking-tighter text-brand-charcoal uppercase leading-none">
                  {burger.title}
                </h3>
              </div>

              <p className="text-sm md:text-base text-brand-charcoal/80 max-w-lg leading-relaxed">
                {burger.desc}
              </p>

              <div className="flex items-center space-x-8 border-t border-brand-charcoal/10 pt-6">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-brand-charcoal/40 uppercase block">
                    Energy Value
                  </span>
                  <span className="text-sm font-semibold text-brand-charcoal">
                    {burger.calories}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-brand-charcoal/40 uppercase block">
                    Single Price
                  </span>
                  <span className="text-lg font-bold text-brand-red">
                    {burger.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Burger Image Display Area */}
            <div className="order-1 lg:order-2 flex justify-center items-center w-full relative">
              <div
                ref={(el) => { imageRefs.current[index] = el }}
                className="relative w-72 h-72 md:w-[420px] md:h-[420px] flex items-center justify-center rounded-full transition-colors duration-500"
                style={{ backgroundColor: burger.bgAccent }}
              >
                {/* Floating ambient circle behind */}
                <div className="absolute inset-4 rounded-full border border-dashed border-brand-charcoal/10 animate-[spin_40s_linear_infinite]" />
                
                {/* Burger Image */}
                <img
                  src={burger.image}
                  alt={burger.title}
                  className="w-[100%] h-[100%] object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(26,26,26,0.25)] select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-12 mt-12">
        <div className="flex items-center space-x-2 text-xs font-mono text-brand-charcoal/40">
          <span className="text-brand-charcoal font-bold">
            {(activeIndex + 1).toString().padStart(2, "0")}
          </span>
          <span>/</span>
          <span>{BURGERS.length.toString().padStart(2, "0")}</span>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={slidePrev}
            className="p-3 border border-brand-charcoal/10 rounded-full hover:bg-brand-red hover:text-brand-beige hover:border-brand-red transition-all duration-300"
            data-cursor="pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={slideNext}
            className="p-3 border border-brand-charcoal/10 rounded-full hover:bg-brand-red hover:text-brand-beige hover:border-brand-red transition-all duration-300"
            data-cursor="pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
