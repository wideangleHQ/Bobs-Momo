export interface ProductVariant {
  id: string
  label: string
  price: number
}

export interface MenuProduct {
  id: string
  category: string
  name: string
  description: string
  image: string
  isVeg: boolean
  isChefSpecial: boolean
  availability: boolean
  tags: string[]
  prices?: Record<string, number>
  variants?: ProductVariant[]
  sortOrder: number
}

export interface MenuCategory {
  id: string
  label: string
  icon: string
  thumbnail: string
  sortOrder: number
}

export interface MenuOutlet {
  id: string
  name: string
  categories: MenuCategory[]
  products: MenuProduct[]
}

export interface MenuData {
  outlets: MenuOutlet[]
}

export interface MenuItem {
  id: string
  title: string
  ingredients: string
  price: string
  variants: ProductVariant[]
  image: string
  category: string
  isVeg: boolean
  isChefSpecial: boolean
  tags: string[]
}
