"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Category, Product } from "@/types/product";
import { ProductGrid } from "./ProductGrid";

import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/utils";

import { getAllProducts } from "@/lib/api/product";
import { getAllCategories } from "@/lib/api/category";

type Tab = { id: string; label: string };

export default function ProductOverview() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs: Tab[] = useMemo(() => {
    const activeCats = categories.filter((c) => c.isActive);
    return [{ id: "all", label: "All Products" }].concat(
      activeCats.map((c) => ({
        id: c.slug,
        label: c.name,
      })),
    );
  }, [categories]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [cats, productData] = await Promise.all([
        getAllCategories(),
        getAllProducts({ page: 0, size: 4, sortBy: "id", direction: "DESC" }),
      ]);

      setCategories(cats);
      setProducts(
        (productData.products ?? []).filter(
          (product) => product.status !== "COMING_SOON",
        ),
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load products";
      setError(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Filter by tab (slug)
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return products;
    return products.filter(
      (p) => (p.category?.slug ?? "").toLowerCase() === activeTab.toLowerCase(),
    );
  }, [activeTab, products]);

  // Loading UI
  if (loading) {
    return (
      <div className="container-app">
        <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-zinc-600">Loading products...</p>
          </div>
        </section>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="container-app">
        <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-zinc-900 mb-3">
              Product Overview
            </h2>
            <p className="text-zinc-600 mb-6">{error}</p>
            <Button onClick={loadData}>Refresh</Button>
          </div>
        </section>
      </div>
    );
  }

  // Empty UI
  if (products.length === 0) {
    return (
      <div className="container-app">
        <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Product Overview
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto mb-8">
              No products available yet. Check back soon!
            </p>
            <Button onClick={loadData}>Refresh</Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container-app">
      <section className="w-full  py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={fadeUpItem} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Product Overview
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Discover our curated collection of premium products designed for
                style and comfort
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              variants={fadeUpItem}
              className="flex justify-center mb-10"
            >
              <div className="relative inline-flex flex-wrap justify-center gap-2 p-1.5 bg-zinc-100 rounded-full">
                {tabs.map((tab) => {
                  const active = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={[
                        "relative px-5 py-2.5 text-sm font-medium rounded-full transition-colors",
                        active
                          ? "text-white"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200",
                      ].join(" ")}
                    >
                      {active && (
                        <motion.span
                          layoutId="product-tabs-pill"
                          className="absolute inset-0 rounded-full bg-zinc-900 shadow-lg"
                          transition={{
                            type: "spring",
                            stiffness: 240,
                            damping: 24,
                            mass: 1.1,
                          }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <motion.div variants={fadeUpItem} className="text-center py-12">
                <p className="text-zinc-600">
                  No products found in this category.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductGrid
                    products={filteredProducts}
                    gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4"
                    animated
                  />
                </motion.div>
              </AnimatePresence>
            )}

            <motion.div variants={fadeUpItem} className="text-center mt-10">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
              >
                <Link href="/shop">View All Products</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
