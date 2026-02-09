"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "./ProductGrid";

export function ShopLoading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="hidden sm:flex items-start justify-between gap-4 mb-4">
            <div>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-36 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-11 w-full sm:w-[440px] rounded-xl" />
              <Skeleton className="hidden sm:block h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="sm:hidden h-4 w-24" />
              <Skeleton className="h-11 w-36 rounded-xl" />
              <Skeleton className="h-11 w-20 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
              <Skeleton className="h-5 w-24 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <Skeleton className="h-px w-full my-6" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </aside>

          <div className="flex-1">
            <ProductGridSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
