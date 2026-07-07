import React from "react"

interface Category {
  id: string
  label: string
  icon: string
  thumbnail: string
}

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string
  onSelectCategory: (id: string) => void
}

function CategoryTabsComponent({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="w-full flex justify-center sticky top-16 md:top-20 z-40 py-2 md:py-5 mb-3 md:mb-14 bg-brand-beige/80 backdrop-blur-md px-4 md:px-0">
      {/* Mobile Selector (< 768px): Full-width rounded capsule, white bg, thin border, soft shadow */}
      <div className="flex md:hidden w-full bg-white border border-brand-charcoal/10 rounded-full p-1 shadow-[0_8px_30px_rgba(0,0,0,0.06)] items-center justify-between">
        {categories.slice(0, 3).map((cat) => {
          const isActive = cat.id === activeCategory
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-1 py-3 text-center rounded-full text-[11px] font-display font-black uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? "bg-brand-red text-white shadow-sm"
                  : "bg-white text-black"
              }`}
              data-cursor="pointer"
            >
              {cat.label === "Momos" ? "MOMOS" : cat.label.toUpperCase()}
            </button>
          )
        })}
      </div>

      {/* Desktop/Tablet Selector (>= 768px): Scrollable pill list with thumbnails */}
      <div className="hidden md:flex items-center gap-4 p-1.5 bg-white border border-brand-charcoal/10 rounded-full max-w-full overflow-x-auto whitespace-nowrap scrollbar-none shadow-sm mx-auto">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center px-5 py-2.5 rounded-full text-[11px] font-display font-black uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? "bg-brand-red text-white shadow-sm"
                  : "bg-transparent text-brand-charcoal hover:bg-brand-red/5"
              }`}
              data-cursor="pointer"
            >
              {cat.thumbnail && (
                <img
                  src={cat.thumbnail}
                  alt={cat.label}
                  className={`w-6 h-6 rounded-full object-cover mr-2 border ${
                    isActive ? "border-white/20" : "border-brand-charcoal/10"
                  }`}
                />
              )}
              <span>{cat.label === "Momos" ? "MOMOS" : cat.label.toUpperCase()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(CategoryTabsComponent)
