import React from "react"
import { motion } from "framer-motion"

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
    <div className="w-full flex justify-center sticky top-16 md:top-20 z-40 py-2 md:py-4 mb-1 md:mb-3 bg-brand-beige/80 backdrop-blur-md px-4 md:px-0">
      {/* Mobile Selector (< 768px): Horizontally scrollable chips */}
      <div 
        className="flex md:hidden w-full gap-3 overflow-x-auto scrollbar-none pb-1 px-1"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-5 py-2.5 rounded-full text-[12px] font-sans font-bold uppercase tracking-wider transition-colors duration-300 shrink-0 select-none ${
                isActive 
                  ? "text-white" 
                  : "text-brand-charcoal bg-white border border-brand-charcoal/10"
              }`}
              data-cursor="pointer"
            >
              {isActive && (
                <motion.span
                  layoutId="activeMobileTab"
                  className="absolute inset-0 bg-brand-red rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Desktop/Tablet Selector (>= 768px): Centered pill navigation */}
      <div 
        className="hidden md:flex items-center gap-2 p-1.5 bg-white border border-brand-charcoal/10 rounded-full max-w-full overflow-x-auto whitespace-nowrap scrollbar-none shadow-sm mx-auto relative z-10"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex items-center px-7 py-3 rounded-full text-xs lg:text-sm font-sans font-bold uppercase tracking-wider transition-colors duration-300 select-none ${
                isActive
                  ? "text-white"
                  : "text-brand-charcoal hover:text-brand-red"
              }`}
              data-cursor="pointer"
            >
              {isActive && (
                <motion.span
                  layoutId="activeDesktopTab"
                  className="absolute inset-0 bg-brand-red rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(CategoryTabsComponent)
