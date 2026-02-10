"use client";

import type { PriceRange } from "./types";
import { priceRanges as defaultPriceRanges } from "./priceRanges";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryOption = { label: string; value: string };

export function FilterSidebar({
  categories,
  categorySlug,
  sizeOptions,
  sizeValue,
  colorOptions,
  colorValue,
  priceRange,
  priceRanges = defaultPriceRanges,
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onPriceRangeChange,
  onReset,
}: {
  categories?: CategoryOption[];
  categorySlug?: string;
  sizeOptions?: CategoryOption[];
  sizeValue?: string;
  colorOptions?: CategoryOption[];
  colorValue?: string;
  priceRange: number;
  priceRanges?: PriceRange[];
  onCategoryChange?: (slug: string) => void;
  onSizeChange?: (value: string) => void;
  onColorChange?: (value: string) => void;
  onPriceRangeChange: (index: number) => void;
  onReset: () => void;
}) {
  const showCategories = Array.isArray(categories) && categories.length > 0;
  const showSizes =
    (Array.isArray(sizeOptions) && sizeOptions.length > 1) ||
    (sizeValue && sizeValue !== "all");
  const showColors =
    (Array.isArray(colorOptions) && colorOptions.length > 1) ||
    (colorValue && colorValue !== "all");
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

      {/* Size */}
      {showSizes ? (
        <>
          <div>
            <Label className="text-sm font-medium text-zinc-900">Size</Label>
            <div className="mt-3">
              <Select
                value={sizeValue ?? "all"}
                onValueChange={(value) => onSizeChange?.(value)}
              >
                <SelectTrigger className="w-full rounded-xl border-zinc-200">
                  <SelectValue placeholder="All sizes" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
        </>
      ) : null}

      {/* Color */}
      {showColors ? (
        <>
          <div>
            <Label className="text-sm font-medium text-zinc-900">Color</Label>
            <div className="mt-3">
              <Select
                value={colorValue ?? "all"}
                onValueChange={(value) => onColorChange?.(value)}
              >
                <SelectTrigger className="w-full rounded-xl border-zinc-200">
                  <SelectValue placeholder="All colors" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
