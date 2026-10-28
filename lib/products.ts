export type Category = "Keychains" | "Stickers";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: Category;
  emoji: string;
  image?: string;
  from: string;
  to: string;
  rating: number;
  featured?: boolean;
  specs: string[];
};

export const categories: Category[] = ["Keychains", "Stickers"];

const sticker = (
  slug: string,
  name: string,
  tagline: string,
  description: string,
  rating: number,
  from: string,
  to: string,
): Product => ({
  slug,
  name,
  tagline,
  description,
  price: 8,
  category: "Stickers",
  emoji: "🏷️",
  image: `/products/${slug}.webp`,
  from,
  to,
  rating,
  specs: ["Waterproof vinyl", "Die-cut", "Laptop safe"],
});

const keychain = (
  slug: string,
  tech: string,
  rating: number,
  from: string,
  to: string,
  featured = false,
): Product => ({
  slug: `${slug}-keychain`,
  name: `${tech} Keychain`,
  tagline: `Carry your ${tech} stack everywhere.`,
  description: `A durable acrylic ${tech} keychain for your keys, backpack, or laptop bag. Fan-made, unofficial merch.`,
  price: 10,
  category: "Keychains",
  emoji: "🔑",
  image: `/products/${slug}-keychain.webp`,
  from,
  to,
  rating,
  featured,
  specs: ["Double-sided print", "Acrylic with metal ring", "Approx. 5 cm"],
});

export const products: Product[] = [
  keychain("nodejs", "Node.js", 4.7, "#16a34a", "#14532d", true),
  keychain("react", "React", 4.8, "#38bdf8", "#1e3a8a",true),
  keychain("docker", "Docker", 4.6, "#0ea5e9", "#1d4ed8"),
  keychain("java", "Java", 4.4, "#f97316", "#b91c1c"),
  keychain("mysql", "MySQL", 4.3, "#0284c7", "#f59e0b"),
  keychain("laravel", "Laravel", 4.5, "#ef4444", "#7f1d1d"),
  keychain("gitlab", "GitLab", 4.5, "#fb923c", "#7c2d12", true),
  keychain("typescript", "TypeScript", 4.7, "#3b82f6", "#1e3a8a", true),
  sticker(
    "sticker-pack-logos",
    "Tech Logo Sticker Pack",
    "Your whole stack on one sheet.",
    "A pack of die-cut vinyl stickers featuring popular languages and tools. Fan-made, unofficial merch.",
    4.8,
    "#f472b6",
    "#8b5cf6",
  ),
  sticker(
    "sticker-pack-lifestyle",
    "Developer Life Sticker Pack",
    "Fun and relatable, like your commit history.",
    "Playful stickers capturing everyday developer life, from late-night debugging to coffee refills.",
    4.6,
    "#facc15",
    "#f97316",
  ),
  sticker(
    "sticker-pack-quotes",
    "Programming Quotes Sticker Pack",
    "Funny one-liners every dev gets.",
    "A pack of stickers with funny, relatable programming quotes for your laptop, bottle or notebook.",
    4.7,
    "#10b981",
    "#065f46",
  ),
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
