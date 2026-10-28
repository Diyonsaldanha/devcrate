"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "@/lib/products";

type Lines = Record<string, number>;

type CartCtx = {
  lines: Lines;
  count: number;
  total: number;
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "devcrate-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Lines>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Lines;
      // localStorage is only readable after mount, so hydrate the cart here
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLines(Object.fromEntries(Object.entries(saved).filter(([s]) => getProduct(s))));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback(
    (slug: string, qty = 1) => setLines((l) => ({ ...l, [slug]: Math.min(99, (l[slug] ?? 0) + qty) })),
    [],
  );

  const setQty = useCallback(
    (slug: string, qty: number) =>
      setLines((l) => {
        const next = { ...l };
        if (qty <= 0) delete next[slug];
        else next[slug] = Math.min(99, qty);
        return next;
      }),
    [],
  );

  const clear = useCallback(() => setLines({}), []);

  const value = useMemo<CartCtx>(() => {
    let count = 0;
    let total = 0;
    for (const [slug, qty] of Object.entries(lines)) {
      count += qty;
      total += (getProduct(slug)?.price ?? 0) * qty;
    }
    return { lines, count, total, ready, add, setQty, clear };
  }, [lines, ready, add, setQty, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
