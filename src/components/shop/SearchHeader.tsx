"use client";

import type { ReactNode } from "react";
import { ChevronRight, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortBy = "featured" | "price-low" | "price-high";

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
    <div className="border-b border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 bg-zinc-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-7">
          <h1 className="text-2xl font-semibold text-zinc-900 sm:text-[26px]">{title}</h1>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span>Home</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-700">Shop</span>
          </div>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:py-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-none sm:max-w-[360px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search..."
                className="h-10 rounded-none border-zinc-300 bg-white pl-9 pr-9 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {query ? (
                <button
                  type="button"
                  onClick={onClear}
                  className="absolute right-1.5 top-1/2 rounded p-1.5 -translate-y-1/2 hover:bg-zinc-100"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5 text-zinc-600" />
                </button>
              ) : null}
            </div>

            <p className="text-xs text-zinc-600">{resultsText}</p>
            {isUpdating ? (
              <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800" />
                Updating
              </span>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-2 text-xs sm:w-auto sm:flex-row sm:items-center">
            <span className="text-zinc-500">Sort by:</span>
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortBy)}>
              <SelectTrigger className="h-10 w-full rounded-none border-zinc-300 text-left text-sm sm:min-w-[210px] sm:w-auto">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasFilters ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter.id}
                variant="outline"
                className="flex items-center gap-1 rounded-full border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700"
              >
                {filter.icon}
                <span className="truncate max-w-[170px]">{filter.label}</span>
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
              <button
                type="button"
                className="ml-1 text-xs font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
                onClick={onClearAll}
              >
                Clear all
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
