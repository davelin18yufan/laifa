"use server"

import { createClient } from "@/lib/supabase/server"

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
    const { error: insertError } = await supabase
      .from("transactions")
      .insert({
        member_id: memberId,
        store_id: storeId,
        transaction_type: type,
        amount,
      })
    if (insertError) throw insertError

    // 更新會員餘額
    const updateOperator = type === "deposit" ? "+" : "-"
    const { error: updateError } = await supabase
      .from("members")
      .update({
        balance: supabase.raw(`balance ${updateOperator} ${amount}`),
        last_balance_update: new Date().toISOString(),
      })
      .eq("member_id", memberId)
    if (updateError) throw updateError
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


