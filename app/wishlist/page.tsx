import type { Metadata } from "next";
import WishlistView from "@/components/WishlistView";

export const metadata: Metadata = { title: "Wishlist · DevCrate" };

export default function WishlistPage() {
  return (
    <div className="page-shell">
      <header className="page-heading">
        <h1 className="page-title">Your wishlist</h1>
      </header>
      <WishlistView />
    </div>
  );
}
