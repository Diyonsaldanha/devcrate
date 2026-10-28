import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

export default function Home() {
  const featured = products.filter((p) => p.featured);
  return (
    <div className="container">
      <section className="hero">
        <h1>Developer keychains and stickers</h1>
        <p>Small gifts for the languages and tools you use every day.</p>
        <Link href="/products" className="button-primary">
          Shop all products
        </Link>
      </section>

      <div className="category-list">
        {categories.map((c) => (
          <Link key={c} href={`/products?category=${c}`} className="category-link">
            {c}
            <span className="category-count">{products.filter((p) => p.category === c).length}</span>
          </Link>
        ))}
      </div>

      <section className="home-section">
        <div className="section-heading-row">
          <h2 className="section-title">Featured</h2>
          <Link href="/products" className="text-link">
            View all
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
