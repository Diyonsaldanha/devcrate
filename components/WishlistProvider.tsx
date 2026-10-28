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

type WishlistCtx = {
  slugs: string[];
  ready: boolean;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

const Ctx = createContext<WishlistCtx | null>(null);
const KEY = "devcrate-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) {
        // localStorage is only readable after mount, so hydrate the list here
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSlugs(saved.filter((s): s is string => typeof s === "string" && !!getProduct(s)));
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(slugs));
  }, [slugs, ready]);

  const toggle = useCallback(
    (slug: string) =>
      setSlugs((l) => (l.includes(slug) ? l.filter((s) => s !== slug) : [...l, slug])),
    [],
  );

  const value = useMemo<WishlistCtx>(
    () => ({ slugs, ready, has: (slug) => slugs.includes(slug), toggle }),
    [slugs, ready, toggle],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}
