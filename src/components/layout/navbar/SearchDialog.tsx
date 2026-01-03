"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const POPULAR_SEARCHES = [
  "Shoes",
  "T-Shirts",
  "Watches",
  "Bags",
  "Sunglasses",
  "Jackets",
];

export function SearchDialog({ trigger }: { trigger: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(query)}`);
    setQuery("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search products</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full h-12 px-4 rounded-xl border focus:outline-none focus:ring-2"
            autoFocus
          />

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Popular searches
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    router.push(`/shop?search=${encodeURIComponent(term)}`);
                    setOpen(false);
                  }}
                  className="px-3 py-2 rounded-full border text-sm hover:bg-muted"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: "New Arrivals", href: "/shop?filter=new" },
              { name: "Best Sellers", href: "/shop?filter=best" },
              { name: "On Sale", href: "/shop?filter=sale" },
              { name: "All Products", href: "/shop" },
            ].map((l) => (
              <Link
                key={l.name}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-xl border text-sm text-center hover:bg-muted"
              >
                {l.name}
              </Link>
            ))}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
