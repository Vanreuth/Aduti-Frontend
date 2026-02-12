"use client";

import { Product } from "@/types/product";
import { ProductShowcaseSection } from "./ProductShowcaseSection";

type FeaturedSectionProps = {
  products: Product[];
  loading: boolean;
};

export function FeaturedSection({ products, loading }: FeaturedSectionProps) {
  return (
    <ProductShowcaseSection
      title="Featured Products"
      description="Handpicked products we recommend right now."
      products={products}
      loading={loading}
    />
  );
}
