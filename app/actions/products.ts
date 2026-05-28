"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserWithRole, isAdminRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { ProductInput } from "@/lib/types/database";

async function assertAdmin() {
  const { user, role } = await getCurrentUserWithRole();
  if (!user || !isAdminRole(role)) {
    throw new Error("Unauthorized");
  }
}

function parseProductInput(formData: FormData): ProductInput {
  const price = Number(formData.get("price"));
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Invalid price");
  }

  const stock = Number(formData.get("stock"));
  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error("Invalid stock quantity");
  }

  return {
    name: String(formData.get("name") ?? "").trim(),
    origin: String(formData.get("origin") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price,
    image_url: String(formData.get("image_url") ?? "").trim(),
    is_active: formData.get("is_active") === "on",
    stock
  };
}

function validateProductInput(input: ProductInput) {
  if (!input.name || !input.origin || !input.description || !input.image_url) {
    throw new Error("All fields are required.");
  }
}

export async function createProductAction(formData: FormData) {
  await assertAdmin();
  const input = parseProductInput(formData);
  validateProductInput(input);

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert(input);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateProductAction(productId: string, formData: FormData) {
  await assertAdmin();
  const input = parseProductInput(formData);
  validateProductInput(input);

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(input).eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  await assertAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  return { success: true };
}

export async function toggleProductActiveAction(productId: string, isActive: boolean) {
  await assertAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}
