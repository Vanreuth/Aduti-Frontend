"use client";

import { Button } from "@/components/ui/button";

export function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-10 text-center shadow-sm">
      <p className="text-lg font-semibold text-zinc-900">No products found</p>
      <p className="text-sm text-zinc-600 mt-2">
        Try another search or clear filters to see more products.
      </p>
      <Button className="mt-6 rounded-xl" onClick={onClearFilters}>
        Clear all filters
      </Button>
    </div>
  );
}
