"use client";
import React from "react";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const linkClass =
    "text-sm text-muted-foreground hover:text-foreground transition-colors";
  const sectionTitle =
    "text-sm font-semibold tracking-wide text-foreground/90 uppercase";

  return (
    <footer className="border-t bg-background">
      <div className="container-app py-6">
        {/* Top */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 ">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16">
                <Image
                  src="/Shop_Logo.png"
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
                +1 (234) 567-890
              </a>

              <a
                href="mailto:support@coza.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card">
                  <Mail className="h-4 w-4" />
                </span>
                support@coza.com
              </a>

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card mt-0.5">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>
                  123 Fashion Street
                  <br />
                  New York, NY 10001
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className={sectionTitle}>Shop</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/shop?filter=new" className={linkClass}>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=best" className={linkClass}>
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=sale" className={linkClass}>
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/shop" className={linkClass}>
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={sectionTitle}>Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className={linkClass}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className={linkClass}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className={linkClass}>
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={sectionTitle}>Newsletter</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Get special offers and new product updates.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
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

          <div className="flex items-center gap-4 text-xs">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
