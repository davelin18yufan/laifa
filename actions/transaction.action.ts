"use server"

import { createClient } from "@/lib/supabase/server"
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
