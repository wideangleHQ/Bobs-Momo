import { useMemo, useCallback, useState, useEffect } from "react"
import {
  getOutlets,
  getCategories,
  getProductsByOutlet,
  getProductsByCategory,
} from "../services/menu.service"
import type { MenuItem, MenuCategory } from "../types"

export type OutletType = string

interface CategoryTabItem {
  id: string
  label: string
  icon: string
  thumbnail: string
}

interface UseMenuReturn {
  outlets: { id: string; label: string }[]
  activeOutlet: string
  setActiveOutlet: (outlet: string) => void
  activeCategory: string
  setActiveCategory: (category: string) => void
  categories: CategoryTabItem[]
  filteredItems: MenuItem[]
}

const ALL_CATEGORY: CategoryTabItem = {
  id: "all",
  label: "ALL",
  icon: "✨",
  thumbnail: "",
}

export function useMenu(defaultOutlet?: string): UseMenuReturn {
  const allOutlets = useMemo(
    () => getOutlets().map((o) => ({ id: o.id, label: o.name })),
    []
  )

  const [activeOutlet, setActiveOutlet] = useState(
    defaultOutlet ?? allOutlets[0]?.id ?? ""
  )
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    setActiveCategory("all")
  }, [activeOutlet])

  const outletItems = useMemo(
    () => getProductsByOutlet(activeOutlet),
    [activeOutlet]
  )

  const outletCategories = useMemo(
    () => getCategories(activeOutlet),
    [activeOutlet]
  )

  const categories = useMemo<CategoryTabItem[]>(() => {
    const presentCategoryIds = new Set(outletItems.map((item) => item.category))
    const filtered = outletCategories
      .filter((cat: MenuCategory) => presentCategoryIds.has(cat.id))
      .map((cat: MenuCategory) => ({
        id: cat.id,
        label: cat.label,
        icon: cat.icon,
        thumbnail: cat.thumbnail,
      }))
    return [ALL_CATEGORY, ...filtered]
  }, [outletItems, outletCategories])

  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? outletItems
        : outletItems.filter((item) => item.category === activeCategory),
    [outletItems, activeCategory]
  )

  const handleSetActiveOutlet = useCallback((outlet: string) => {
    setActiveOutlet(outlet)
  }, [])

  const handleSetActiveCategory = useCallback((category: string) => {
    setActiveCategory(category)
  }, [])

  return {
    outlets: allOutlets,
    activeOutlet,
    setActiveOutlet: handleSetActiveOutlet,
    activeCategory,
    setActiveCategory: handleSetActiveCategory,
    categories,
    filteredItems,
  }
}
