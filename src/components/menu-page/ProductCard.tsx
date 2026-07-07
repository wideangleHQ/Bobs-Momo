import React from "react"

interface MenuItem {
  id: number
  title: string
  ingredients: string
  price: string
  image: string
  tags?: string[]
}

interface ProductCardProps {
  item: MenuItem
}

function ProductCardComponent({ item }: ProductCardProps) {
  return (
    <div className="group flex flex-col items-center text-center bg-transparent rounded-[2.5rem] p-6 hover:bg-white/50 transition-all duration-500 ease-out cursor-pointer select-none relative">
      {/* Decorative pop background bubble behind image */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] rounded-full bg-brand-yellow/5 scale-90 group-hover:scale-105 group-hover:bg-brand-yellow/12 transition-all duration-500 ease-out z-0 pointer-events-none" />

      {/* Product Image Frame (60-70% of available top card area) */}
      <div className="w-[200px] h-[200px] lg:w-[260px] lg:h-[260px] flex items-center justify-center select-none bg-transparent overflow-hidden relative z-10">
        <img
          src={item.image}
          alt={item.title}
          className="w-[75%] h-[75%] object-contain transform transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-1 filter drop-shadow-[0_20px_40px_rgba(26,26,26,0.06)] group-hover:drop-shadow-[0_28px_56px_rgba(26,26,26,0.12)]"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>

      {/* Product Name (Uppercase bold display text) */}
      <h3 className="font-display font-black text-2xl lg:text-3xl text-brand-charcoal uppercase tracking-tight mt-6 leading-none relative z-10">
        {item.title}
      </h3>

      {/* Ingredients Description (Breathing room) */}
      <p className="font-sans text-xs lg:text-sm text-brand-charcoal/70 leading-relaxed max-w-[280px] mx-auto mt-3 font-semibold relative z-10">
        {item.ingredients}
      </p>

      {/* Dietary Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center justify-center mt-4 relative z-10">
          {item.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center text-[10px] lg:text-[11px] font-semibold text-brand-charcoal/60 bg-brand-charcoal/5 px-2.5 py-1 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red mr-1.5 flex-shrink-0" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Price */}
      <p className="font-mono font-black text-brand-red text-base lg:text-lg tracking-wider mt-4 relative z-10">
        {item.price}
      </p>
    </div>
  )
}

export default React.memo(ProductCardComponent)
