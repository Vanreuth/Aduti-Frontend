"use client";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <Search className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-zinc-900 mb-2">
        No products found
      </h3>
      <p className="text-zinc-600 mb-6">
        Try adjusting your search or filter to find what you&apos;re looking
        for.
      </p>
      <Button onClick={onClearFilters}>Clear All Filters</Button>
    </div>
  );
}
