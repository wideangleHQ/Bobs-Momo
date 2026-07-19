import type { MenuData, MenuOutlet, MenuProduct, MenuCategory, MenuItem, ProductVariant } from "../types"
import menuJson from "../data/menu.json"

const data: MenuData = menuJson as MenuData

const PRICE_KEY_LABELS: Record<string, string> = {
  veg: "Veg",
  spinachCheese: "Spinach Cheese",
  chicken: "Chicken",
  mutton: "Mutton",
  dry: "Dry",
  wet: "Wet",
}

function pricesToVariants(prices: Record<string, number>): ProductVariant[] {
  if (!prices) return []
  return Object.entries(prices)
    .filter(([key]) => key !== "default")
    .map(([key, price]) => ({
      id: key,
      label: PRICE_KEY_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1),
      price,
    }))
}

function getLowestPrice(prices: Record<string, number>): number {
  if (!prices) return 0
  const values = Object.values(prices)
  return values.length > 0 ? Math.min(...values) : 0
}

function formatPrice(amount: number): string {
  return `₹${amount}`
}

function toMenuItem(product: MenuProduct): MenuItem {
  const variants = pricesToVariants(product.prices)
  const hasOnlyDefault = Object.keys(product.prices || {}).length === 1 && "default" in (product.prices || {})

  return {
    id: product.id,
    title: product.name,
    ingredients: product.description || "",
    price: formatPrice(getLowestPrice(product.prices)),
    variants: hasOnlyDefault ? [{ id: "default", label: "", price: product.prices.default }] : variants,
    image: product.image,
    category: product.category,
    isVeg: product.isVeg ?? true,
    isChefSpecial: product.isChefSpecial,
    tags: product.tags || [],
  }
}

export function getMenu(): MenuData {
  return data
}

export function getOutlets(): MenuOutlet[] {
  return data.outlets
}

export function getOutletIds(): string[] {
  return data.outlets.map((o) => o.id)
}

export function getOutletById(outletId: string): MenuOutlet | undefined {
  return data.outlets.find((o) => o.id === outletId)
}

export function getProducts(outletId: string): MenuProduct[] {
  const outlet = getOutletById(outletId)
  return outlet ? outlet.products : []
}

export function getCategories(outletId: string): MenuCategory[] {
  const outlet = getOutletById(outletId)
  return outlet ? outlet.categories.sort((a, b) => a.sortOrder - b.sortOrder) : []
}

export function getProductsByOutlet(outletId: string): MenuItem[] {
  return getProducts(outletId)
    .filter((p) => p.availability)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(toMenuItem)
}

export function getProductsByCategory(outletId: string, categoryId: string): MenuItem[] {
  const items = getProductsByOutlet(outletId)
  if (categoryId === "all") return items
  return items.filter((item) => item.category === categoryId)
}

export function getProductById(outletId: string, productId: string): MenuProduct | undefined {
  return getProducts(outletId).find((p) => p.id === productId)
}
