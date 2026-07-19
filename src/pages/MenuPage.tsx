import React, { lazy, Suspense } from "react"
import {
  MenuHero,
  CategoryTabs,
  MenuCTA,
  OutletSelector
} from "../components/menu-page"
import { useMenu } from "../hooks/useMenu"

export type { MenuItem } from "../types"

const CircularGallery = lazy(() => import("../components/menu-page/CircularGallery"))

export default function MenuPage() {
  const {
    activeOutlet,
    setActiveOutlet,
    activeCategory,
    setActiveCategory,
    categories,
    filteredItems,
  } = useMenu("PATHARGADIA")

  return (
    <div
      className="w-full min-h-screen bg-brand-beige pt-28 pb-4 md:pt-32 md:pb-8 relative overflow-x-hidden select-none flex flex-col items-center"
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

      <div className="w-full max-w-[90vw] mx-auto flex flex-col items-center relative z-10 flex-grow gap-1 md:gap-2">
        {/* Hero Section */}
        <MenuHero />

        {/* Outlet Switcher Segmented Control */}
        <OutletSelector
          activeOutlet={activeOutlet as "PATHARGADIA" | "KALINGA_NAGAR"}
          onSelectOutlet={setActiveOutlet}
        />

        {/* Category Navigation (rendered dynamically) */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Product Showcase Circular Gallery */}
        <div className="w-full h-[62vh] md:h-[570px] flex items-center justify-center overflow-visible relative z-10">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
            </div>
          }>
            <CircularGallery
              items={filteredItems}
              bend={2}
              textColor="#1A1A1A"
              borderRadius={0.05}
              scrollEase={0.07}
              scrollSpeed={2}
            />
          </Suspense>
        </div>

        {/* Menu CTA Button */}
        <MenuCTA />
      </div>
    </div>
  )
}
