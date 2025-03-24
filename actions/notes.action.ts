"use server"

import { createClient } from "@/lib/supabase/server"

export async function getMemberNotes(memberId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("member_notes")
    .select("note_id, category, content, created_at")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function updateMemberNote({
  noteId,
  category,
  content,
}: {
  noteId: string
  category?: "hobby" | "behavior" | "status"
  content?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("member_notes")
    .update({ category, content })
    .eq("note_id", noteId)

  if (error) throw new Error(error.message)
}

export async function deleteMemberNote(noteId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("member_notes")
    .delete()
    .eq("note_id", noteId)

  if (error) throw new Error(error.message)
}
