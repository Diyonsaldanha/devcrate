import { Suspense } from "react";
import type { Metadata } from "next";
import ProductBrowser from "@/components/ProductBrowser";

export const metadata: Metadata = { title: "Shop · DevCrate" };

export default function ProductsPage() {
  return (
    <div className="page-shell">
      <header className="page-heading">
        <h1 className="page-title">Shop</h1>
        <p className="page-subtitle">Browse, filter and sort the full catalog.</p>
      </header>
      <Suspense>
        <ProductBrowser />
      </Suspense>
    </div>
  );
}
