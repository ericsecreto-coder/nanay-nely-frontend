import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types/database";

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Profile;
}

export async function getCurrentUserWithRole() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, role: null as UserRole | null };
  }

  const profile = await getProfile(user.id);
  return { user, profile, role: profile?.role ?? ("customer" as UserRole) };
}

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "admin";
}
