"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserWithRole, isAdminRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const { user, role } = await getCurrentUserWithRole();
  if (!user || !isAdminRole(role)) {
    throw new Error("Unauthorized");
  }
}

type AdminProfile = {
  id: string;
  email: string | null;
  full_name: string;
  role: string;
  created_at: string;
  last_sign_in: string | null;
};

export async function getAdminCandidatesAction(): Promise<{ data?: AdminProfile[]; error?: string }> {
  try {
    await assertAdmin();
    const supabase = await createClient();

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, role, created_at");

    if (profilesError) {
      return { error: profilesError.message };
    }

    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      return { error: authError.message };
    }

    const emailMap = new Map<string, { email: string; last_sign_in: string | null }>();
    for (const u of authUsers.users) {
      emailMap.set(u.id, { email: u.email ?? "—", last_sign_in: u.last_sign_in_at ?? null });
    }

    const result: AdminProfile[] = profiles.map((p) => {
      const authInfo = emailMap.get(p.id);
      return {
        id: p.id,
        email: authInfo?.email ?? "—",
        full_name: p.full_name,
        role: p.role,
        created_at: p.created_at,
        last_sign_in: authInfo?.last_sign_in ?? null
      };
    });

    return { data: result };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unauthorized" };
  }
}

export async function promoteToAdminAction(userId: string) {
  await assertAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/admins");
  return { success: true };
}

export async function demoteToCustomerAction(userId: string) {
  await assertAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: "customer" })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/admins");
  return { success: true };
}
