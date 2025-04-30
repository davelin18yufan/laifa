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

