"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import {
  getBestSellers,
  getComingSoonProducts,
  getFeaturedProducts,
} from "@/lib/api/product";
import { BestSellersSection } from "./BestSellersSection";
import { FeaturedSection } from "./FeaturedSection";
import { ComingSoonSection } from "./ComingSoonSection";

type HomeSectionKey = "bestSellers" | "featured" | "comingSoon";

type HomeSectionState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

const INITIAL_STATE: Record<HomeSectionKey, HomeSectionState> = {
  bestSellers: { products: [], loading: true, error: null },
  featured: { products: [], loading: true, error: null },
  comingSoon: { products: [], loading: true, error: null },
};

export default function FeaturedProducts() {
  const [sections, setSections] =
    useState<Record<HomeSectionKey, HomeSectionState>>(INITIAL_STATE);

  useEffect(() => {
    let active = true;

    const loadHomeProducts = async () => {
      const [bestSellersResult, featuredResult, comingSoonResult] =
        await Promise.allSettled([
          getBestSellers(4),
          getFeaturedProducts(4),
          getComingSoonProducts(4),
        ]);

      if (!active) return;

      setSections({
        bestSellers:
          bestSellersResult.status === "fulfilled"
            ? {
                products: bestSellersResult.value.filter(
                  (product) => product.status !== "COMING_SOON",
                ),
                loading: false,
                error: null,
              }
            : {
                products: [],
                loading: false,
                error:
                  bestSellersResult.reason instanceof Error
                    ? bestSellersResult.reason.message
                    : "Failed to load best sellers",
              },
        featured:
          featuredResult.status === "fulfilled"
            ? {
                products: featuredResult.value.filter(
                  (product) => product.status !== "COMING_SOON",
                ),
                loading: false,
                error: null,
              }
            : {
                products: [],
                loading: false,
                error:
                  featuredResult.reason instanceof Error
                    ? featuredResult.reason.message
                    : "Failed to load featured products",
              },
        comingSoon:
          comingSoonResult.status === "fulfilled"
            ? {
                products: comingSoonResult.value.filter(
                  (product) => product.status === "COMING_SOON",
                ),
                loading: false,
                error: null,
              }
            : {
                products: [],
                loading: false,
                error:
                  comingSoonResult.reason instanceof Error
                    ? comingSoonResult.reason.message
                    : "Failed to load coming soon products",
              },
      });
    };

    loadHomeProducts();

    return () => {
      active = false;
    };
  }, []);

  const hasVisibleSection = Object.values(sections).some(
    (section) => section.loading || section.products.length > 0,
  );

  if (!hasVisibleSection) {
    return null;
  }

  return (
    <>
      <BestSellersSection
        products={sections.bestSellers.products}
        loading={sections.bestSellers.loading}
      />
      <ComingSoonSection
        products={sections.comingSoon.products}
        loading={sections.comingSoon.loading}
      />
       <FeaturedSection
        products={sections.featured.products}
        loading={sections.featured.loading}
      />
    </>
  );
}
