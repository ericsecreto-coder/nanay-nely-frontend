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

export async function updateSectionAction(sectionKey: string, value: unknown) {
  await assertAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ section_key: sectionKey, value }, { onConflict: "section_key" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/home");
  return { success: true };
}

export async function uploadImageAction(formData: FormData) {
  await assertAdmin();

  const file = formData.get("file") as File | null;
  if (!file) {
    return { error: "No file provided." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "Image must be under 5MB." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;

  try {
    const supabase = await createClient();
    const { data, error: uploadError } = await supabase.storage
      .from("images")
      .upload(`public/${fileName}`, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl };
  } catch {
    return { error: "Storage not configured. Use an image URL instead." };
  }
}
