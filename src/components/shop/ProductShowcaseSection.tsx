"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";

type ProductShowcaseSectionProps = {
  title: string;
  description: string;
  products: Product[];
  loading: boolean;
  showComingSoon?: boolean;
};

export function ProductShowcaseSection({
  title,
  description,
  products,
  loading,
  showComingSoon = false,
}: ProductShowcaseSectionProps) {
  if (loading) {
    return (
      <section className="w-full px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">{title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600">{description}</p>
          </div>
          <ProductGridSkeleton
            items={4}
            gridClassName="grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4"
          />
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="w-full px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-600">{description}</p>
        </div>

        <ProductGrid
          products={products}
          showComingSoon={showComingSoon}
          gridClassName="grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4"
          animated
        />

        <div className="mt-8 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-zinc-900 px-8 text-zinc-900 hover:bg-zinc-900 hover:text-white"
          >
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
