"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import React, { startTransition } from "react";

import { MobileMenuSheet } from "./navbar/MobileMenuSheet";
import { WishlistSheet } from "./navbar/WishlistSheet";
import { CartSheet } from "./navbar/CartSheet";
import { SearchDialog } from "./navbar/SearchDialog";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Features", href: "/feature" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const go = (href: string) => {
    if (href === pathname) return;

    startTransition(() => {
      router.push(href); // push normally
    });

    // ✅ Force top AFTER navigation starts (works even with persistent layouts)
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    });
    // Fallback for some browsers/layouts
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    }, 50);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur">
      <div className="max-w-7xl sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <MobileMenuSheet links={NAV_LINKS} />
          </Sheet>

          {/* Logo */}
          <button
            type="button"
            onClick={() => go("/")}
            className="flex items-center shrink-0"
            aria-label="Go to home"
          >
            <div className="relative h-16 w-16 sm:h-20 sm:w-20">
              <Image
                src="/Shop_Logo.png"
                alt="Aduti Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="relative flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;

                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => go(link.href)}
                    className={[
                      "relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors",
                      active
                        ? "text-white"
                        : "text-zinc-600 hover:text-zinc-900",
                    ].join(" ")}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-full bg-zinc-900 shadow"
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 26,
                          mass: 1,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <SearchDialog
              trigger={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
              }
            />
            <WishlistSheet />
            <CartSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}
