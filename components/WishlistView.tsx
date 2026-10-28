"use client";

import Link from "next/link";
import { getProduct } from "@/lib/products";
import ProductCard from "./ProductCard";
import { useWishlist } from "./WishlistProvider";

export default function WishlistView() {
  const { slugs, ready } = useWishlist();
  if (!ready) return null;

  const items = slugs.flatMap((s) => {
    const p = getProduct(s);
    return p ? [p] : [];
  });

  if (!items.length)
    return (
      <div className="empty-state">
        <h2 className="empty-state-title">Nothing saved yet.</h2>
        <p className="empty-state-copy">Tap the heart on any product to save it here.</p>
        <Link href="/products" className="button-primary">
          Browse the shop
        </Link>
      </div>
    );

  return (
    <div className="catalog-grid">
      {items.map((p) => (
        <ProductCard key={p.slug} p={p} />
      ))}
    </div>
  );
}
