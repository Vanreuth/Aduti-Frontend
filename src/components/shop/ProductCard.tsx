"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { Product } from "./types";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-3/4 overflow-hidden bg-zinc-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
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
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          } hover:scale-110`}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-zinc-400 hover:text-red-500"
            }`}
          />
        </button>

        {/* Quick Actions */}
        <div
          className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-500 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
          <StarRating rating={product.rating} />
          <span className="text-xs text-zinc-500">({product.reviews})</span>
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
  );
}
