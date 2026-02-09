"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product, ProductVariant, ProductImage } from "@/types/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QuickViewDialog } from "@/components/shop/QuickViewDialog";

const PLACEHOLDER_IMAGE = "/product/placeholder.svg";

interface ProductCardProps {
  product: Product;
}

function getVariantImages(variants?: ProductVariant[]): ProductImage[] {
  if (!variants?.length) return [];
  return variants.flatMap((variant) => variant.images ?? []);
}

function getPrimaryImage(product: Product) {
  const images = getVariantImages(product.variants);
  return images[0]?.imageUrl ?? PLACEHOLDER_IMAGE;
}

function getUniqueList(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  const [quickOpen, setQuickOpen] = useState(false);

  const isInWishlist = has(String(product.id));
  const primaryImage = getPrimaryImage(product);
  const sizes = getUniqueList(product.variants?.map((v) => v.size) ?? []);
  const colors = getUniqueList(product.variants?.map((v) => v.color) ?? []);

  const variantPrices = product.variants?.length
    ? product.variants.map((v) => v.finalPrice ?? product.price)
    : [product.price];
  const minPrice = Math.min(...variantPrices);
  const maxPrice = Math.max(...variantPrices);
  const showPriceRange = minPrice !== maxPrice;

  const handleAddToCart = () => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: minPrice,
      image: primaryImage,
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
        price: minPrice,
        image: primaryImage,
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
            src={primaryImage}
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

          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            {product.brand ? <span>{product.brand}</span> : null}
            {product.brand && product.category?.name ? (
              <span className="text-zinc-300">•</span>
            ) : null}
            {product.category?.name ? <span>{product.category.name}</span> : null}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-zinc-900">
              {showPriceRange
                ? `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`
                : `$${minPrice.toFixed(2)}`}
            </span>
          </div>

          {(sizes.length > 0 || colors.length > 0) && (
            <div className="space-y-2">
              {sizes.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-zinc-500">Sizes:</span>
                  {sizes.slice(0, 4).map((size) => (
                    <span
                      key={size}
                      className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 text-zinc-700"
                    >
                      {size}
                    </span>
                  ))}
                  {sizes.length > 4 ? (
                    <span className="text-xs text-zinc-500">
                      +{sizes.length - 4}
                    </span>
                  ) : null}
                </div>
              ) : null}
              {colors.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-zinc-500">Colors:</span>
                  {colors.slice(0, 4).map((color) => (
                    <span
                      key={color}
                      className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 text-zinc-700"
                    >
                      {color}
                    </span>
                  ))}
                  {colors.length > 4 ? (
                    <span className="text-xs text-zinc-500">
                      +{colors.length - 4}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}

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
