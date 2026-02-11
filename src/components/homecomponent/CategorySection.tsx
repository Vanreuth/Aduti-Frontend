"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/utils";
import { getAllCategories } from "@/lib/api/category";

type CategoryCard = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  slug: string;
  cta: string;
  productCount: number | null;
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1552337480-48918be048b9?w=1200&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=1200&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1200&fit=crop",
];

const fallbackCategories: CategoryCard[] = [
  {
    id: 1,
    title: "Women",
    subtitle: "Discover curated seasonal styles",
    image: fallbackImages[0],
    slug: "women",
    cta: "Shop now",
    productCount: null,
  },
  {
    id: 2,
    title: "Men",
    subtitle: "Elevated essentials for every day",
    image: fallbackImages[1],
    slug: "men",
    cta: "Shop now",
    productCount: null,
  },
  {
    id: 3,
    title: "Accessories",
    subtitle: "Finish your look with standout pieces",
    image: fallbackImages[2],
    slug: "accessories",
    cta: "Explore",
    productCount: null,
  },
];

const CategorySection = () => {
  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllCategories();
      const active = data.filter((category) => category.isActive);

      if (active.length === 0) {
        setCategories(fallbackCategories);
        setError("No active categories from API. Showing curated categories.");
        return;
      }

      const mapped: CategoryCard[] = active.slice(0, 6).map((category, index) => {
        const count = category.productCount ?? 0;
        return {
          id: category.id,
          title: category.name,
          subtitle:
            category.description?.trim() ||
            `${count} ${count === 1 ? "product" : "products"}`,
          image: fallbackImages[index % fallbackImages.length],
          slug: category.slug,
          cta: "Shop now",
          productCount: category.productCount,
        };
      });

      setCategories(mapped);
    } catch {
      setCategories(fallbackCategories);
      setError("Failed to load categories from API. Showing fallback categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return (
    <section className="container-app">
      <div className="w-full bg-gradient-to-b from-white via-zinc-50/60 to-zinc-100/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Shop by category
              </h3>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {error ? (
            <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => void loadCategories()}
                  className="font-semibold underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`category-skeleton-${index}`}
                  className="h-80 animate-pulse rounded-2xl bg-zinc-200"
                />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {categories.map((category) => (
                <motion.div key={category.id} variants={fadeUpItem}>
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    variants={{ rest: {}, hover: {} }}
                    className="group relative h-80 overflow-hidden rounded-2xl shadow-xl"
                  >
                    <Link
                      href={`/shop?category=${encodeURIComponent(category.slug)}`}
                      className="relative block h-full"
                    >
                      <motion.div
                        className="absolute inset-0"
                        variants={{
                          rest: { scale: 1 },
                          hover: { scale: 1.12 },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 18,
                          mass: 1.1,
                        }}
                      >
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={category.id === categories[0]?.id}
                        />
                      </motion.div>

                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10"
                        variants={{
                          rest: { opacity: 1 },
                          hover: { opacity: 0.92 },
                        }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />

                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        variants={{
                          rest: {
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
                          },
                          hover: {
                            boxShadow:
                              "inset 0 0 0 2px rgba(255,255,255,0.45), 0 20px 40px rgba(0,0,0,0.24)",
                          },
                        }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />

                      <div className="relative flex h-full flex-col justify-between p-7">
                        <div className="flex justify-end">
                          {typeof category.productCount === "number" ? (
                            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900">
                              {category.productCount} items
                            </span>
                          ) : null}
                        </div>

                        <div>
                          <motion.div
                            variants={{
                              rest: { y: 0 },
                              hover: { y: -8 },
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 160,
                              damping: 20,
                              mass: 1,
                            }}
                          >
                            <h3 className="text-3xl font-bold text-white">
                              {category.title}
                            </h3>
                            <p className="mt-2 max-w-xs text-sm text-white/90">
                              {category.subtitle}
                            </p>
                          </motion.div>

                          <motion.span
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-900"
                            variants={{
                              rest: { opacity: 0, y: 16 },
                              hover: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {category.cta}
                            <motion.span
                              variants={{
                                rest: { x: 0 },
                                hover: { x: 5 },
                              }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.span>
                          </motion.span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
