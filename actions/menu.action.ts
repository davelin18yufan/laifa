"use server"
import { createClient } from "@/lib/supabase/server"

interface MenuItem {
  id: string
  name: string
  price: number
  cost: number
  is_available: boolean
  category: string
}

interface OrderItemInput {
  menu_item_id: string
  quantity: number
  unit_price: number
}

interface CreateOrderInput {
  store_id: string
  member_id?: string
  total_amount: number
  payment_method: "cash" | "member_balance"
  items: OrderItemInput[]
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)

  if (error) throw new Error(error.message)

  return data || []
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient()

  // 插入訂單
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      store_id: input.store_id,
      member_id: input.member_id,
      total_amount: input.total_amount,
      payment_method: input.payment_method,
      status: "completed",
    })
    .select()
    .single()

  if (orderError) throw new Error(orderError.message)

  // 插入訂單明細
  const orderItems = input.items.map((item) => ({
    order_id: orderData.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (itemsError) throw new Error(itemsError.message)

  // 如果是會員餘額結帳，更新 transactions 和 members
  if (input.payment_method === "member_balance" && input.member_id) {
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("balance")
      .eq("member_id", input.member_id)
      .single()

    if (memberError || !member) throw new Error("會員不存在")

    const newBalance = member.balance - input.total_amount
    if (newBalance < 0) throw new Error("餘額不足")

    await supabase
      .from("members")
      .update({
        balance: newBalance,
        last_balance_update: new Date().toISOString(),
      })
      .eq("member_id", input.member_id)

    await supabase.from("transactions").insert({
      member_id: input.member_id,
      store_id: input.store_id,
      type: "order",
      amount: -input.total_amount,
      new_balance: newBalance,
      order_id: orderData.id,
    })
  }

  return orderData
}
