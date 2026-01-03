"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/firebase/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "../shop/ProductCard";

import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All Products" },
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "bag", label: "Bags" },
  { id: "shoes", label: "Shoes" },
  { id: "watches", label: "Watches" },
] as const;

export default function ProductOverview() {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["id"]>("all");

  // Firebase state~
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Contexts (single source of truth)
  const { addItem } = useCart();
  const { items: wishlistItems, add, remove } = useWishlist();

  // Fetch products
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter products by tab
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return products;
    return products.filter((p) => String(p.category) === String(activeTab));
  }, [activeTab, products]);

  // Add to cart (same pattern as your ProductCard)
  const handleAddToCart = (product: Product) => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success("Added to cart 🛒", {
      description: "You can review it in your cart anytime.",
    });
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlistItems.some(
      (i) => String(i.id) === String(product.id)
    );

    if (exists) {
      remove(String(product.id));
      toast("Removed from wishlist 💔", { description: "No longer saved." });
    } else {
      add({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
      });
      toast("Added to wishlist ❤️", { description: "Saved for later." });
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="container-app">
        <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Product Overview
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Discover our curated collection of premium products
              </p>
            </div>
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 mx-auto mb-4" />
                <p className="text-zinc-600">Loading products...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="container-app">
        <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchProducts}>Try Again</Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Empty
  if (products.length === 0) {
    return (
      <div className="container-app">
        <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Product Overview
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto mb-8">
                No products available yet. Check back soon!
              </p>
              <Button onClick={fetchProducts}>Refresh</Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container-app">
      <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Entrance for whole section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Header */}
            <motion.div variants={fadeUpItem} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Product Overview
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Discover our curated collection of premium products designed for
                style and comfort
              </p>
            </motion.div>

            {/* Category Tabs */}
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
                      {/* Animated pill */}
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

            {/* Products Grid */}
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
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {filteredProducts.map((product) => (
                      <motion.div key={product.id} variants={fadeUpItem}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* View All Button */}
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
