"use server"

import { createClient } from "@/lib/supabase/server"
import { snakeToCamel } from "@/lib/utils"
import { StoreLocation } from "@/types"

export async function getAllStores(): Promise<
  Pick<StoreLocation, "id" | "name">[]
> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("stores").select("store_id, store_name")

  if (error) {
    console.error("Error fetching stores:", error.message, error.code)
    throw new Error(`Failed to fetch stores: ${error.message}`)
  }

  return (data || []).map((store) => {
    const camelMember = snakeToCamel(store)
    return {
      id: camelMember.storeId,
      name: camelMember.storeName,
    }
  })
}

export async function getStoreById(storeId: string): Promise<StoreLocation> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("store_id", storeId)
    .single()

  if (error) {
    console.error("Error fetching store:", error.message, error.code)
    throw new Error(`Failed to fetch store: ${error.message}`)
  }

  return snakeToCamel(data)
}
