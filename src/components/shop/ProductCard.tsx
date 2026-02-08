"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QuickViewDialog } from "@/components/shop/QuickViewDialog";

const PLACEHOLDER_IMAGE = "/product/placeholder.svg";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  const [quickOpen, setQuickOpen] = useState(false);

  const isInWishlist = has(String(product.id));

  const handleAddToCart = () => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success("Added to cart 🛒", {
      description: "You can review it in your cart anytime",
    });
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      remove(String(product.id));
      toast("Removed from wishlist 💔", { description: "No longer saved" });
    } else {
      add({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
      });
      toast.success("Added to wishlist ❤️", { description: "Saved for later" });
    }
  };

  return (
    <>
      <div className="relative bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-lg transition group">
        {/* Clickable Image Area - Opens Quick View */}
        <div
          className="relative aspect-3/4 bg-zinc-100 cursor-pointer"
          onClick={() => setQuickOpen(true)}
        >
          <Image
            src={product.image || PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Quick View hint on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white/95 backdrop-blur-sm text-zinc-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Quick View
            </span>
          </div>

          {/* Wishlist - Stop propagation to prevent quick view */}
          <button
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist();
            }}
            aria-label="Wishlist"
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isInWishlist ? "fill-red-500 text-red-500" : "text-zinc-400",
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Product name - also opens quick view */}
          <h3
            className="font-semibold text-zinc-900 hover:text-zinc-600 line-clamp-1 cursor-pointer"
            onClick={() => setQuickOpen(true)}
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-zinc-500">({product.reviews})</span>
          </div>

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

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-10"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setQuickOpen(true)}
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      <QuickViewDialog
        open={quickOpen}
        onOpenChange={setQuickOpen}
        productId={String(product.id)}
      />
    </>
  );
}
