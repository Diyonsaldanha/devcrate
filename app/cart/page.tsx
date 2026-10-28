import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Cart · DevCrate" };

export default function CartPage() {
  return (
    <div className="page-shell">
      <header className="page-heading">
        <h1 className="page-title">Your cart</h1>
      </header>
      <CartView />
    </div>
  );
}
