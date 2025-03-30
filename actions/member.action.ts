"use server"

import { createClient } from "@/lib/supabase/server"
import { snakeToCamel } from "@/lib/utils"
import { Customer, FrequentMembers, Member, StoreLocation, Note } from "@/types"
import {
  revalidatePath,
  unstable_cache as cache,
  revalidateTag,
} from "next/cache"

export async function getMembers(searchPhone?: string): Promise<Member[]> {
  const supabase = await createClient()

  // 使用左聯表查詢，並限制只取最新的一筆備註
  let query = supabase
    .from("members")
    .select(
      `
      member_id,
      phone,
      name,
      balance,
      last_balance_update,
      birthday,
      gender,
      store_id,
      member_notes!left (
        note_id,
        member_id,
        category,
        content,
        created_at,
        updated_at
      )
    `
    )
    .limit(1, { foreignTable: "member_notes" }) // 只取一筆備註

  if (searchPhone) {
    query = query.ilike("phone", `%${searchPhone}%`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return (data || []).map((member) => {
    const camelMember = snakeToCamel(member)
    const latestNote = member.member_notes?.[0] // 只取第一筆（若存在）
    return {
      memberId: camelMember.memberId,
      phone: camelMember.phone,
      balance: camelMember.balance,
      name: camelMember.name,
      lastBalanceUpdate: camelMember.lastBalanceUpdate,
      birthday: camelMember.birthday,
      gender: camelMember.gender,
      storeId: camelMember.storeId,
      latestNote: latestNote
        ? {
            noteId: latestNote.note_id,
            memberId: latestNote.member_id,
            category: latestNote.category,
            content: latestNote.content,
            createdAt: latestNote.created_at,
            updatedAt: latestNote.updated_at,
          }
        : null,
    }
  })
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

export async function addMember(formData: FormData): Promise<Member> {
  const supabase = await createClient()

  const phone = formData.get("phone") as string
  const name = formData.get("name") as string
  const gender = formData.get("gender") as "male" | "female"
  const storeId = formData.get("storeId") as string

  // 檢查電話號碼是否已存在
  const { data: existingMember, error: checkError } = await supabase
    .from("members")
    .select("member_id")
    .eq("phone", phone)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error(`Failed to check phone number: ${checkError.message}`)
  }

  if (existingMember) {
    throw new Error("此電話號碼已註冊過會員")
  }

  // 新增會員
  const { data, error } = await supabase
    .from("members")
    .insert({
      phone,
      name,
      gender,
      store_id: storeId,
      balance: 0,
      last_balance_update: new Date().toISOString(),
    })
    .select(
      "member_id, phone, name, balance, last_balance_update, gender, store_id"
    )
    .single()

  if (error) throw new Error(`Failed to add member: ${error.message}`)

  revalidatePath("/shopkeeper")
  revalidateTag("frequent_members_by_store")

  return {
    memberId: data.member_id,
    phone: data.phone,
    name: data.name,
    balance: data.balance,
    lastBalanceUpdate: data.last_balance_update,
    gender: data.gender,
    storeId: data.store_id,
    latestNote: null,
  }
}

export async function updateMember(formData: FormData): Promise<Member> {
  const supabase = await createClient()

  const memberId = formData.get("memberId") as string
  const phone = formData.get("phone") as string
  const name = formData.get("name") as string
  const gender = formData.get("gender") as "male" | "female"
  const storeId = formData.get("storeId") as string

  // 檢查電話號碼是否被其他會員使用（排除當前會員）
  const { data: existingMember, error: checkError } = await supabase
    .from("members")
    .select("member_id")
    .eq("phone", phone)
    .neq("member_id", memberId) // 排除自身
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    throw new Error(`Failed to check phone number: ${checkError.message}`)
  }

  if (existingMember) {
    throw new Error("此電話號碼已被其他會員使用")
  }

  // 更新會員資料
  const { data, error } = await supabase
    .from("members")
    .update({
      phone,
      name,
      gender,
      store_id: storeId,
    })
    .eq("member_id", memberId)
    .select(
      "member_id, phone, name, balance, last_balance_update, gender, store_id"
    )
    .single()

  if (error) throw new Error(`Failed to update member: ${error.message}`)

  revalidatePath("/shopkeeper")

  return {
    memberId: data.member_id,
    phone: data.phone,
    name: data.name,
    balance: data.balance,
    lastBalanceUpdate: data.last_balance_update,
    gender: data.gender,
    storeId: data.store_id,
    latestNote: null, // 這裡不更新備註
  }
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
      "store_id, store_name, member_id, phone, gender, name, balance, last_visit, transaction_count, total_spent, latest_note_category, latest_note_content, latest_note_date"
    )
    .order("store_id, transaction_count", { ascending: false })

  if (error) throw new Error(error.message)

  const frequentMembers: FrequentMembers[] = (data || []).map(
    (item) => snakeToCamel(item) as FrequentMembers
  )

  const storeLocations = frequentMembers.reduce<StoreLocation[]>(
    (acc, curr) => {
      const store = acc.find((s) => s.id === curr.storeId)
      const customer: Customer = {
        id: curr.memberId,
        phone: curr.phone,
        balance: curr.balance ?? 0,
        name: curr.name,
        storeId: curr.storeId,
        gender: curr.gender,
        lastVisit: curr.lastVisit ?? "",
        transactionCount: curr.transactionCount,
        totalSpent: curr.totalSpent,
        latestNote: curr.latestNoteCategory
          ? {
              noteId: "", // 因為 frequent_members_by_store 未提供 noteId，設為空字串
              memberId: curr.memberId, // 使用 memberId 填充
              category: curr.latestNoteCategory,
              content: curr.latestNoteContent ?? "",
              createdAt: curr.latestNoteDate ?? "",
              updatedAt: curr.latestNoteDate ?? "", // 假設 updatedAt 與 createdAt 相同
            }
          : null, // 與 Customer 型別一致，允許 null
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

export async function cacheFrequentMembersByStore() {
  return cache(
    () => getFrequentMembersByStore(),
    ["frequent_members_by_store"],
    { tags: ["frequent_members_by_store"] }
  )
}

export async function upsertMemberNote({
  memberId,
  category,
  content,
}: {
  memberId: string
  category: string
  content: string
}): Promise<Note> {
  const supabase = await createClient()

  // 檢查是否已有備註
  const { data: existingNote, error: fetchError } = await supabase
    .from("member_notes")
    .select("note_id, member_id, category, content, created_at, updated_at")
    .eq("member_id", memberId)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 表示無記錄
    throw new Error(`Failed to check existing note: ${fetchError.message}`)
  }

  if (existingNote) {
    // 更新現有備註
    const { data, error } = await supabase
      .from("member_notes")
      .update({
        category,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("note_id", existingNote.note_id)
      .select("note_id, member_id, category, content, created_at, updated_at")
      .single()

    if (error) throw error

    return {
      noteId: data.note_id,
      memberId: data.member_id,
      category: data.category,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } else {
    // 新增備註
    const { data, error } = await supabase
      .from("member_notes")
      .insert({
        member_id: memberId,
        category,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("note_id, member_id, category, content, created_at, updated_at")
      .single()

    if (error) throw error

    revalidatePath("/shopkeepers")

    return {
      noteId: data.note_id,
      memberId: data.member_id,
      category: data.category,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }
}

export async function updateMemberNote({
  noteId,
  category,
  content,
}: {
  noteId: string
  category: string
  content: string
}): Promise<Note> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("member_notes")
      .update({
        category,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)
      .select("id, member_id, category, content, created_at, updated_at")
      .single()

    if (error) throw error

    const note: Note = {
      noteId: data.id,
      memberId: data.member_id,
      category: data.category,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return note
  } catch (error) {
    throw new Error(`Failed to update note: ${(error as Error).message}`)
  }
}
