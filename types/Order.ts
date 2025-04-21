
export interface MenuItem {
  id: string
  name: string
  price: number
  cost: number
  is_available: boolean
  category: string
}

export interface OrderItemInput {
  menu_item_id: string
  quantity: number
  unit_price: number
}

export interface CreateOrderInput {
  store_id: string
  member_id?: string
  total_amount: number
  payment_method: "cash" | "member_balance"
  items: OrderItemInput[]
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface GroupedProduct {
  baseName: string
  category: string
  variants: { id: string; name: string; price: number }[]
}