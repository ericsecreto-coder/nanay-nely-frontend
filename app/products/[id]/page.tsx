import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils/format";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ReviewSection } from "@/components/review-section";
import Link from "next/link";
import type { Product } from "@/lib/types/database";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();
  if (!product) notFound();

  const p = product as unknown as Product;
  const outOfStock = p.stock <= 0;

  const supabase2 = await createClient();
  const { data: reviews } = await supabase2
    .from("product_reviews")
    .select("*, profiles:user_id(full_name)")
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  const { data: stats } = await supabase2
    .from("product_reviews")
    .select("rating")
    .eq("product_id", id);

  const avgRating = stats && stats.length > 0
    ? Math.round((stats.reduce((a, r) => a + r.rating, 0) / stats.length) * 10) / 10
    : 0;

  return (
    <main className="page">
      <div className="product-detail-layout">
        <div className="pd-image-wrap">
          <img src={p.image_url} alt={p.name} className="pd-image" />
        </div>
        <div className="pd-info">
          <Link href="/products" className="pd-back">&larr; Back to Products</Link>
          <h1 className="pd-name">{p.name}</h1>
          <p className="pd-origin">{p.origin}</p>
          <div className="pd-rating-summary">
            {avgRating > 0 ? (
              <>
                <span className="star-rating-display">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`star ${star <= Math.round(avgRating) ? "star-filled" : "star-empty"}`}>
                      {star <= Math.round(avgRating) ? "\u2605" : "\u2606"}
                    </span>
                  ))}
                </span>
                <span className="pd-rating-text">{avgRating} ({reviews?.length ?? 0} review{(reviews?.length ?? 0) !== 1 ? "s" : ""})</span>
              </>
            ) : (
              <span className="pd-rating-text">No reviews yet</span>
            )}
          </div>
          <p className="pd-price">{formatPrice(Number(p.price))}</p>
          <p className="pd-desc">{p.description}</p>
          <div className="pd-stock">
            {outOfStock ? (
              <span className="sbadge s-pend">Out of Stock</span>
            ) : (
              <span className="sbadge s-del">In Stock ({p.stock} available)</span>
            )}
          </div>
          <div className="pd-actions">
            <AddToCartButton
              productId={p.id}
              name={p.name}
              price={Number(p.price)}
              image_url={p.image_url}
              className={`btn ${outOfStock ? "btn-ghost" : "btn-amber"}`}
            />
          </div>
        </div>
      </div>
      <ReviewSection productId={id} reviews={(reviews as any) ?? []} avgRating={avgRating} />
    </main>
  );
}
