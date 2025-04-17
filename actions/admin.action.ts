// actions/admin.action.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import {
  BusinessOverview,
  PeakTransactionHour,
  NoteCategoryStat,
  StorePerformance,
  TopSpendingMember,
} from "@/types"
import { snakeToCamel } from "@/lib/utils"

export async function getBusinessOverview(): Promise<BusinessOverview> {
  const supabase = await createClient()
  const { data } = await supabase.from("business_overview").select("*").single()
  return snakeToCamel(data) as BusinessOverview
}

export async function getPeakTransactionHours(): Promise<
  PeakTransactionHour[]
> {
  const supabase = await createClient()
  const { data } = await supabase.from("peak_transaction_hours").select("*")
  return snakeToCamel(data) as PeakTransactionHour[]
}

export async function getNoteCategoryStats(): Promise<NoteCategoryStat[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("note_category_stats").select("*")
  return snakeToCamel(data) as NoteCategoryStat[]
}

export async function getStorePerformance(): Promise<StorePerformance[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("store_performance").select("*")
  return snakeToCamel(data) as StorePerformance[]
}

export async function getTopSpendingMembers(): Promise<TopSpendingMember[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("top_spending_members").select("*")
  return snakeToCamel(data) as TopSpendingMember[]
}
