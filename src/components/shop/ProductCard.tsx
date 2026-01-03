"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QuickViewDialog } from "@/components/shop/QuickViewDialog";

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
      <div className="relative bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-lg transition">
        {/* Image */}
        <div className="relative aspect-3/4 bg-zinc-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />

          {/* Wishlist */}
          <button
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition"
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isInWishlist ? "fill-red-500 text-red-500" : "text-zinc-400"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-zinc-900 hover:text-zinc-600 line-clamp-1">
              {product.name}
            </h3>
          </Link>

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
