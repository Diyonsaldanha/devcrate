import Image from "next/image";
import Link from "next/link";
import { money, type Product } from "@/lib/products";
import WishlistButton from "./WishlistButton";

export function ProductArt({ p, size = "md" }: { p: Product; size?: "md" | "lg" }) {
  return (
    <div className={`product-art ${size === "lg" ? "product-art-lg" : ""}`} aria-hidden={p.image ? undefined : "true"}>
      {p.image ? (
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes={size === "lg" ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
          className="product-img"
        />
      ) : (
        <span className="product-emoji">{p.emoji}</span>
      )}
    </div>
  );
}

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="product-card-wrap">
      <Link href={`/products/${p.slug}`} className="product-card">
        <ProductArt p={p} />
        <div className="product-info">
          <div className="product-meta">
            <span className="product-category">{p.category}</span>
            <span className="product-price">{money(p.price)}</span>
          </div>
          <h3 className="product-name">{p.name}</h3>
          <p className="product-tagline">{p.tagline}</p>
        </div>
      </Link>
      <WishlistButton slug={p.slug} name={p.name} className="wishlist-button-card" />
    </div>
  );
}
