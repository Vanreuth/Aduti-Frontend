"use client";

import type { ReactNode } from "react";
import { X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortBy = "featured" | "price-low" | "price-high" | "newest";

type FilterChip = {
  id: string;
  label: string;
  onRemove?: () => void;
  icon?: ReactNode;
};

export function SearchHeader({
  title = "Shop",
  subtitle = "Find pieces that match your style and budget.",
  query,
  sortBy,
  resultsCount,
  resultsLabel,
  filters = [],
  onClearAll,
  isUpdating = false,
  onQueryChange,
  onSortChange,
  onClear,
}: {
  title?: string;
  subtitle?: string;
  query: string;
  sortBy: SortBy;
  resultsCount: number;
  resultsLabel?: string;
  filters?: FilterChip[];
  onClearAll?: () => void;
  isUpdating?: boolean;
  onQueryChange: (v: string) => void;
  onSortChange: (v: SortBy) => void;
  onClear: () => void;
}) {
  const resultsText =
    resultsLabel ?? `${resultsCount} result${resultsCount === 1 ? "" : "s"}`;
  const hasFilters = filters.length > 0;

  return (
    <div className="border-b border-zinc-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="hidden sm:flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                Collection
              </p>
              <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
              {subtitle ? (
                <p className="text-sm text-zinc-600 mt-1">{subtitle}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {resultsText}
              </Badge>
              {isUpdating ? (
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 flex items-center gap-2 text-zinc-600"
                >
                  <span className="h-3 w-3 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
                  Updating
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-[440px]">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="Search products, brand, category..."
                  className="pl-9 pr-9 h-11 rounded-xl bg-white shadow-xs focus-visible:ring-2"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-zinc-100"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-zinc-700" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="sm:hidden text-sm text-zinc-600">
                {resultsText}
              </div>

              <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortBy)}>
                <SelectTrigger className="h-11 rounded-xl min-w-[180px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={onClear}
                disabled={!query}
              >
                Clear
              </Button>
            </div>
          </div>

          {hasFilters ? (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-3 py-2">
              {filters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant="outline"
                  className="rounded-full px-3 py-1 text-xs text-zinc-700 bg-white flex items-center gap-2"
                >
                  {filter.icon}
                  <span className="truncate max-w-[180px]">{filter.label}</span>
                  {filter.onRemove ? (
                    <button
                      type="button"
                      onClick={filter.onRemove}
                      className="rounded-full p-0.5 hover:bg-zinc-100"
                      aria-label={`Remove ${filter.label}`}
                    >
                      <X className="h-3 w-3 text-zinc-500" />
                    </button>
                  ) : null}
                </Badge>
              ))}
              {onClearAll ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-600"
                  onClick={onClearAll}
                >
                  Clear all
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
