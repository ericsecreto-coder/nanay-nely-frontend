"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserWithRole, isAdminRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { ContactStatus } from "@/lib/types/database";

export async function submitContactMessageAction(input: {
  name: string;
  email: string;
  message: string;
}) {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name || !email || !message) {
    return { error: "Please fill in all fields." };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("contact_messages").insert({
    user_id: user?.id ?? null,
    name,
    email,
    message
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}

export async function updateContactStatusAction(messageId: string, status: ContactStatus) {
  const { role } = await getCurrentUserWithRole();
  if (!isAdminRole(role)) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", messageId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}
