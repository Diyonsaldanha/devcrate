import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import { WishlistProvider } from "@/components/WishlistProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevCrate · Gear for developers",
  description: "Developer-themed keychains for your keys, bag and laptop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="site-footer">
              <div className="footer-inner">
                <div className="footer-brand">
                  <span className="footer-logo">Devcrate</span>
                  <p>Developer-themed keychains for your keys, bag and laptop.</p>
                </div>
                <nav className="footer-links" aria-label="Footer navigation">
                  <Link href="/">Home</Link>
                  <Link href="/products">Shop</Link>
                  <Link href="/wishlist">Wishlist</Link>
                  <Link href="/cart">Cart</Link>
                </nav>
              </div>
            </footer>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
