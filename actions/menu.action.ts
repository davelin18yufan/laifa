"use server"
import { createClient } from "@/lib/supabase/server"
import { MenuItem, CreateOrderInput } from "@/types/Order"


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
      store_id: input.storeId,
      member_id: input.memberId,
      total_amount: input.totalAmount,
      payment_method: input.paymentMethod,
      status: "completed",
    })
    .select()
    .single()

  if (orderError) throw new Error(orderError.message)

  // 插入訂單明細
  const orderItems = input.items.map((item) => ({
    order_id: orderData.id,
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }))

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (itemsError) throw new Error(itemsError.message)

  // 如果是會員餘額結帳，更新 transactions 和 members
  if (input.paymentMethod === "member_balance" && input.memberId) {
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("balance")
      .eq("member_id", input.memberId)
      .single()

    if (memberError || !member) throw new Error("會員不存在")

    const newBalance = member.balance - input.totalAmount
    if (newBalance < 0) throw new Error("餘額不足")

    await supabase
      .from("members")
      .update({
        balance: newBalance,
        last_balance_update: new Date().toISOString(),
      })
      .eq("member_id", input.memberId)

    await supabase.from("transactions").insert({
      member_id: input.memberId,
      store_id: input.storeId,
      type: "order",
      amount: -input.totalAmount,
      new_balance: newBalance,
      order_id: orderData.id,
    })
  }

  return orderData
}
