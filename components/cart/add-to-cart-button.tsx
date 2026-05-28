"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

type Props = {
  productId: string;
  name: string;
  price: number;
  image_url: string;
  className?: string;
};

export function AddToCartButton({ productId, name, price, image_url, className = "btn btn-amber" }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ productId, name, price, image_url });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
