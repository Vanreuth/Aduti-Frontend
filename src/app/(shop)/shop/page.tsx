"use client";
import { useState, useMemo, Suspense } from "react";
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
  allProducts,
  priceRanges,
} from "@/components/shop";

function SearchContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const filterParam = searchParams.get("filter") || "";

  // Derive initial sort from URL param
  const initialSortBy = useMemo(() => {
    if (filterParam === "new") return "newest";
    if (filterParam === "sale") return "sale";
    if (filterParam === "best") return "rating";
    return "featured";
  }, [filterParam]);

  // Use URL searchQuery directly for filtering, local query for input display
  const [localQuery, setLocalQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  // Combine URL search with local query - prioritize local if user is typing
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

  const toggleWishlist = (id: number) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
    } else {
      newWishlist.add(id);
    }
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

  return (
    <div className="min-h-screen bg-zinc-50">
      <SearchHeader
        query={activeQuery}
        sortBy={sortBy}
        resultsCount={filteredProducts.length}
        onQueryChange={setLocalQuery}
        onSortChange={setSortBy}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm">
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
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 shadow-lg rounded-full px-6"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
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
            {filteredProducts.length === 0 ? (
              <EmptyState onClearFilters={handleClearAll} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.has(product.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
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
