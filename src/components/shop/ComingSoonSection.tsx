"use client";

import { Product } from "@/types/product";
import { ProductShowcaseSection } from "./ProductShowcaseSection";

type ComingSoonSectionProps = {
  products: Product[];
  loading: boolean;
};

export function ComingSoonSection({
  products,
  loading,
}: ComingSoonSectionProps) {
  return (
    <ProductShowcaseSection
      title="Coming Soon"
      description="Preview products that are launching soon with live countdown."
      products={products}
      loading={loading}
      showComingSoon
    />
  );
}
