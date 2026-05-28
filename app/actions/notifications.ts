"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserWithRole, isAdminRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export async function getAdminNotificationsAction() {
  try {
    const { user, role } = await getCurrentUserWithRole();
    if (!user || !isAdminRole(role)) return [];

    const supabase = await createClient();
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .is("user_id", null)
      .order("created_at", { ascending: false })
      .limit(50);

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminUnreadCountAction(): Promise<number> {
  try {
    const { user, role } = await getCurrentUserWithRole();
    if (!user || !isAdminRole(role)) return 0;

    const supabase = await createClient();
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .is("user_id", null)
      .eq("is_read", false);

    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function markAdminNotificationReadAction(notificationId: string) {
  try {
    const { user, role } = await getCurrentUserWithRole();
    if (!user || !isAdminRole(role)) return { error: "Unauthorized" };

    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .is("user_id", null);

    if (error) return { error: error.message };

    revalidatePath("/admin/notifications");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { error: "Unauthorized" };
  }
}

export async function markAllAdminNotificationsReadAction() {
  try {
    const { user, role } = await getCurrentUserWithRole();
    if (!user || !isAdminRole(role)) return { error: "Unauthorized" };

    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .is("user_id", null)
      .eq("is_read", false);

    if (error) return { error: error.message };

    revalidatePath("/admin/notifications");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { error: "Unauthorized" };
  }
}
