"use server"
import { createClient } from "@/lib/supabase/server"

export default async function Instruments() {
  const supabase = await createClient()
  const { data: instruments } = await supabase.from("instruments").select()

  return instruments
}
