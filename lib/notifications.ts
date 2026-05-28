import { createClient } from "@/lib/supabase/server";
import type { Notification, NotificationType } from "@/lib/types/database";

export async function getAdminNotifications(): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .is("user_id", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data as Notification[];
}

export async function getAdminUnreadCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .is("user_id", null)
    .eq("is_read", false);

  if (error || count === null) return 0;
  return count;
}

export async function getCustomerNotifications(userId: string): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data as Notification[];
}

type CreateNotificationInput = {
  userId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  relatedOrderId?: string | null;
};

export async function createNotification(input: CreateNotificationInput): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("notifications").insert({
    user_id: input.userId ?? null,
    type: input.type,
    title: input.title,
    message: input.message,
    related_order_id: input.relatedOrderId ?? null,
  });

  return !error;
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  return !error;
}

export async function markAllNotificationsAsRead(userId?: string | null): Promise<boolean> {
  const supabase = await createClient();
  const query = supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);

  if (userId === undefined) {
    query.is("user_id", null);
  } else if (userId !== null) {
    query.eq("user_id", userId);
  }

  const { error } = await query;
  return !error;
}
