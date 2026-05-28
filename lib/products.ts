import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types/database";

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as Product[];
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Product[];
}
