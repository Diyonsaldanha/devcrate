"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products, type Category } from "@/lib/products";
import ProductCard from "./ProductCard";

const sorts = {
  featured: "Featured",
  low: "Price: low to high",
  high: "Price: high to low",
  rating: "Top rated",
} as const;

export default function ProductBrowser() {
  const initialCategory = useSearchParams().get("category");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "All">(
    categories.find((c) => c === initialCategory) ?? "All",
  );
  const [sort, setSort] = useState<keyof typeof sorts>("featured");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!term || `${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(term)),
    );
    if (sort === "low") out.sort((a, b) => a.price - b.price);
    if (sort === "high") out.sort((a, b) => b.price - a.price);
    if (sort === "rating") out.sort((a, b) => b.rating - a.rating);
    if (sort === "featured") out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return out;
  }, [q, cat, sort]);

  return (
    <div>
      <div className="catalog-controls">
        <input
          aria-label="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the collection"
          className="catalog-search"
        />
        {(["All", ...categories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`filter-button ${cat === c ? "filter-button-active" : ""}`}
          >
            {c}
          </button>
        ))}
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(e) => setSort(e.target.value as keyof typeof sorts)}
          className="catalog-sort"
        >
          {Object.entries(sorts).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {list.length ? (
        <>
          <p className="catalog-results">{list.length} {list.length === 1 ? "piece" : "pieces"} in the collection</p>
          <div className="catalog-grid">
            {list.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        </>
      ) : (
        <p className="empty-results">Nothing here just yet. Try another search or category.</p>
      )}
    </div>
  );
}
