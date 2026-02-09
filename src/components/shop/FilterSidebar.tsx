"use client";

import type { PriceRange } from "./types";
import { priceRanges as defaultPriceRanges } from "./priceRanges";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type CategoryOption = { label: string; value: string };

export function FilterSidebar({
  categories,
  categorySlug,
  priceRange,
  priceRanges = defaultPriceRanges,
  onCategoryChange,
  onPriceRangeChange,
  onReset,
}: {
  categories?: CategoryOption[];
  categorySlug?: string;
  priceRange: number;
  priceRanges?: PriceRange[];
  onCategoryChange?: (slug: string) => void;
  onPriceRangeChange: (index: number) => void;
  onReset: () => void;
}) {
  const showCategories = Array.isArray(categories) && categories.length > 0;
  return (
    <div className="space-y-6">
      {/* Category */}
      {showCategories ? (
        <>
          <div>
            <Label className="text-sm font-medium text-zinc-900">Category</Label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {categories.map((c) => {
                const active = c.value === categorySlug;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onCategoryChange?.(c.value)}
                    aria-pressed={active}
                    className={[
                      "px-3 py-2 rounded-xl border text-sm transition",
                      active
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
                    ].join(" ")}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />
        </>
      ) : null}

      {/* Price */}
      <div>
        <Label className="text-sm font-medium text-zinc-900">Price</Label>
        <div className="mt-3 space-y-2">
          {priceRanges.map((r, idx) => {
            const active = idx === priceRange;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => onPriceRangeChange(idx)}
                aria-pressed={active}
                className={[
                  "w-full text-left px-3 py-2 rounded-xl border text-sm transition",
                  active
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
                ].join(" ")}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      <Button variant="outline" className="w-full rounded-xl" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  );
}
