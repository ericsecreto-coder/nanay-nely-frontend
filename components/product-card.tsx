import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatPrice } from "@/lib/utils/format";

type Product = {
  id: string;
  name: string;
  origin: string;
  desc: string;
  price: number;
  image: string;
  stock?: number;
};

export function ProductCard({ id, name, origin, desc, price, image, stock }: Product) {
  const outOfStock = stock !== undefined && stock <= 0;

  return (
    <article className="p-card">
      <Link href={`/products/${id}`} className="p-img-link">
        <div className="p-img-wrap">
          <img src={image} alt={name} />
          {outOfStock && <span className="oos-badge">Out of Stock</span>}
        </div>
      </Link>
      <div className="p-body">
        <Link href={`/products/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <h3 className="p-name">{name}</h3>
        </Link>
        <p style={{ color: "var(--leaf)", fontStyle: "italic", margin: "0.25rem 0 0.6rem" }}>{origin}</p>
        <p className="p-desc">{desc}</p>
        <div className="p-footer">
          <div className="p-price">{formatPrice(price)}</div>
          {outOfStock ? (
            <span className="btn btn-ghost btn-sm" style={{ opacity: 0.5, cursor: "not-allowed" }}>Unavailable</span>
          ) : (
            <AddToCartButton productId={id} name={name} price={price} image_url={image} className="btn btn-amber btn-sm" />
          )}
        </div>
      </div>
    </article>
  );
}
