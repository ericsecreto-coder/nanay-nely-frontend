"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/utils/format";

export function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: "center" }}>
        <p className="section-desc" style={{ margin: "0 auto 1rem" }}>
          Your cart is empty. Browse our products and add items to get started.
        </p>
        <Link href="/products" className="btn btn-amber">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section className="dc">
        <h2 className="dc-title">Cart Items ({itemCount})</h2>
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.productId} className="cart-item">
              <img src={item.image_url} alt={item.name} className="cart-item-img" />
              <div className="cart-item-body">
                <h3 className="a-title">{item.name}</h3>
                <p className="a-text">{formatPrice(item.price)} each</p>
                <div className="cart-item-actions">
                  <label className="fl" htmlFor={`qty-${item.productId}`}>
                    Qty
                  </label>
                  <input
                    id={`qty-${item.productId}`}
                    className="fi cart-qty-input"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  />
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => removeItem(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-item-total">{formatPrice(item.price * item.quantity)}</div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="glass-card cart-summary">
        <h2 className="dc-title">Order Summary</h2>
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <p className="a-text" style={{ margin: "0.75rem 0 1.25rem" }}>
          Shipping and payment details will be confirmed after you submit your order.
        </p>
        <Link href="/order" className="btn btn-amber" style={{ width: "100%", justifyContent: "center" }}>
          Proceed to Checkout
        </Link>
        <Link href="/products" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
          Continue Shopping
        </Link>
      </aside>
    </div>
  );
}
