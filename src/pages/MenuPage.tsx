import React, { useState, lazy, Suspense } from "react"
import {
  MenuHero,
  CategoryTabs,
  DesktopCarousel,
  MenuCTA
} from "../components/menu-page"

// Lazy-load MobileCarousel to optimize initial bundle load size on desktop devices
const MobileCarousel = lazy(() => import("../components/menu-page/MobileCarousel"))

interface MenuItem {
  id: number
  title: string
  ingredients: string
  price: string
  image: string
  category: string
}

// NOTE: `tags` removed from every item below per request ("remove tags on cards").
// This assumes ProductGrid / MobileCarousel render tag chips conditionally off
// `item.tags` (a very common pattern) — since those files weren't shared, I
// can't confirm that's how the chips are actually rendered there. If tags are
// still showing after this change, the chip markup itself needs to be removed
// inside ProductGrid.tsx / MobileCarousel.tsx directly — happy to do that once
// you share those files.
const MENU_ITEMS: MenuItem[] = [
  // Momos
  {
    id: 1,
    title: "Classic Steamed",
    ingredients: "Hand-folded dumplings stuffed with seasoned potatoes, fresh spinach, and local Swiss cheese, steamed to perfection.",
    price: "CHF 12.00",
    image: "/Images/menu-items/Momos.png",
    category: "dumplings",
  },
  {
    id: 2,
    title: "Bob's Special",
    ingredients: "Signature momos press-smashed on a scorching griddle for a crisp outline, served with spicy sesame chutney.",
    price: "CHF 14.00",
    image: "/Images/menu-items/Bobs-Special.png",
    category: "dumplings",
  },
  {
    id: 3,
    title: "Crispy Fried",
    ingredients: "Golden-fried dumplings filled with spiced vegetables and herbs, crunchy on the outside, juicy on the inside.",
    price: "CHF 13.00",
    image: "/Images/menu-items/Rolls.png",
    category: "dumplings",
  },
  // Noodles
  {
    id: 4,
    title: "Classic Thupka",
    ingredients: "Hand-pulled wheat noodles in a rich aromatically spiced broth, garnished with fresh cilantro and scallions.",
    price: "CHF 16.50",
    image: "/Images/menu-items/Thupka.png",
    category: "noodles",
  },
  {
    id: 5,
    title: "Garlic Chilli Noodles",
    ingredients: "Wok-tossed noodles with toasted garlic, red chillies, fresh seasonal vegetables, and a splash of house soy sauce.",
    price: "CHF 15.00",
    image: "/Images/menu-items/Thupka.png",
    category: "noodles",
  },
  {
    id: 6,
    title: "Sesame Noodles",
    ingredients: "Cold wheat noodles tossed in a rich, creamy sesame-peanut paste with cucumber ribbons and toasted sesame seeds.",
    price: "CHF 14.50",
    image: "/Images/menu-items/Thupka.png",
    category: "noodles",
  },
  // Snacks
  {
    id: 7,
    title: "Crispy Veg Rolls",
    ingredients: "Crisp shredded vegetable rolls packed with glass noodles and roasted spices, with sweet plum dipping sauce.",
    price: "CHF 9.00",
    image: "/Images/menu-items/Rolls.png",
    category: "snacks",
  },
  {
    id: 8,
    title: "Fiery Potatoes",
    ingredients: "Crispy fingerling potatoes tossed in a sweet and fiery honey-chilli-sesame glaze.",
    price: "CHF 8.50",
    image: "/Images/menu-items/Rolls.png",
    category: "snacks",
  },
  {
    id: 9,
    title: "Momo Sliders",
    ingredients: "Crispy griddled momos served in warm slider buns with house spicy lassi mayo and pickled cucumbers.",
    price: "CHF 11.00",
    image: "/Images/menu-items/Bobs-Special.png",
    category: "snacks",
  },
  // Drinks
  {
    id: 10,
    title: "Mango Lassi",
    ingredients: "Refreshing yogurt drink blended with sweet mango pulp, cardamom, and infused spices, served chilled.",
    price: "CHF 6.00",
    image: "/Images/menu-items/Quenched.png",
    category: "drinks",
  },
  {
    id: 11,
    title: "Himalayan Chai",
    ingredients: "Warm, fragrant black tea brewed with whole milk, fresh ginger, cardamom, cinnamon, and cloves.",
    price: "CHF 5.00",
    image: "/Images/menu-items/Quenched.png",
    category: "drinks",
  },
  {
    id: 12,
    title: "Mint Gingerade",
    ingredients: "Zesty freshly squeezed lemon juice with crushed ginger, fresh mint leaves, and raw honey over ice.",
    price: "CHF 5.50",
    image: "/Images/menu-items/Quenched.png",
    category: "drinks",
  },
  // Desserts
  {
    id: 13,
    title: "Sweet Bao",
    ingredients: "Steamed fluffy bao buns filled with rich molten chocolate and served with a dusting of cinnamon sugar.",
    price: "CHF 8.00",
    image: "/Images/menu-items/Momos.png",
    category: "desserts",
  },
  {
    id: 14,
    title: "Coconut Pudding",
    ingredients: "Silky coconut milk pudding topped with fresh mango purée and toasted coconut flakes.",
    price: "CHF 7.50",
    image: "/Images/menu-items/Quenched.png",
    category: "desserts",
  },
  {
    id: 15,
    title: "Sweet Dumplings",
    ingredients: "Crispy fried dumplings stuffed with sweet grated coconut, sesame seeds, and jaggery.",
    price: "CHF 8.50",
    image: "/Images/menu-items/Rolls.png",
    category: "desserts",
  }
]

const CATEGORIES = [
  { id: "dumplings", label: "Momos", icon: "🥟", thumbnail: "/Images/menu-items/Momos.png" },
  { id: "noodles", label: "Noodles", icon: "🍜", thumbnail: "/Images/menu-items/Thupka.png" },
  { id: "snacks", label: "Snacks", icon: "🍗", thumbnail: "/Images/menu-items/Rolls.png" },
  { id: "drinks", label: "Drinks", icon: "🥤", thumbnail: "/Images/menu-items/Quenched.png" },
  { id: "desserts", label: "Desserts", icon: "🍰", thumbnail: "/Images/menu-items/Momos.png" }
]

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("dumplings")

  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory)

  return (
    // Tightened page-shell spacing (py-24/md:py-32 → py-10/md:py-14) and capped
    // height so hero + tabs + grid + CTA sit closer together as one compact
    // "frame" instead of a tall, loosely-spaced stack. No color changes.
    <div
      className="w-full min-h-screen bg-brand-beige pt-28 pb-10 md:pt-36 md:pb-14 relative overflow-hidden select-none flex flex-col items-center"
      style={{ maxHeight: "110vh" }}
    >
      {/* Background Banner Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08] z-0"
        style={{
          backgroundImage: `url('/Images/bg-banner.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[90vw] mx-auto flex flex-col items-center relative z-10 flex-grow gap-4 md:gap-6">
        {/* Hero Section */}
        <MenuHero />

        {/* Category Navigation */}
        <CategoryTabs
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Product Showcase */}
        <div className="w-full flex-grow flex flex-col items-center">
          {/* Mobile view (< 768px): Swipeable Carousel with Suspense block loading */}
          <div className="block md:hidden w-full">
            <Suspense fallback={
              <div className="w-full h-[320px] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
              </div>
            }>
              <MobileCarousel items={filteredItems} activeCategory={activeCategory} />
            </Suspense>
          </div>

          {/* Desktop/Tablet Carousel (>= 768px) */}
          <div className="hidden md:block w-full">
            <DesktopCarousel items={filteredItems} activeCategory={activeCategory} />
          </div>
        </div>

        {/* Menu CTA Button */}
        <MenuCTA />
      </div>
    </div>
  )
}