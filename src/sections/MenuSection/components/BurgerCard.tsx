import React from "react"
import { Plus } from "lucide-react"

interface BurgerCardProps {
  title: string
  desc: string
  price: string
  image: string
  category: string
  badge?: string
}

export function BurgerCard({ title, desc, price, image, category, badge }: BurgerCardProps) {
  return (
    <div
      className="group relative bg-brand-cream border border-brand-charcoal/5 p-6 flex flex-col justify-between transition-all duration-300 hover:border-brand-red hover:shadow-lg rounded-none text-left"
      style={{ minHeight: "360px" }}
      data-cursor="pointer"
    >
      {/* Top Header Card */}
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-mono tracking-widest text-brand-charcoal/40 uppercase block">
          {category}
        </span>
        {badge && (
          <span className="bg-brand-red text-brand-beige text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 uppercase">
            {badge}
          </span>
        )}
      </div>

      {/* Center Image Display Area */}
      <div className="my-6 flex justify-center items-center h-32 relative">
        <div className="absolute w-24 h-24 rounded-full bg-brand-charcoal/5 group-hover:scale-110 transition-transform duration-500 ease-out" />
        <img
          src={image}
          alt={title}
          className="h-28 object-contain relative z-10 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-3 drop-shadow-[0_10px_20px_rgba(26,26,26,0.1)]"
          loading="lazy"
        />
      </div>

      {/* Bottom Info Details */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-2xl font-display font-extrabold text-brand-charcoal uppercase group-hover:text-brand-red transition-colors duration-200">
            {title}
          </h4>
          <p className="text-sm text-brand-charcoal/60 leading-relaxed line-clamp-2">
            {desc}
          </p>
        </div>

        <div className="flex justify-between items-center border-t border-brand-charcoal/5 pt-4">
          <span className="text-lg font-bold text-brand-charcoal">
            {price}
          </span>
          <button className="p-3 bg-brand-charcoal text-brand-beige group-hover:bg-brand-red group-hover:text-brand-beige transition-all duration-300 rounded-none shadow-sm hover:scale-105 active:scale-95">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
