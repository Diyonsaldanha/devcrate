"use client";

import Link from "next/link";
import { useState } from "react";
import { getProduct, money } from "@/lib/products";
import { FREE_SHIPPING_CENTS, PROMO_RATES, SHIPPING_CENTS } from "@/lib/pricing";
import { useCart } from "./CartProvider";
import { ProductArt } from "./ProductCard";

const FREE_SHIPPING = FREE_SHIPPING_CENTS / 100;
const SHIPPING = SHIPPING_CENTS / 100;
const CODES = PROMO_RATES;

export default function CartView() {
  const { lines, total, ready, setQty } = useCart();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const items = Object.entries(lines).flatMap(([slug, qty]) => {
    const p = getProduct(slug);
    return p ? [{ p, qty }] : [];
  });

  if (!ready) return null;

  if (!items.length)
    return (
      <div className="empty-state">
        <div className="empty-state-mark" aria-hidden="true">＋</div>
        <h2 className="empty-state-title">Your bag is taking a breather.</h2>
        <p className="empty-state-copy">Take a look around and find something you’ll love having nearby.</p>
        <Link href="/products" className="button-primary">
          Explore the shop
        </Link>
      </div>
    );

  const discount = applied ? total * CODES[applied] : 0;
  const sub = total - discount;
  const shipping = sub >= FREE_SHIPPING ? 0 : SHIPPING;

  return (
    <div className="cart-layout">
      <ul className="cart-list">
        {items.map(({ p, qty }) => (
          <li key={p.slug} className="cart-line">
            <div className="cart-thumb">
              <ProductArt p={p} />
            </div>
            <div className="cart-product">
              <Link href={`/products/${p.slug}`} className="cart-product-name">
                {p.name}
              </Link>
              <p className="cart-product-price">{money(p.price)}</p>
            </div>
            <div className="quantity-control cart-quantity">
              <button aria-label={`Decrease ${p.name} quantity`} onClick={() => setQty(p.slug, qty - 1)}>
                −
              </button>
              <span>{qty}</span>
              <button aria-label={`Increase ${p.name} quantity`} onClick={() => setQty(p.slug, qty + 1)}>
                +
              </button>
            </div>
            <p className="cart-line-total">{money(p.price * qty)}</p>
          </li>
        ))}
      </ul>

      <aside className="order-summary">
        <h2 className="summary-title">Order summary</h2>
        <form
          className="promo-form"
          onSubmit={(e) => {
            e.preventDefault();
            const c = code.trim().toUpperCase();
            setApplied(c in CODES ? c : null);
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo code"
            aria-label="Promo code"
            className="promo-input"
          />
          <button className="promo-button">Apply</button>
        </form>
        <p className="promo-note">
          {applied ? `✓ ${applied} applied` : "Try DEVSHIP or SUDO20"}
        </p>
        <Row label="Subtotal" value={money(total)} />
        {applied && <Row label="Discount" value={`−${money(discount)}`} />}
        <Row label="Shipping" value={shipping ? money(shipping) : "Free"} />
        <Row label="Total" value={money(sub + shipping)} bold />
        <p className="shipping-note">
          {shipping ? `Add ${money(FREE_SHIPPING - sub)} more for free shipping.` : "Your order ships free."}
        </p>
        {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
        <button
          type="button"
          disabled={checkingOut}
          onClick={async () => {
            setCheckingOut(true);
            setCheckoutError(null);
            try {
              const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lines, promoCode: applied }),
              });
              const result: unknown = await response.json();
              if (!response.ok || !result || typeof result !== "object" || !("url" in result) || typeof result.url !== "string") {
                const message =
                  result && typeof result === "object" && "error" in result && typeof result.error === "string"
                    ? result.error
                    : "Could not start checkout. Please try again.";
                throw new Error(message);
              }
              window.location.assign(result.url);
            } catch (error) {
              setCheckoutError(error instanceof Error ? error.message : "Could not start checkout. Please try again.");
              setCheckingOut(false);
            }
          }}
          className="button-primary checkout-button"
        >
          {checkingOut ? "Opening secure checkout…" : "Continue to checkout"}
        </button>
      </aside>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`summary-row ${bold ? "summary-total" : ""}`}>
      <span>{label}</span>
      {bold ? <strong>{value}</strong> : <span>{value}</span>}
    </div>
  );
}
