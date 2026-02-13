"use client";

import { ChevronDown } from "lucide-react";
import type { PriceRange } from "./types";
import { priceRanges as defaultPriceRanges } from "./priceRanges";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type CategoryOption = { label: string; value: string };

const fallbackBrandOptions = [
  "Fashionista",
  "TimeMaster",
  "ActivePro",
  "UrbanChic",
  "ColdGear",
  "EliteWear",
];
const tagOptions = ["Product", "Bags", "Shoes", "Fashion", "Clothing", "Shirts", "Accessories"];

const fallbackSwatches: Array<{ label: string; hex: string }> = [
  { label: "Black", hex: "#111827" },
  { label: "Navy", hex: "#1e3a8a" },
  { label: "Orange", hex: "#f59e0b" },
  { label: "Gray", hex: "#6b7280" },
  { label: "Pink", hex: "#f9a8d4" },
  { label: "Red", hex: "#ef4444" },
  { label: "White", hex: "#ffffff" },
];

function colorToHex(name: string) {
  const key = name.trim().toLowerCase();
  const map: Record<string, string> = {
    black: "#111827",
    white: "#ffffff",
    red: "#ef4444",
    blue: "#3b82f6",
    navy: "#1e3a8a",
    green: "#22c55e",
    yellow: "#f59e0b",
    orange: "#f97316",
    pink: "#ec4899",
    purple: "#8b5cf6",
    gray: "#6b7280",
    grey: "#6b7280",
    brown: "#92400e",
    beige: "#d6d3d1",
    cream: "#f5f5dc",
  };

  return map[key] ?? "#a1a1aa";
}

export function FilterSidebar({
  categories,
  categorySlug,
  brandOptions,
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
  brandOptions?: string[];
  sizeOptions?: CategoryOption[];
  sizeValue?: string;
  colorOptions?: CategoryOption[];
  colorValue?: string;
  priceRange: number;
  priceRanges?: readonly PriceRange[];
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

  const displaySizes = [{ label: "All", value: "all" }].concat(
    showSizes
      ? (sizeOptions ?? []).filter((option) => option.value !== "all")
      : [
          { label: "XS", value: "XS" },
          { label: "S", value: "S" },
          { label: "M", value: "M" },
          { label: "L", value: "L" },
          { label: "XL", value: "XL" },
          { label: "2XL", value: "2XL" },
        ],
  );

  const displayColors = showColors
    ? [{ label: "All", value: "all" }]
        .concat((colorOptions ?? []).filter((option) => option.value !== "all"))
        .map((option) => ({
          label: option.label,
          value: option.value,
          hex: option.value === "all" ? "#ffffff" : colorToHex(option.value),
        }))
    : [{ label: "All", value: "all", hex: "#ffffff" }].concat(
        fallbackSwatches.map((item) => ({
          ...item,
          value: item.label,
        })),
      );
  const displayBrands =
    brandOptions && brandOptions.length > 0 ? brandOptions : fallbackBrandOptions;

  return (
    <div className="space-y-6 text-sm">
      {/* Category */}
      {showCategories ? (
        <>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-900">
                Categories
              </h3>
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="space-y-1">
              {categories.map((c) => {
                const active = c.value === categorySlug;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onCategoryChange?.(c.value)}
                    aria-pressed={active}
                    className={[
                      "block w-full rounded-md px-2 py-1 text-left text-xs transition",
                      active
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
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
      <>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-900">
              Size
            </h3>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {displaySizes.map((option) => {
              const active = sizeValue === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onSizeChange?.(active && option.value !== "all" ? "all" : option.value)
                  }
                  className={[
                    "h-8 rounded border text-xs font-medium transition",
                    active
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">
              Selected:{" "}
              <span className="font-medium text-zinc-800">
                {displaySizes.find((option) => option.value === sizeValue)?.label ?? "All"}
              </span>
            </span>
            {sizeValue !== "all" ? (
              <button
                type="button"
                onClick={() => onSizeChange?.("all")}
                className="font-medium text-zinc-600 underline-offset-2 hover:underline"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
        <Separator />
      </>

      {/* Color */}
      <>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-900">
              Colors
            </h3>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {displayColors.map((option) => {
              const active = colorValue === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onColorChange?.(active && option.value !== "all" ? "all" : option.value)
                  }
                  aria-label={option.label}
                  className={[
                    "h-5 w-5 rounded-full border transition",
                    active ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-300",
                  ].join(" ")}
                  style={
                    option.value === "all"
                      ? {
                          background:
                            "radial-gradient(circle at center, #fff 0%, #fff 40%, #e4e4e7 40%, #e4e4e7 100%)",
                        }
                      : { backgroundColor: option.hex }
                  }
                />
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">
              Selected:{" "}
              <span className="font-medium text-zinc-800">
                {displayColors.find((option) => option.value === colorValue)?.label ?? "All"}
              </span>
            </span>
            {colorValue !== "all" ? (
              <button
                type="button"
                onClick={() => onColorChange?.("all")}
                className="font-medium text-zinc-600 underline-offset-2 hover:underline"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
        <Separator />
      </>

      {/* Branding */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-900">
          Branding
        </h3>
        <div className="space-y-1">
          {displayBrands.map((brand) => (
            <p key={brand} className="px-2 py-1 text-xs text-zinc-600">
              {brand}
            </p>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-900">
            Filter Price
          </h3>
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </div>
        <div className="space-y-1">
          {priceRanges.map((r, idx) => {
            const active = idx === priceRange;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => onPriceRangeChange(idx)}
                aria-pressed={active}
                className={[
                  "w-full rounded-md px-2 py-1 text-left text-xs transition",
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                ].join(" ")}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Tags */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-900">
            Tags
          </h3>
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded border border-zinc-300 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        className="h-9 w-full rounded-none border-zinc-300 text-xs font-semibold tracking-wide"
        onClick={onReset}
      >
        Reset Filters
      </Button>
    </div>
  );
}
