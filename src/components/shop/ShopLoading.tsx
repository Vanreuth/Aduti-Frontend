"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "./ProductGrid";

export function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="border-b border-zinc-200 bg-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-7">
          <Skeleton className="mb-2 h-8 w-28" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-4 w-72" />
        </div>
      </div>

      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <Skeleton className="h-10 w-full max-w-[360px] rounded-none" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-48 rounded-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-9">
        <div className="flex gap-8 lg:gap-10">
          <aside className="hidden w-[250px] shrink-0 lg:block">
            <div className="border border-zinc-200 bg-white p-5">
              <Skeleton className="mb-5 h-4 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-9/12" />
              </div>
              <Skeleton className="my-5 h-px w-full" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
              <Skeleton className="my-5 h-px w-full" />
              <Skeleton className="h-9 w-full rounded-none" />
            </div>
          </aside>

          <div className="flex-1">
            <ProductGridSkeleton gridClassName="grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 lg:gap-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
