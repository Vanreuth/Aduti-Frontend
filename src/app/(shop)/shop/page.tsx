"use client";
import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ProductCard,
  FilterSidebar,
  SearchHeader,
  EmptyState,
  priceRanges,
} from "@/components/shop";
import { getAllProducts } from "@/lib/firebase/products";
import { Product } from "@/types/product";

import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/utils";

function SearchContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const filterParam = searchParams.get("filter") || "";

  // Firebase state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive initial sort from URL param
  const initialSortBy = useMemo(() => {
    if (filterParam === "new") return "newest";
    if (filterParam === "sale") return "sale";
    if (filterParam === "best") return "rating";
    return "featured";
  }, [filterParam]);

  // Local state
  const [localQuery, setLocalQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Fetch products from Firebase on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await getAllProducts();
      setAllProducts(products);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Combine URL search with local query
  const activeQuery = localQuery || searchQuery;

  // Filter products
  let filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(activeQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(activeQuery.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category.toLowerCase() === category.toLowerCase();

    const matchesPrice =
      product.price >= priceRanges[priceRange].min &&
      product.price <= priceRanges[priceRange].max;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating
    );
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts]
      .filter((p) => p.isNew)
      .concat(filteredProducts.filter((p) => !p.isNew));
  } else if (sortBy === "sale") {
    filteredProducts = [...filteredProducts]
      .filter((p) => p.isSale)
      .concat(filteredProducts.filter((p) => !p.isSale));
  }

  const toggleWishlist = (id: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) newWishlist.delete(id);
    else newWishlist.add(id);
    setWishlist(newWishlist);
  };

  const handleReset = () => {
    setCategory("All");
    setPriceRange(0);
    setSortBy("featured");
  };

  const handleClearAll = () => {
    setLocalQuery("");
    setCategory("All");
    setPriceRange(0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    );
  }

  // ✅ key to animate grid when filters change
  const gridKey = `${activeQuery}|${category}|${priceRange}|${sortBy}|${filteredProducts.length}`;

  return (
    <motion.div
      className="min-h-screen bg-zinc-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header (animated in) */}
      <motion.div variants={fadeUpItem} initial="hidden" animate="show">
        <SearchHeader
          query={activeQuery}
          sortBy={sortBy}
          resultsCount={filteredProducts.length}
          onQueryChange={setLocalQuery}
          onSortChange={setSortBy}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <motion.div
              variants={fadeUpItem}
              initial="hidden"
              animate="show"
              className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="font-bold text-lg text-zinc-900 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              <FilterSidebar
                category={category}
                priceRange={priceRange}
                onCategoryChange={setCategory}
                onPriceRangeChange={setPriceRange}
                onReset={handleReset}
              />
            </motion.div>
          </aside>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                  mass: 1.1,
                }}
                className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
              >
                <Button
                  variant="outline"
                  className="shadow-lg rounded-full px-6 bg-white/90 backdrop-blur"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </motion.div>
            </SheetTrigger>

            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar
                  category={category}
                  priceRange={priceRange}
                  onCategoryChange={setCategory}
                  onPriceRangeChange={setPriceRange}
                  onReset={handleReset}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Products Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <EmptyState onClearFilters={handleClearAll} />
                </motion.div>
              ) : (
                <motion.div
                  key={gridKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {filteredProducts.map((product) => (
                      <motion.div key={product.id} variants={fadeUpItem}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
