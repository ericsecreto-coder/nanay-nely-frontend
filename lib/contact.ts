import { createClient } from "@/lib/supabase/server";
import type { ContactMessage } from "@/lib/types/database";

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as ContactMessage[];
}
