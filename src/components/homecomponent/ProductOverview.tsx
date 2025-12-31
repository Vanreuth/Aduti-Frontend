"use client";
import { useState } from "react";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Esprit Ruffle Shirt",
    price: 16.64,
    originalPrice: 24.99,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    category: "women",
    rating: 4.5,
    reviews: 128,
    isSale: true,
  },
  {
    id: 2,
    name: "Herschel Supply Bag",
    price: 35.31,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
    category: "bag",
    rating: 4.8,
    reviews: 89,
    isNew: true,
  },
  {
    id: 3,
    name: "Only Check Trouser",
    price: 25.5,
    image:
      "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVufGVufDB8fDB8fHww",
    category: "men",
    rating: 4.3,
    reviews: 56,
  },
  {
    id: 4,
    name: "Classic Trench Coat",
    price: 75.0,
    originalPrice: 99.0,
    image:
      "https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tZW58ZW58MHx8MHx8fDA%3D",
    category: "women",
    rating: 4.7,
    reviews: 234,
    isSale: true,
  },
  {
    id: 5,
    name: "Urban Sneakers",
    price: 64.5,
    image:
      "https://images.unsplash.com/photo-1494291793534-6f053ee9c31a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VXJiYW4lMjBTbmVha2Vyc3xlbnwwfHwwfHx8MA%3D%3D",
    category: "shoes",
    rating: 4.9,
    reviews: 312,
    isNew: true,
  },
  {
    id: 6,
    name: "Designer Watch",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=500&fit=crop",
    category: "watches",
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 7,
    name: "Leather Handbag",
    price: 120.0,
    originalPrice: 150.0,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop",
    category: "bag",
    rating: 4.4,
    reviews: 95,
    isSale: true,
  },
  {
    id: 8,
    name: "Smart Watch Pro",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
    category: "watches",
    rating: 4.8,
    reviews: 267,
    isNew: true,
  },
];

const tabs = [
  { id: "all", label: "All Products" },
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "bag", label: "Bags" },
  { id: "shoes", label: "Shoes" },
  { id: "watches", label: "Watches" },
];

const ProductOverview = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter((p) => p.category === activeTab);

  const toggleWishlist = (id: number) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
    } else {
      newWishlist.add(id);
    }
    setWishlist(newWishlist);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : star - 0.5 <= rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "fill-zinc-200 text-zinc-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Product Overview
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Discover our curated collection of premium products designed for
            style and comfort
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-zinc-100 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-zinc-900 text-white shadow-lg"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-xl transition-all duration-500"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative aspect-3/4 overflow-hidden bg-zinc-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    hoveredProduct === product.id ? "scale-110" : "scale-100"
                  }`}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1 text-xs font-bold bg-emerald-500 text-white rounded-full">
                      NEW
                    </span>
                  )}
                  {product.isSale && (
                    <span className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                      SALE
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product.id);
                  }}
                  className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ${
                    hoveredProduct === product.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2"
                  } hover:scale-110`}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      wishlist.has(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-zinc-400 hover:text-red-500"
                    }`}
                  />
                </button>

                {/* Quick Actions */}
                <div
                  className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-500 ${
                    hoveredProduct === product.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <Button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-sm h-10">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white border-zinc-200 hover:bg-zinc-100"
                    asChild
                  >
                    <Link href={`/product/${product.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-zinc-900 mb-2 hover:text-zinc-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(product.rating)}
                  <span className="text-xs text-zinc-500">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-zinc-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-zinc-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
          >
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductOverview;
