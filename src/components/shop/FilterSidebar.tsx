"use client";
import { Button } from "@/components/ui/button";
import { categories, priceRanges } from "./data";

interface FilterSidebarProps {
  category: string;
  priceRange: number;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (index: number) => void;
  onReset: () => void;
}

export function FilterSidebar({
  category,
  priceRange,
  onCategoryChange,
  onPriceRangeChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-zinc-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                category === cat
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-zinc-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <button
              key={range.label}
              onClick={() => onPriceRangeChange(index)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                priceRange === index
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <Button variant="outline" className="w-full" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}
