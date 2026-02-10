"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatPrice(value: number) {
  return currencyFormatter.format(value);
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  const [quickOpen, setQuickOpen] = useState(false);

  const isInWishlist = has(String(product.id));
  const primaryImage = getPrimaryImage(product);
  const variants = product.variants ?? [];
  const sizes = getUniqueList(variants.map((v) => v.size));
  const colors = getUniqueList(variants.map((v) => v.color));

  const variantPrices = variants.length
    ? variants.map((v) => v.finalPrice ?? product.price)
    : [product.price];
  const minPrice = Math.min(...variantPrices);
  const maxPrice = Math.max(...variantPrices);
  const showPriceRange = minPrice !== maxPrice;
  const hasDiscount = product.price > 0 && minPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - minPrice) / product.price) * 100)
    : 0;

  const totalStock = variants.reduce((sum, variant) => {
    return sum + (variant.stockQuantity ?? 0);
  }, 0);
  const isInStock = variants.length
    ? variants.some((variant) => variant.isAvailable && variant.stockQuantity > 0)
    : product.isActive;
  const isSoldOut = variants.length > 0 && !isInStock;
  const isLowStock = variants.length > 0 && totalStock > 0 && totalStock <= 5;

  const handleAddToCart = () => {
    if (!isInStock) {
      toast.error("Out of stock", {
        description: "This item is currently unavailable",
      });
      return;
    }

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
      <Card className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-0 gap-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-zinc-900/10">
        {/* Clickable Image Area - Opens Quick View */}
        <div
          className="relative aspect-[4/3] bg-white cursor-pointer"
          onClick={() => setQuickOpen(true)}
        >
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
            {hasDiscount ? (
              <Badge className="border-rose-500 bg-rose-500 text-white shadow-sm font-semibold tracking-wide">
                Save {discountPercent}%
              </Badge>
            ) : null}
            {isSoldOut ? (
              <Badge className="border-zinc-900 bg-zinc-900 text-white shadow-sm font-semibold tracking-wide">
                Sold out
              </Badge>
            ) : isLowStock ? (
              <Badge className="border-amber-500 bg-amber-500 text-white shadow-sm font-semibold tracking-wide">
                Low stock
              </Badge>
            ) : null}
          </div>

          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="absolute top-3 right-3 z-10 rounded-full border border-zinc-200 bg-white/95 p-2 shadow-sm transition hover:scale-110 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleWishlist();
                }}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={isInWishlist}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isInWishlist ? "fill-red-500 text-red-500" : "text-zinc-400",
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Content */}
        <CardContent className="space-y-3 p-4">
          {/* Product name - also opens quick view */}
          <h3
            className="font-bold text-zinc-900 hover:text-zinc-600 line-clamp-1 cursor-pointer"
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
            <span className="text-xl font-extrabold text-zinc-900">
              {showPriceRange
                ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                : formatPrice(minPrice)}
            </span>
            {hasDiscount && !showPriceRange ? (
              <span className="text-sm text-zinc-400 line-through">
                {formatPrice(product.price)}
              </span>
            ) : null}
            {isInStock && !isLowStock ? (
              <span className="text-xs font-semibold text-emerald-700">
                In stock
              </span>
            ) : null}
          </div>

          {(sizes.length > 0 || colors.length > 0) && (
            <div className="space-y-2">
              {sizes.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-zinc-500">Sizes:</span>
                  {sizes.slice(0, 4).map((size) => (
                    <Badge
                      key={size}
                      variant="outline"
                      className="rounded-full border-zinc-200 bg-white text-zinc-700"
                    >
                      {size}
                    </Badge>
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
                    <Badge
                      key={color}
                      variant="outline"
                      className="rounded-full border-zinc-200 bg-white text-zinc-700"
                    >
                      {color}
                    </Badge>
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

        </CardContent>

        {/* Actions */}
        <CardFooter className="flex gap-2 border-t border-zinc-200 px-4 pb-4 pt-3">
          <Button
            size="lg"
            className="flex-1 rounded-full bg-zinc-900 text-white font-semibold shadow-sm hover:bg-zinc-800"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingCart className="h-4 w-4" />
            {isInStock ? "Add to Cart" : "Unavailable"}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                className="rounded-full border-2 border-zinc-300"
                onClick={() => setQuickOpen(true)}
                aria-label="Quick view"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              Quick view
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>

      {/* Quick View Dialog */}
      <QuickViewDialog
        open={quickOpen}
        onOpenChange={setQuickOpen}
        productId={String(product.id)}
      />
    </>
  );
}
