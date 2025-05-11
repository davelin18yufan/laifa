export interface MenuItem {
  id: string
  name: string
  price: number
  cost: number
  isAvailable: boolean
  category: string
  imageUrl?: string
}

export interface OrderItemInput {
  menuItemId: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderInput {
  storeId: string
  memberId?: string
  totalAmount: number
  paymentMethod: "cash" | "member_balance"
  items: OrderItemInput[]
}

export type Product = Omit<MenuItem, "cost" | "isAvailable"> 

export interface CartItem extends Product {
  quantity: number
}

export interface GroupedProduct {
  baseName: string
  category: string
  variants: { id: string; name: string; price: number; image_url?: string }[]
}
