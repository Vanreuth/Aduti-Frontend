"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

import type { Category, Product, ProductListData } from "@/types/api";
import { getAllCategories } from "@/lib/api/category";
import { getAllProducts } from "@/lib/api/product";

import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUpItem } from "@/lib/utils";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const filterParam = searchParams.get("filter") || "";

  const clearSearch = () => {
    setLocalQuery("");
    if (searchQuery) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("search");
      const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
      router.push(newUrl);
    }
  };

  const initialSortBy = useMemo(() => {
    if (filterParam === "new") return "newest";
    if (filterParam === "sale") return "sale";
    if (filterParam === "best") return "rating";
    return "featured";
  }, [filterParam]);

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [pageData, setPageData] = useState<ProductListData>({
    products: [],
    pageNumber: 0,
    pageSize: 12,
    totalElements: 0,
    totalPages: 1,
    last: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI states
  const [localQuery, setLocalQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState(initialSortBy);

  // Fetch categories + products
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [cats, products] = await Promise.all([
          getAllCategories(),
          getAllProducts({ page: 0, size: 100 }), // load more for client filtering
        ]);

        if (!mounted) return;

        // Only active categories
        setCategories(cats.filter((c) => c.isActive));
        setPageData(products);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load shop data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const activeQuery = localQuery || searchQuery;

  // Map categories to FilterSidebar format (strings)
  // FilterSidebar in your code expects `category` string like "All" / "Shoes"
  const categoryNameFromSlug = useMemo(() => {
    if (selectedCategorySlug === "all") return "All";
    const found = categories.find((c) => c.slug === selectedCategorySlug);
    return found?.name ?? "All";
  }, [selectedCategorySlug, categories]);

  const allProducts: Product[] = pageData.products;

  // Filter + search
  let filteredProducts = allProducts.filter((p) => {
    const name = (p.name ?? "").toLowerCase();
    const catName = (p.category?.name ?? "").toLowerCase();
    const catSlug = (p.category?.slug ?? "").toLowerCase();

    const q = activeQuery.trim().toLowerCase();
    const matchesSearch = !q || name.includes(q) || catName.includes(q);

    const matchesCategory =
      selectedCategorySlug === "all" || catSlug === selectedCategorySlug.toLowerCase();

    const price = Number(p.price ?? 0);
    const matchesPrice =
      price >= priceRanges[priceRange].min &&
      price <= priceRanges[priceRange].max;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sorting
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }

  const handleReset = () => {
    setSelectedCategorySlug("all");
    setPriceRange(0);
    setSortBy("featured");
  };

  const handleClearAll = () => {
    setLocalQuery("");
    setSelectedCategorySlug("all");
    setPriceRange(0);
  };

  const gridKey = `${activeQuery}|${selectedCategorySlug}|${priceRange}|${sortBy}|${filteredProducts.length}`;

  // ✅ Hook FilterSidebar to backend categories
  // If your FilterSidebar ONLY supports fixed categories internally,
  // update it to accept `categories` prop.
  const categoryOptions = useMemo(() => {
    return ["All", ...categories.map((c) => c.name)];
  }, [categories]);

  // When FilterSidebar gives you name, convert to slug
  const onCategoryChangeByName = (name: string) => {
    if (name === "All") {
      setSelectedCategorySlug("all");
      return;
    }
    const found = categories.find((c) => c.name === name);
    setSelectedCategorySlug(found?.slug ?? "all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm max-w-md w-full">
          <p className="font-semibold text-zinc-900">Failed to load shop</p>
          <p className="text-sm text-zinc-600 mt-2">{error}</p>
          <Button className="mt-4 w-full" onClick={() => location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-zinc-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div variants={fadeUpItem} initial="hidden" animate="show">
        <SearchHeader
          query={activeQuery}
          sortBy={sortBy}
          resultsCount={filteredProducts.length}
          onQueryChange={setLocalQuery}
          onSortChange={setSortBy}
          onClear={clearSearch}
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
                category={categoryNameFromSlug}
                priceRange={priceRange}
                onCategoryChange={onCategoryChangeByName}
                onPriceRangeChange={setPriceRange}
                onReset={handleReset}
                // ✅ If your FilterSidebar supports it, pass options:
                // categories={categoryOptions}
              />
            </motion.div>
          </aside>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, mass: 1.1 }}
                className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
              >
                <Button variant="outline" className="shadow-lg rounded-full px-6 bg-white/90 backdrop-blur">
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
                  category={categoryNameFromSlug}
                  priceRange={priceRange}
                  onCategoryChange={onCategoryChangeByName}
                  onPriceRangeChange={setPriceRange}
                  onReset={handleReset}
                  // categories={categoryOptions}
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
