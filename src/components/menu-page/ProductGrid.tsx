import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProductCard from "./ProductCard"

interface MenuItem {
  id: number
  title: string
  ingredients: string
  price: string
  image: string
  tags?: string[]
}

interface ProductGridProps {
  items: MenuItem[]
  activeCategory: string
}

function ProductGridComponent({ items, activeCategory }: ProductGridProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-20 w-full max-w-7xl px-4"
      >
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export default React.memo(ProductGridComponent)
