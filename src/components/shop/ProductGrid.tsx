"use client";

import type { ReactNode } from "react";
import type { Product } from "@/types/api";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, fadeUpItem, staggerContainer } from "@/lib/utils";

type ProductGridProps = {
  products: Product[];
  isLoading?: boolean;
  isUpdating?: boolean;
  emptyState?: ReactNode;
  gridClassName?: string;
  animated?: boolean;
  animationKey?: string;
};

export function ProductGrid({
  products,
  isLoading,
  isUpdating,
  emptyState,
  gridClassName,
  animated = true,
  animationKey,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton gridClassName={gridClassName} />;
  }

  if (!products.length) {
    if (isUpdating) {
      return <ProductGridSkeleton gridClassName={gridClassName} />;
    }
    return emptyState ? (
      <>{emptyState}</>
    ) : (
      <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center text-sm text-zinc-600">
        No products found.
      </div>
    );
  }

  const GridWrapper = animated ? motion.div : "div";
  const gridProps = animated
    ? { variants: staggerContainer, initial: "hidden", animate: "show" }
    : {};

  return (
    <div className="space-y-4">
      {isUpdating ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          Updating results...
        </div>
      ) : null}
      <GridWrapper
        key={animationKey}
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",
          gridClassName,
        )}
        {...gridProps}
      >
        {products.map((product) =>
          animated ? (
            <motion.div key={product.id} variants={fadeUpItem}>
              <ProductCard product={product} />
            </motion.div>
          ) : (
            <ProductCard key={product.id} product={product} />
          ),
        )}
      </GridWrapper>
    </div>
  );
}

export function ProductGridSkeleton({
  items = 9,
  gridClassName,
}: {
  items?: number;
  gridClassName?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",
        gridClassName,
      )}
    >
      {Array.from({ length: items }, (_, i) => `skeleton-${i}`).map((id) => (
        <div
          key={id}
          className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm"
        >
          <Skeleton className="aspect-3/4 w-full rounded-xl" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
