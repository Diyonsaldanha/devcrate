import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AddToCart from "@/components/AddToCart";
import ProductCard, { ProductArt } from "@/components/ProductCard";
import { getProduct, money, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p ? `${p.name} · DevCrate` : "Not found" };
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="page-shell" />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);

  return (
    <div className="page-shell">
      <Link href="/products" className="breadcrumb">
        ← All pieces
      </Link>
      <div className="detail-layout">
        <div className="detail-art"><ProductArt p={p} size="lg" /></div>
        <div className="detail-copy">
          <p className="detail-category">{p.category}</p>
          <h1 className="detail-title">{p.name}</h1>
          <p className="detail-tagline">{p.tagline}</p>
          <p className="detail-price">{money(p.price)}</p>
          <p className="detail-rating">★ {p.rating.toFixed(1)} <span aria-label="out of 5">/ 5</span></p>
          <p className="detail-description">{p.description}</p>
          <ul className="spec-list">
            {p.specs.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <AddToCart slug={p.slug} name={p.name} />
        </div>
      </div>
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">More from {p.category}</p>
              <h2 className="section-title">You may also like</h2>
            </div>
          </div>
          <div className="catalog-grid">
            {related.map((r) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
