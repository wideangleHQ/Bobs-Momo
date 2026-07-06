import React, { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const ROW1 = ["BEST MOMOS", "TASTY MOMO", "DELICIOUS", "PURE MOMO CRAVINGS"]
const ROW2 = ["PURE MOMO CRAVINGS", "TASTY MOMO", "BEST MOMOS", "DELICIOUS"]
const ROW3 = ["DELICIOUS", "BEST MOMOS", "TASTY MOMO", "PURE MOMO CRAVINGS"]

// Helper Marquee Row Component
function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const textContent = items.map((item, idx) => {
    const isOutline = idx % 2 !== 0
    return (
      <span
        key={idx}
        className={`font-display font-black text-5xl md:text-[6.5rem] lg:text-[8rem] tracking-tighter uppercase mr-12 select-none ${
          isOutline
            ? "text-transparent [-webkit-text-stroke:2px_#E9171F] md:[-webkit-text-stroke:3px_#E9171F]"
            : "text-brand-red"
        }`}
      >
        {item}
      </span>
    )
  })

  return (
    <div className="w-full overflow-hidden select-none pointer-events-none py-2">
      <div className={`flex w-max ${reverse ? "animate-marqueeReverse" : "animate-marquee"}`}>
        <div className="flex items-center">
          {textContent}
          {textContent}
          {textContent}
          {textContent}
        </div>
      </div>
    </div>
  )
}

export default function FeedbackSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    day: "",
    month: "",
    year: "",
    rating: 0,
    message: ""
  })

  // UI States
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Form Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!formData.day || Number(formData.day) < 1 || Number(formData.day) > 31) {
      newErrors.date = "Valid day is required (1-31)"
    }
    if (!formData.month) {
      newErrors.date = "Month is required"
    }
    if (!formData.year || Number(formData.year) < 2020 || Number(formData.year) > 2030) {
      newErrors.date = "Valid year is required (2020-2030)"
    }
    if (formData.rating === 0) {
      newErrors.rating = "Momo rating is required"
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Simulate API submit
      setTimeout(() => {
        setIsSubmitted(true)
        setFormData({
          name: "",
          email: "",
          day: "",
          month: "",
          year: "",
          rating: 0,
          message: ""
        })
        setErrors({})
      }, 600)
    }
  }

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        }
      })

      // Scale & fade in the card
      tl.fromTo(
        ".feedback-card",
        { y: 60, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      )
      // Stagger elements inside the card
      .fromTo(
        ".feedback-stagger-item",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.4"
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="feedback"
      ref={sectionRef}
      className="w-full min-h-[110vh] md:min-h-screen bg-white flex items-center justify-center py-20 px-6 md:px-12 relative overflow-hidden"
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
      {/* Sliding Background Marquees (Rotated to match reference) */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center gap-6 md:gap-10 pointer-events-none transform -rotate-[7deg] scale-110">
        <MarqueeRow items={ROW1} />
        <MarqueeRow items={ROW2} reverse />
        <MarqueeRow items={ROW3} />
      </div>

      {/* Centered Feedback Card */}
      <div className="feedback-card w-full max-w-4xl bg-brand-red border-[12px] border-brand-yellow rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative z-10 transition-all duration-300">
        
        {isSubmitted ? (
          <div className="text-center py-12 px-6 space-y-6 text-white feedback-stagger-item">
            <h3 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight">
              THANK YOU!
            </h3>
            <p className="font-mono text-sm md:text-base tracking-wider uppercase text-white/90 max-w-md mx-auto leading-relaxed">
              Your experience review has been smashed directly to our kitchen. We appreciate you!
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-10 py-4 bg-white text-brand-charcoal hover:bg-brand-yellow hover:text-brand-charcoal font-display font-black text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95 mt-4"
              data-cursor="pointer"
            >
              SEND ANOTHER REVIEW
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-card-content space-y-4 md:space-y-5">
            
            {/* Heading */}
            <div className="feedback-stagger-item text-left">
              <h2 className="font-display font-black text-2xl md:text-4xl lg:text-5xl text-white uppercase tracking-tight leading-none">
                RATE YOUR EXPERIENCE
              </h2>
            </div>

            {/* Row 1: Name & Email */}
            <div className="feedback-stagger-item grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name field */}
              <div className="space-y-2 text-left">
                <label htmlFor="name-field" className="font-display font-black text-xs md:text-sm tracking-widest text-white uppercase block">
                  NAME *
                </label>
                <input
                  id="name-field"
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full bg-black/10 border ${
                    errors.name ? "border-brand-yellow" : "border-white/20"
                  } px-5 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-yellow focus:bg-black/20 focus:ring-1 focus:ring-brand-yellow transition-all duration-300 placeholder-white/40`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-cursor="text"
                />
                {errors.name && (
                  <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-wider block">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2 text-left">
                <label htmlFor="email-field" className="font-display font-black text-xs md:text-sm tracking-widest text-white uppercase block">
                  EMAIL *
                </label>
                <input
                  id="email-field"
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full bg-black/10 border ${
                    errors.email ? "border-brand-yellow" : "border-white/20"
                  } px-5 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-yellow focus:bg-black/20 focus:ring-1 focus:ring-brand-yellow transition-all duration-300 placeholder-white/40`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-cursor="text"
                />
                {errors.email && (
                  <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-wider block">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Date of Visit & Star Rating */}
            <div className="feedback-stagger-item grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              {/* Date of Visit */}
              <div className="space-y-2 text-left">
                <label className="font-display font-black text-xs md:text-sm tracking-widest text-white uppercase block">
                  DATE OF VISIT *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="day-field" className="font-display font-black text-[9px] md:text-[10px] tracking-widest text-white/70 uppercase block">
                      DAY
                    </label>
                    <input
                      id="day-field"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="DD"
                      className="w-full bg-black/10 border border-white/20 px-3 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-yellow focus:bg-black/20 focus:ring-1 focus:ring-brand-yellow transition-all duration-300 placeholder-white/30 text-center font-sans"
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      data-cursor="text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="month-field" className="font-display font-black text-[9px] md:text-[10px] tracking-widest text-white/70 uppercase block">
                      MONTH
                    </label>
                    <div className="relative">
                      <select
                        id="month-field"
                        className="w-full bg-black/10 border border-white/20 pl-3 pr-8 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-yellow focus:bg-black/20 focus:ring-1 focus:ring-brand-yellow transition-all duration-300 appearance-none text-center cursor-pointer font-sans"
                        value={formData.month}
                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      >
                        <option value="" disabled className="text-brand-charcoal">Month</option>
                        {MONTHS.map((m) => (
                          <option key={m} value={m} className="text-brand-charcoal">
                            {m.slice(0, 3)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                        <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="year-field" className="font-display font-black text-[9px] md:text-[10px] tracking-widest text-white/70 uppercase block">
                      YEAR
                    </label>
                    <input
                      id="year-field"
                      type="number"
                      min="2020"
                      max="2030"
                      placeholder="YYYY"
                      className="w-full bg-black/10 border border-white/20 px-3 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-yellow focus:bg-black/20 focus:ring-1 focus:ring-brand-yellow transition-all duration-300 placeholder-white/30 text-center font-sans"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      data-cursor="text"
                    />
                  </div>
                </div>
                {errors.date && (
                  <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-wider block">
                    {errors.date}
                  </span>
                )}
              </div>

              {/* Momo Rating */}
              <div className="space-y-2 text-left md:pl-6 pb-1">
                <label className="font-display font-black text-xs md:text-sm tracking-widest text-white uppercase block">
                  MOMO RATING *
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className="p-1 transition-transform duration-200 hover:scale-125 focus:outline-none"
                      onClick={() => setFormData({ ...formData, rating: num })}
                      data-cursor="pointer"
                      aria-label={`Rate ${num} Momos`}
                    >
                      <img
                        src="/Images/momo (1).png"
                        alt={`Momo Rate ${num}`}
                        className="w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-250 select-none pointer-events-none"
                        style={{
                          filter: "brightness(0) invert(1) drop-shadow(0 0 1px #ffffff)",
                          opacity: num <= formData.rating ? 1 : 0.55,
                        }}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-wider block">
                    {errors.rating}
                  </span>
                )}
              </div>
            </div>

            {/* Row 3: Message Textarea */}
            <div className="feedback-stagger-item space-y-2 text-left">
              <label htmlFor="message-field" className="font-display font-black text-xs md:text-sm tracking-widest text-white uppercase block">
                MESSAGE *
              </label>
              <textarea
                id="message-field"
                rows={3}
                placeholder="Enter Your Message"
                className={`w-full bg-black/10 border ${
                  errors.message ? "border-brand-yellow" : "border-white/20"
                } px-5 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-yellow focus:bg-black/20 focus:ring-1 focus:ring-brand-yellow transition-all duration-300 resize-none placeholder-white/40`}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                data-cursor="text"
              />
              {errors.message && (
                <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-wider block">
                  {errors.message}
                </span>
              )}
            </div>

            {/* Row 4: Submit Button (Centered/Right-aligned pill) */}
            <div className="feedback-stagger-item flex justify-end pt-0">
              <button
                type="submit"
                className="px-14 py-3 bg-white text-brand-charcoal hover:bg-brand-yellow hover:text-brand-charcoal font-display font-black text-xs md:text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 active:scale-95"
                data-cursor="pointer"
              >
                SUBMIT
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  )
}
