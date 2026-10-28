"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CheckoutSuccess() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="empty-state">
      <div className="empty-state-mark" aria-hidden="true">✓</div>
      <h1 className="empty-state-title">Thanks, you’re all set.</h1>
      <p className="empty-state-copy">Your test payment went through. No real money was charged.</p>
      <Link href="/products" className="button-primary">Keep browsing</Link>
    </div>
  );
}
