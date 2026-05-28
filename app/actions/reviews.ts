"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProductReview, ProductReviewInput } from "@/lib/types/database";

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_reviews")
    .select("*, profiles:user_id(full_name)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  return (data as any) ?? [];
}

export async function getProductReviewStats(productId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_reviews")
    .select("rating")
    .eq("product_id", productId);

  if (!data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = data.reduce((acc, r) => acc + r.rating, 0);
  return { average: Math.round((sum / data.length) * 10) / 10, count: data.length };
}

export async function createReviewAction(input: ProductReviewInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to leave a review." };
  }

  const { error } = await supabase.from("product_reviews").insert({
    product_id: input.product_id,
    user_id: user.id,
    rating: input.rating,
    comment: input.comment
  });

  if (error) return { error: error.message };

  revalidatePath(`/products/${input.product_id}`);
  return { success: true };
}
