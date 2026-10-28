"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";

export default function Header() {
  const { count, ready } = useCart();
  const { slugs, ready: wishlistReady } = useWishlist();
  const pathname = usePathname();
  const isShop = pathname.startsWith("/products");
  const isWishlist = pathname.startsWith("/wishlist");
  const isCart = pathname.startsWith("/cart");

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Devcrate home">
          Devcrate
        </Link>
        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/products" className={`nav-link ${isShop ? "nav-link-active" : ""}`} aria-current={isShop ? "page" : undefined}>
            Shop
          </Link>
          <Link href="/wishlist" className={`nav-link cart-link ${isWishlist ? "nav-link-active" : ""}`} aria-current={isWishlist ? "page" : undefined}>
            <span>Wishlist</span>
            {wishlistReady && slugs.length > 0 && (
              <span className="cart-count" aria-label={`${slugs.length} saved items`}>
                {slugs.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className={`nav-link cart-link ${isCart ? "nav-link-active" : ""}`} aria-current={isCart ? "page" : undefined}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span>Cart</span>
            {ready && count > 0 && (
              <span className="cart-count" aria-label={`${count} items in bag`}>
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
