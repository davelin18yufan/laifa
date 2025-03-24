"use server"

import { createClient } from "@/lib/supabase/server"

export async function getMembers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("members")
    .select(
      "member_id, phone, name, balance, last_balance_update, birthday, gender"
    )

  if (error) throw new Error(error.message)
  return data
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
