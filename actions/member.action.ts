"use server"

import { createClient } from "@/lib/supabase/server"
import { snakeToCamel } from "@/lib/utils"
import { Customer, Member, StoreLocation } from "@/types"

export async function getMembers(searchPhone?: string): Promise<Member[]> {
  const supabase = await createClient()
  let query = supabase
    .from("members")
    .select(
      "member_id, phone, name, balance, last_balance_update, birthday, gender"
    )

  if (searchPhone) {
    query = query.ilike("phone", `%${searchPhone}%`) // 使用 ilike 模糊搜尋（不區分大小寫）
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return (data || []).map(snakeToCamel)
}

export async function getMemberById(memberId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("members")
    .select(
      "member_id, phone, name, balance, last_balance_update, birthday, gender"
    )
    .eq("member_id", memberId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createMember({
  phone,
  name,
  birthday,
  gender,
}: {
  phone: string
  name: string
  birthday?: string
  gender?: "male" | "female" | "other"
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("members")
    .insert({ phone, name, birthday, gender })
    .select("member_id")
    .single()

  if (error) throw new Error(error.message)
  return data.member_id // 返回新會員的 ID
}

export async function updateMember(
  memberId: string,
  updates: {
    phone?: string
    name?: string
    birthday?: string
    gender?: "male" | "female" | "other"
  }
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("members")
    .update(updates)
    .eq("member_id", memberId)

  if (error) throw new Error(error.message)
}

export async function deleteMember(memberId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("members")
    .delete()
    .eq("member_id", memberId)

  if (error) throw new Error(error.message)
}

export async function getFrequentMembersByStore(): Promise<StoreLocation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("frequent_members_by_store")
    .select(
      "store_id, store_name, member_id, phone, name, balance, last_visit, transaction_count, total_spent, latest_note_category, latest_note_content"
    )
    .order("store_id, transaction_count", { ascending: false })

  if (error) throw new Error(error.message)

  const frequentMembers = (data || []).map(snakeToCamel)

  const storeLocations: StoreLocation[] = frequentMembers.reduce(
    (acc: StoreLocation[], curr: any) => {
      const store = acc.find((s) => s.id === curr.storeId)
      const customer: Customer = {
        id: curr.memberId,
        phone: curr.phone,
        balance: curr.balance ?? 0,
        name: curr.name,
        lastVisit: curr.lastVisit ?? "",
        transactionCount: curr.transactionCount,
        totalSpent: curr.totalSpent,
        latestNote: curr.latestNoteCategory
          ? {
              category: curr.latestNoteCategory,
              content: curr.latestNoteContent ?? "",
            }
          : null,
      }

      if (store) {
        store.customers.push(customer)
      } else {
        acc.push({
          id: curr.storeId,
          name: curr.storeName,
          customers: [customer],
        })
      }
      return acc
    },
    []
  )

  return storeLocations
}
