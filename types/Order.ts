export interface MenuItem {
  id: string
  name: string
  price: number
  cost: number
  is_available: boolean
  category: string
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

export interface Product {
  id: string
  name: string
  price: number
  category: string
  imageUrl?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface GroupedProduct {
  baseName: string
  category: string
  variants: { id: string; name: string; price: number; image_url?: string }[]
}
