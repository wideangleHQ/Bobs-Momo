import React, { useState, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MenuItem {
  id: number
  title: string
  ingredients: string
  price: string
  image: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    title: "MOMO",
    ingredients: "Hand-folded dumplings stuffed with seasoned potatoes, fresh spinach, and local Swiss cheese, steamed to perfection.",
    price: "PORTION OF 6: CHF 12 / PORTION OF 12: CHF 22",
    image: "./public/images/menu-items/Momos.png",
  },
  {
    id: 2,
    title: "BOB'S SPECIAL",
    ingredients: "Signature momos press-smashed on a scorching griddle for a crisp outline, served with spicy sesame chutney.",
    price: "PORTION OF 6: CHF 14 / PORTION OF 12: CHF 25",
    image: "./public/images/menu-items/Bobs-Special.png",
  },
  {
    id: 3,
    title: "THUPKA",
    ingredients: "Hand-pulled wheat noodles in a rich aromatically spiced broth, garnished with fresh cilantro and scallions.",
    price: "REGULAR: CHF 16.50 / LARGE: CHF 19.50",
    image: "./public/images/menu-items/Thupka.png",
  },
  {
    id: 4,
    title: "ROLLS",
    ingredients: "Crisp shredded vegetable rolls packed with glassed noodles and roasted spices, with sweet plum dipping sauce.",
    price: "PORTION OF 3: CHF 9 / PORTION OF 6: CHF 16",
    image: "./public/images/menu-items/Rolls.png",
  },
  {
    id: 5,
    title: "QUENCHED",
    ingredients: "Refreshing yogurt drink blended with sweet mango pulp, cardamom, and infused spices, served chilled.",
    price: "GLASS: CHF 6.00 / BOTTLE: CHF 9.50",
    image: "./public/images/menu-items/Quenched.png",
  },
]

const LEN = MENU_ITEMS.length

function mod(i: number, n: number) {
  return ((i % n) + n) % n
}

export default function MenuSection() {
  const [center, setCenter] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (animating) return
      setAnimating(true)
      setCenter((p) => mod(p + dir, LEN))
      setTimeout(() => setAnimating(false), 700)
    },
    [animating]
  )

  const slideNext = () => navigate(1)
  const slidePrev = () => navigate(-1)

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const onTouchMove  = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const onTouchEnd   = () => {
    if (!touchStart || !touchEnd) return
    if (touchStart - touchEnd > 50) slideNext()
    else if (touchEnd - touchStart > 50) slidePrev()
    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <section
      id="menu"
      className="w-full bg-[#FAF7F2] text-brand-charcoal overflow-hidden relative flex flex-col"
      style={{ minHeight: "100vh" }}
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
      <div className="flex flex-col flex-1 items-center justify-center py-6 px-4 md:px-8 gap-5">

        {/* ── Section Heading ───────────────────────────────── */}
        <div className="text-center space-y-2 flex-shrink-0">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-red uppercase block">
            DAMN TASTY HIMALAYAN BITES
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter text-brand-charcoal uppercase leading-none">
            CHECK OUT OUR MOMOS
          </h2>
        </div>

        {/* ── Slider Viewport ───────────────────────────────── */}
        <div
          className="relative w-full flex items-center justify-center flex-shrink-0"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/*
            All three visible items share the SAME baseline (items-end, no vertical offset).
            Only the image + text block scale down for side items — nothing fades or shifts vertically.
            We animate ONLY transform + opacity → GPU-compositing → 60 FPS.
          */}
          <div
            className="relative w-full"
            style={{ height: "clamp(360px, 50vh, 560px)" }}
          >
            {MENU_ITEMS.map((item, index) => {
              let offset = index - center
              // Wrap offsets for infinite loop
              if (offset > LEN / 2) offset -= LEN
              if (offset < -LEN / 2) offset += LEN

              const isCenter = offset === 0
              const isLeft   = offset === -1
              const isRight  = offset === 1
              const isVisible = Math.abs(offset) <= 1

              // ── Transform values ────────────────────────────
              // Pulled in tighter so the full row (side + center + side) fits within the viewport
              const translateXPct = offset * 24

              // Only a mild depth-scale now — the real size difference comes from the
              // image box dimensions below, not from shrinking one shared box via transform.
              const scale = isCenter ? 1.0 : 0.92

              // Fully opaque for all visible items — nothing fades on the reference
              const opacity = isVisible ? 1 : 0

              return (
                <div
                  key={item.id}
                  className="absolute inset-0 flex flex-col items-center justify-end will-change-transform"
                  style={{
                    // GPU-only properties → 60 FPS. No vertical translate — everyone shares one baseline.
                    transform: `translateX(${translateXPct}%) scale(${scale})`,
                    opacity,
                    transition: "transform 680ms cubic-bezier(0.25, 1, 0.5, 1), opacity 680ms cubic-bezier(0.25, 1, 0.5, 1)",
                    zIndex: isCenter ? 30 : isVisible ? 15 : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                    cursor: !isCenter ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (isLeft)  slidePrev()
                    if (isRight) slideNext()
                  }}
                >
                  {/* Food Image — center is sized to ~60vw; side items are their
                      own smaller, independently-sized boxes. */}
                  <div
                    className="flex items-end justify-center"
                    style={{
                      width: isCenter ? "clamp(420px, 60vw, 780px)" : "clamp(240px, 28vw, 400px)",
                      height: isCenter ? "clamp(280px, 44vh, 480px)" : "clamp(170px, 24vh, 300px)",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full object-contain pointer-events-none will-change-transform ${
                        isCenter
                          ? "drop-shadow-[0_32px_56px_rgba(26,26,26,0.28)]"
                          : "drop-shadow-[0_16px_28px_rgba(26,26,26,0.18)]"
                      }`}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* Food Info — every item shows title, ingredients, AND price, just scaled down */}
                  <div
                    className="text-center mt-2 space-y-1 px-2"
                    style={{ width: isCenter ? "clamp(340px, 42vw, 600px)" : "clamp(230px, 28vw, 380px)" }}
                  >
                    <h3
                      className={`font-display font-black uppercase tracking-tight leading-tight ${
                        isCenter ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`font-sans leading-relaxed text-brand-charcoal/70 font-medium ${
                        isCenter ? "text-sm md:text-base" : "text-xs md:text-sm"
                      }`}
                    >
                      {item.ingredients}
                    </p>
                    <p
                      className={`font-mono font-black text-brand-red tracking-wide ${
                        isCenter ? "text-sm md:text-base" : "text-xs md:text-sm"
                      }`}
                    >
                      {item.price}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Desktop Arrows — sit at the vertical middle of the image row, no offset hack ── */}
          <button
            onClick={slidePrev}
            disabled={animating}
            className="hidden md:flex absolute left-4 xl:left-16 top-[40%] -translate-y-1/2 z-40 w-12 h-12 rounded-full border border-brand-charcoal/15 bg-white items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50"
            aria-label="Previous item"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={slideNext}
            disabled={animating}
            className="hidden md:flex absolute right-4 xl:right-16 top-[40%] -translate-y-1/2 z-40 w-12 h-12 rounded-full border border-brand-charcoal/15 bg-white items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50"
            aria-label="Next item"
          >
            <ChevronRight size={20} />
          </button>

          {/* ── Mobile Arrows ──────────────────────────────── */}
          <div className="md:hidden flex gap-6 absolute bottom-0 left-1/2 -translate-x-1/2">
            <button
              onClick={slidePrev}
              className="w-11 h-11 rounded-full border border-brand-charcoal/15 bg-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Previous item"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={slideNext}
              className="w-11 h-11 rounded-full border border-brand-charcoal/15 bg-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Next item"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Dot Indicators ────────────────────────────────── */}
        <div className="flex gap-2 items-center justify-center flex-shrink-0">
          {MENU_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => !animating && setCenter(i)}
              className={`rounded-full transition-all duration-500 ${
                i === center
                  ? "w-6 h-2 bg-brand-red"
                  : "w-2 h-2 bg-brand-charcoal/20 hover:bg-brand-charcoal/40"
              }`}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>

        {/* ── CTA Button ────────────────────────────────────── */}
        <div className="flex justify-center flex-shrink-0">
          <button
            className="px-10 py-5 bg-brand-red text-white hover:bg-brand-yellow hover:text-brand-charcoal font-mono text-xs uppercase tracking-widest font-black rounded-full transition-all duration-300 shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
            data-cursor="pointer"
          >
            Explore Full Menu
          </button>
        </div>

      </div>
    </section>
  )
}