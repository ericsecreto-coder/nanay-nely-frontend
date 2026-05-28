"use server";

import { createClient } from "@/lib/supabase/server";

export async function upsertProfileAction(input: {
  fullName: string;
  phone?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: input.fullName.trim(),
      phone: input.phone?.trim() || null,
      role: "customer"
    },
    { onConflict: "id" }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
