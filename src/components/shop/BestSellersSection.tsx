"use client";

import { Product } from "@/types/product";
import { ProductShowcaseSection } from "./ProductShowcaseSection";

type BestSellersSectionProps = {
  products: Product[];
  loading: boolean;
};

export function BestSellersSection({
  products,
  loading,
}: BestSellersSectionProps) {
  return (
    <ProductShowcaseSection
      title="Best Sellers"
      description="Our most loved products chosen by customers."
      products={products}
      loading={loading}
    />
  );
}
