"use client";

import { useWishlist } from "./WishlistProvider";

export default function WishlistButton({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const { has, toggle, ready } = useWishlist();
  const active = ready && has(slug);

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      className={`wishlist-button ${active ? "wishlist-button-active" : ""} ${className}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.6 5 6.7 5c1.9 0 3.3 1 5.3 3 2-2 3.4-3 5.3-3 3.1 0 5 2.9 3.9 6.1-1.7 4.8-9.2 9.4-9.2 9.4Z" />
      </svg>
    </button>
  );
}
