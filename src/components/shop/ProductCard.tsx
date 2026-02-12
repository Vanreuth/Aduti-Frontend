"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Product, ProductVariant, ProductImage } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QuickViewDialog } from "@/components/shop/QuickViewDialog";

const PLACEHOLDER_IMAGE = "/product/placeholder.svg";

interface ProductCardProps {
  product: Product;
  showComingSoon?: boolean;
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

function parseAvailableDate(value?: string | null) {
  if (!value?.trim()) return null;

  const normalized = value.trim().replace(" ", "T");
  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  return null;
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function ProductCard({
  product,
  showComingSoon = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  const [quickOpen, setQuickOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

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
  const availableAt = useMemo(
    () => parseAvailableDate(product.availableDate),
    [product.availableDate],
  );
  const isComingSoon = product.status === "COMING_SOON";
  const showComingSoonBlock = showComingSoon && isComingSoon;
  const countdownMs = availableAt ? availableAt.getTime() - now : 0;
  const isCountdownActive = showComingSoonBlock && countdownMs > 0;
  const countdown = formatCountdown(countdownMs);

  const isInStock = variants.length
    ? variants.some((variant) => variant.isAvailable && variant.stockQuantity > 0)
    : product.isActive;
  const isSoldOut = variants.length > 0 && !isInStock;
  const isLowStock = variants.length > 0 && totalStock > 0 && totalStock <= 5;
  const canAddToCart = isInStock && !isComingSoon;

  useEffect(() => {
    if (!isCountdownActive) return;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isCountdownActive]);

  const handleAddToCart = () => {
    if (isComingSoon) {
      toast.message(showComingSoon ? "Coming soon" : "Unavailable", {
        description: showComingSoon
          ? isCountdownActive
            ? "This product is not available yet."
            : "This product is not available for purchase yet."
          : "This product is currently unavailable.",
      });
      return;
    }

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
<Card className="group relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-white p-0 gap-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-zinc-900/10">
  {/* Clickable Image Area - Opens Quick View */}
  <div
    className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-zinc-50"
    onClick={() => setQuickOpen(true)}
  >
    <Image
      src={primaryImage}
      alt={product.name}
      fill
      sizes="(min-width: 1536px) 14vw, (min-width: 1280px) 17vw, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"
      className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
      quality={85}
    />

    {/* Badges */}
    <div className="absolute left-2 top-2 z-20 flex flex-col gap-1">
      {showComingSoonBlock ? (
        <Badge className="border-sky-600 bg-sky-600 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm">
          Coming soon
        </Badge>
      ) : null}
      {hasDiscount ? (
        <Badge className="border-rose-500 bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm">
          Save {discountPercent}%
        </Badge>
      ) : null}
      {isSoldOut ? (
        <Badge className="border-zinc-900 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm">
          Sold out
        </Badge>
      ) : isLowStock ? (
        <Badge className="border-amber-500 bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm">
          Low stock
        </Badge>
      ) : null}
    </div>

    {/* Overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

    {/* Quick View hint on hover */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
      <span className="translate-y-2 transform rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-zinc-900 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
        Quick View
      </span>
    </div>

    {/* Wishlist */}
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="absolute right-2 top-2 z-20 rounded-full border border-zinc-200 bg-white/95 p-1.5 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleWishlist();
          }}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isInWishlist}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              isInWishlist ? "fill-red-500 text-red-500" : "text-zinc-400 hover:text-red-500",
            )}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={6}>
        {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      </TooltipContent>
    </Tooltip>
  </div>

  {/* Content */}
  <CardContent className="space-y-1.5 p-2.5">
    {/* Product name */}
    <h3
      className="line-clamp-1 cursor-pointer text-sm font-semibold leading-tight text-zinc-900 transition-colors hover:text-zinc-600"
      onClick={() => setQuickOpen(true)}
    >
      {product.name}
    </h3>

    {/* Brand and category - more compact */}
    {(product.brand || product.category?.name) && (
      <div className="flex items-center gap-1 text-[11px] text-zinc-500">
        {product.brand ? <span className="font-medium truncate">{product.brand}</span> : null}
        {product.brand && product.category?.name ? (
          <span className="text-zinc-300">•</span>
        ) : null}
        {product.category?.name ? <span className="truncate">{product.category.name}</span> : null}
      </div>
    )}

    {/* Price */}
    <div className="flex flex-wrap items-baseline gap-1">
      <span className="text-base font-extrabold text-zinc-900">
        {showPriceRange
          ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
          : formatPrice(minPrice)}
      </span>
      {hasDiscount && !showPriceRange ? (
        <span className="text-[11px] text-zinc-400 line-through">
          {formatPrice(product.price)}
        </span>
      ) : null}
      {isInStock && !isLowStock ? (
        <span className="text-[11px] font-semibold text-emerald-600">
          In stock
        </span>
      ) : null}
    </div>

    {showComingSoonBlock ? (
      isCountdownActive ? (
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-700">
            Launch In
          </p>
          <div className="mt-1 grid grid-cols-4 gap-1 text-[10px]">
            <div className="rounded bg-white px-1.5 py-1 text-center">
              <p className="font-bold text-zinc-900">{countdown.days}</p>
              <p className="text-zinc-500">D</p>
            </div>
            <div className="rounded bg-white px-1.5 py-1 text-center">
              <p className="font-bold text-zinc-900">{countdown.hours}</p>
              <p className="text-zinc-500">H</p>
            </div>
            <div className="rounded bg-white px-1.5 py-1 text-center">
              <p className="font-bold text-zinc-900">{countdown.minutes}</p>
              <p className="text-zinc-500">M</p>
            </div>
            <div className="rounded bg-white px-1.5 py-1 text-center">
              <p className="font-bold text-zinc-900">{countdown.seconds}</p>
              <p className="text-zinc-500">S</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[11px] font-medium text-sky-700">
          {availableAt
            ? `Available from ${availableAt.toLocaleString()}`
            : "Launching soon"}
        </p>
      )
    ) : null}

    {/* Sizes and colors - condensed */}
    {(sizes.length > 0 || colors.length > 0) && (
      <div className="flex items-center gap-2 text-[11px]">
        {sizes.length > 0 ? (
          <div className="flex items-center gap-1">
            <span className="text-zinc-500">Sizes:</span>
            <span className="font-medium text-zinc-700">
              {sizes.slice(0, 3).join(", ")}
              {sizes.length > 3 ? ` +${sizes.length - 3}` : ""}
            </span>
          </div>
        ) : null}
        {colors.length > 0 ? (
          <div className="flex items-center gap-1">
            <span className="text-zinc-500">Colors:</span>
            <span className="font-medium text-zinc-700">
              {colors.slice(0, 2).join(", ")}
              {colors.length > 2 ? ` +${colors.length - 2}` : ""}
            </span>
          </div>
        ) : null}
      </div>
    )}
  </CardContent>

  {/* Actions */}
  <CardFooter className="flex gap-1.5 border-t border-zinc-100 bg-zinc-50/70 px-2.5 pb-2.5 pt-2">
    <Button
      size="default"
      className="h-8 flex-1 rounded-full bg-zinc-900 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md disabled:opacity-50"
      onClick={handleAddToCart}
      disabled={!canAddToCart}
    >
      <ShoppingCart className="h-3.5 w-3.5" />
      {isComingSoon
        ? showComingSoon
          ? "Coming Soon"
          : "Unavailable"
        : isInStock
          ? "Add to Cart"
          : "Unavailable"}
    </Button>

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-2 border-zinc-200 transition-all hover:border-zinc-300 hover:bg-zinc-50"
          onClick={() => setQuickOpen(true)}
          aria-label="Quick view"
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
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
