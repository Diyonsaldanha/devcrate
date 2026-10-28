"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import WishlistButton from "./WishlistButton";

export default function AddToCart({ slug, name }: { slug: string; name: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="add-to-cart">
      <div className="quantity-control">
        <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          −
        </button>
        <span className="w-8 text-center font-mono">{qty}</span>
        <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))}>
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          add(slug, qty);
          setAdded(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setAdded(false), 1500);
        }}
        className="button-primary add-button"
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
      <WishlistButton slug={slug} name={name} className="wishlist-button-detail" />
    </div>
  );
}
