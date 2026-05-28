"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { submitOrderAction } from "@/app/actions/orders";
import { useCart } from "@/components/cart/cart-provider";
import { useToast } from "@/components/ui/toast-provider";
import { formatPrice } from "@/lib/utils/format";

type Props = {
  defaultName?: string;
  isLoggedIn: boolean;
};

export function CheckoutForm({ defaultName = "", isLoggedIn }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState(defaultName);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <div className="glass-card">
        <p className="section-desc" style={{ marginBottom: "1rem" }}>
          Please log in to submit your order.
        </p>
        <Link href="/login?redirect=/order" className="btn btn-amber">
          Login to Checkout
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass-card">
        <p className="section-desc" style={{ marginBottom: "1rem" }}>
          Your cart is empty. Add products before checking out.
        </p>
        <Link href="/products" className="btn btn-amber">
          Browse Products
        </Link>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await submitOrderAction({
        customerName,
        contactNumber,
        deliveryAddress,
        notes,
        items
      });

      if (result.error) {
        setError(result.error);
        showToast(result.error, "error");
        return;
      }

      clearCart();
      const successMsg = "Order submitted! We'll confirm within 24 hours.";
      setMessage(successMsg);
      showToast(successMsg, "success");
      router.push(`/dashboard?order=${result.orderId}`);
      router.refresh();
    });
  }

  return (
    <form className="glass-card checkout-form" onSubmit={handleSubmit}>
      <h2 className="dc-title">Checkout Details</h2>

      <div className="checkout-items">
        {items.map((item) => (
          <div key={item.productId} className="checkout-item-row">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="checkout-item-row checkout-total">
          <strong>Total</strong>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
      </div>

      <div className="fg">
        <label className="fl" htmlFor="customer-name">
          Full Name
        </label>
        <input
          id="customer-name"
          className="fi"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>
      <div className="fg">
        <label className="fl" htmlFor="contact-number">
          Contact Number
        </label>
        <input
          id="contact-number"
          className="fi"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="+63 9XX XXX XXXX"
          required
        />
      </div>
      <div className="fg">
        <label className="fl" htmlFor="delivery-address">
          Delivery Address
        </label>
        <textarea
          id="delivery-address"
          className="fi"
          rows={2}
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Street, barangay, municipality"
        />
      </div>
      <div className="fg">
        <label className="fl" htmlFor="order-notes">
          Notes (optional)
        </label>
        <textarea
          id="order-notes"
          className="fi"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Special instructions"
        />
      </div>

      {error && <p className="auth-alert auth-alert-error">{error}</p>}
      {message && <p className="auth-alert auth-alert-success">{message}</p>}

      <button type="submit" className="btn btn-amber" style={{ width: "100%" }} disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Order"}
      </button>
    </form>
  );
}
