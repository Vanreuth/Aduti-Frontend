"use client";
import React from "react";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ShieldCheck,
  Truck,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const quickShopLinks = [
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Best Sellers", href: "/shop?filter=best" },
    { label: "Top Rated", href: "/shop?filter=featured" },
    { label: "Price: Low to High", href: "/shop?filter=price-low" },
    { label: "Price: High to Low", href: "/shop?filter=price-high" },
    { label: "View All Products", href: "/shop" },
  ];

  const supportLinks = [
    { label: "Track Order", href: "/order" },
    { label: "Shipping Info", href: "/feature" },
    { label: "Returns & Refunds", href: "/feature" },
    { label: "Contact Support", href: "/contact" },
    { label: "FAQ", href: "/help" },
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
  ];

  const trustItems = [
    {
      icon: Truck,
      title: "Fast Delivery",
      subtitle: "2-5 business days",
    },
    {
      icon: RefreshCcw,
      title: "Easy Return",
      subtitle: "7-day return policy",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      subtitle: "Protected payment",
    },
  ];

  const linkClass =
    "text-sm text-muted-foreground hover:text-foreground transition-colors";
  const sectionTitle =
    "text-sm font-semibold tracking-wide text-foreground/90 uppercase";

  return (
    <footer className="border-t bg-background">
      <div className="container-app py-8">
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-white sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                Curated Collection
              </p>
              <h3 className="mt-1 text-xl font-semibold sm:text-2xl">
                Find your next favorite product faster
              </h3>
              <p className="mt-1 text-sm text-zinc-300">
                Explore trending pieces, best sellers, and smart price filters.
              </p>
            </div>
            <Link
              href="/shop?filter=best"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Shop Best Sellers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-20 w-20 sm:h-25 sm:w-25">
                <Image
                  src="/aditilogo.png"
                  alt="Aduti Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Aduti</p>
                <p className="text-xs text-muted-foreground">
                  Premium fashion store
                </p>
              </div>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-md">
              Premium fashion clothing for modern style enthusiasts. Discover
              quality and elegance in every piece.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-3">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card">
                  <Phone className="h-4 w-4" />
                </span>
                +855 883386255
              </a>

              <a
                href="mailto:support@coza.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card">
                  <Mail className="h-4 w-4" />
                </span>
                support@aditistore.com
              </a>

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card mt-0.5">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>
                  19F St. 214, Sangkat Boeung Kak 1, Khan Toul Kork
                  <br />
                  Phnom Penh, Cambodia
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className={sectionTitle}>Shop Products</h3>
            <ul className="mt-4 space-y-3">
              {quickShopLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className={sectionTitle}>Support</h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={sectionTitle}>Discover More</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Browse by popular searches to jump straight to what you want.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/shop?search=jacket"
                className="rounded-full border border-zinc-200 bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-zinc-300 hover:text-foreground"
              >
                Jackets
              </Link>
              <Link
                href="/shop?search=watch"
                className="rounded-full border border-zinc-200 bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-zinc-300 hover:text-foreground"
              >
                Watches
              </Link>
              <Link
                href="/shop?search=bag"
                className="rounded-full border border-zinc-200 bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-zinc-300 hover:text-foreground"
              >
                Bags
              </Link>
              <Link
                href="/shop?search=blazer"
                className="rounded-full border border-zinc-200 bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-zinc-300 hover:text-foreground"
              >
                Blazers
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 border-t pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Aduti Store. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              href="/feature"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
