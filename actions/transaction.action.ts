"use server"

import { createClient } from "@/lib/supabase/server"
import { CreateOrderInput } from "@/types/Order"
import { revalidatePath } from "next/cache"

export async function recordTransaction({
  memberId,
  storeId,
  type,
  amount,
}: {
  memberId: string
  storeId: string
  type: "consumption" | "deposit"
  amount: number
}) {
  const supabase = await createClient()

  try {
    // 插入交易記錄
    const { error: insertError } = await supabase.from("transactions").insert({
      member_id: memberId,
      store_id: storeId,
      transaction_type: type,
      amount,
      transaction_date: new Date().toISOString(),
    })
    if (insertError) throw insertError
    // 查詢當前餘額
    const { data: memberData, error: fetchError } = await supabase
      .from("members")
      .select("balance")
      .eq("member_id", memberId)
      .single()
    if (fetchError) throw fetchError

    const currentBalance = memberData?.balance ?? 0
    const newBalance =
      type === "deposit" ? currentBalance + amount : currentBalance - amount

    // 更新會員餘額
    const { error: updateError } = await supabase
      .from("members")
      .update({
        balance: newBalance,
        last_balance_update: new Date().toISOString(),
      })
      .eq("member_id", memberId)
    if (updateError) throw updateError

    revalidatePath("/shopkeepers")
    return { success: true, newBalance }
  } catch (error) {
    throw new Error(`Transaction failed: ${(error as Error).message}`)
  }
}

export async function getTransactions({
  memberId,
  storeId,
  startDate,
  endDate,
}: {
  memberId?: string
  storeId?: string
  startDate?: string
  endDate?: string
}) {
  const supabase = await createClient()
  let query = supabase
    .from("transactions")
    .select(
      "transaction_id, member_id, store_id, transaction_type, amount, transaction_date"
    )

  if (memberId) query = query.eq("member_id", memberId)
  if (storeId) query = query.eq("store_id", storeId)
  if (startDate && endDate)
    query = query
      .gte("transaction_date", startDate)
      .lte("transaction_date", endDate)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient()

  // 驗證輸入
  if (!input.storeId) {
    throw new Error("分店 ID 為必填")
  }
  if (!input.items || input.items.length === 0) {
    throw new Error("訂單項目不可為空")
  }
  if (input.totalAmount <= 0) {
    throw new Error("訂單總額必須大於 0")
  }
  if (
    input.paymentMethod === "member_balance" &&
    (!input.memberId ||
      input.memberId === "")
  ) {
    throw new Error("會員結帳必須提供有效的會員 ID")
  }
  for (const item of input.items) {
    if (item.quantity <= 0 || item.unitPrice <= 0) {
      throw new Error("訂單項目數量或單價無效")
    }
  }

  // 開始事務
  try {
    // 插入訂單
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        store_id: input.storeId,
        member_id:
          input.paymentMethod === "member_balance" ? input.memberId : null,
        total_amount: input.totalAmount,
        payment_method: input.paymentMethod,
        status: "completed",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (orderError || !orderData) {
      console.error("Error creating order:", orderError)
      throw new Error(orderError?.message || "無法創建訂單")
    }

    // 插入訂單明細
    const orderItems = input.items.map((item) => ({
      order_id: orderData.id,
      menu_item_id: item.menuItemId, // 修正：正確映射到 menu_item_id
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      throw new Error(itemsError?.message || "無法創建訂單明細")
    }

    // 記錄交易
    const transactionData = {
      member_id:
        input.paymentMethod === "member_balance" ? input.memberId : null,
      store_id: input.storeId,
      transaction_type: "consumption",
      amount:
        input.paymentMethod === "member_balance"
          ? -input.totalAmount
          : input.totalAmount,
      transaction_date: new Date().toISOString(),
      order_id: orderData.id,
    }

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert(transactionData)

    if (transactionError) {
      console.error("Error creating transaction:", transactionError)
      throw new Error(transactionError?.message || "無法記錄交易")
    }

    // 處理會員餘額結帳
    if (input.paymentMethod === "member_balance" && input.memberId) {
      // 查詢會員餘額
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("member_id, balance")
        .eq("member_id", input.memberId)
        .single()

      if (memberError || !member) {
        console.error("Error fetching member:", memberError)
        throw new Error("會員不存在")
      }

      // 檢查餘額
      const newBalance = member.balance - input.totalAmount
      if (newBalance < 0) {
        throw new Error("餘額不足")
      }

      // 更新會員餘額
      const { error: updateError } = await supabase
        .from("members")
        .update({
          balance: newBalance,
          last_balance_update: new Date().toISOString(),
        })
        .eq("member_id", input.memberId)

      if (updateError) {
        console.error("Error updating member balance:", updateError)
        throw new Error("無法更新會員餘額")
      }
    }

    // 日誌
    console.log(
      `Order created: ID=${orderData.id}, Payment=${
        input.paymentMethod
      }, Member=${input.memberId || "none"}, Store=${input.storeId}`
    )

    return {
      id: orderData.id,
      storeId: orderData.store_id,
      memberId: orderData.member_id,
      totalAmount: orderData.total_amount,
      paymentMethod: orderData.payment_method,
      status: orderData.status,
      createdAt: orderData.created_at,
    }
  } catch (error: any) {
    console.error("Create order failed:", error)
    throw new Error(error.message || "結帳失敗")
  }
}