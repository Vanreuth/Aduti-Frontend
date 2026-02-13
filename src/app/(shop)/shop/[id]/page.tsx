"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, ProductVariant, ProductImage } from "@/types/product";
import { getProductDetail } from "@/lib/api/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProductGrid } from "@/components/shop/ProductGrid";

const PLACEHOLDER_IMAGE = "/product/placeholder.svg";

function normalizeVariantValue(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return null;
  return trimmed;
}

function getVariantImages(variants?: ProductVariant[]): ProductImage[] {
  if (!variants?.length) return [];
  return variants.flatMap((variant) => variant.images ?? []);
}

function getUniqueList(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      values
        .map((value) => normalizeVariantValue(value))
        .filter((value): value is string => Boolean(value)),
    ),
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  const isInWishlist = product ? has(String(product.id)) : false;

  useEffect(() => {
    let alive = true;

    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      setRelatedProducts([]);
      try {
        const data = await getProductDetail(String(id));
        if (!alive) return;
        setProduct(data.product ?? null);
        setRelatedProducts(data.relatedProducts ?? []);
      } catch {
        if (!alive) return;
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      alive = false;
    };
  }, [id]);

  const sizes = useMemo(
    () => getUniqueList(product?.variants?.map((v) => v.size) ?? []),
    [product],
  );
  const colors = useMemo(
    () => getUniqueList(product?.variants?.map((v) => v.color) ?? []),
    [product],
  );
  const galleryImages = useMemo(() => {
    const images = getVariantImages(product?.variants);
    return images.length > 0
      ? images.map((img) => img.imageUrl)
      : [PLACEHOLDER_IMAGE];
  }, [product]);
  const variants = useMemo(() => product?.variants ?? [], [product]);

  useEffect(() => {
    if (!product) {
      setSelectedSize(null);
      setSelectedColor(null);
      return;
    }
    setSelectedImageIndex(0);
    setQuantity(1);
    setSelectedSize((current) =>
      current && sizes.includes(current) ? current : sizes[0] ?? null,
    );
    setSelectedColor((current) =>
      current && colors.includes(current) ? current : colors[0] ?? null,
    );
  }, [product, sizes, colors]);

  const availableSizes = useMemo(() => {
    if (!variants.length || !selectedColor) return new Set(sizes);
    const next = new Set<string>();
    for (const variant of variants) {
      const variantColor = normalizeVariantValue(variant.color);
      const variantSize = normalizeVariantValue(variant.size);
      if (variantColor === selectedColor && variantSize) next.add(variantSize);
    }
    return next.size > 0 ? next : new Set(sizes);
  }, [variants, selectedColor, sizes]);

  const availableColors = useMemo(() => {
    if (!variants.length || !selectedSize) return new Set(colors);
    const next = new Set<string>();
    for (const variant of variants) {
      const variantColor = normalizeVariantValue(variant.color);
      const variantSize = normalizeVariantValue(variant.size);
      if (variantSize === selectedSize && variantColor) next.add(variantColor);
    }
    return next.size > 0 ? next : new Set(colors);
  }, [variants, selectedSize, colors]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;

    const exactMatch = variants.find((variant) => {
      const variantSize = normalizeVariantValue(variant.size);
      const variantColor = normalizeVariantValue(variant.color);
      const sizeOk = selectedSize ? variantSize === selectedSize : true;
      const colorOk = selectedColor ? variantColor === selectedColor : true;
      return sizeOk && colorOk;
    });

    return exactMatch ?? variants[0] ?? null;
  }, [variants, selectedColor, selectedSize]);

  const selectedVariantImage = selectedVariant?.images?.[0]?.imageUrl ?? null;
  const selectedStock = selectedVariant?.stockQuantity ?? 0;
  const totalStock = variants.reduce((sum, variant) => sum + (variant.stockQuantity ?? 0), 0);
  const maxSelectableQty = Math.max(
    1,
    selectedVariant ? selectedStock : totalStock,
  );

  useEffect(() => {
    if (!selectedVariantImage) return;
    const matchedIndex = galleryImages.findIndex((img) => img === selectedVariantImage);
    if (matchedIndex >= 0) {
      setSelectedImageIndex(matchedIndex);
    }
  }, [galleryImages, selectedVariantImage]);

  useEffect(() => {
    setSelectedImageIndex((current) =>
      Math.min(current, Math.max(0, galleryImages.length - 1)),
    );
  }, [galleryImages.length]);

  useEffect(() => {
    setQuantity((current) => Math.min(current, maxSelectableQty));
  }, [maxSelectableQty]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            <div>
              <Skeleton className="aspect-square rounded-2xl sm:aspect-3/4 sm:rounded-3xl" />
              <div className="mt-4 flex gap-2">
                {Array.from({ length: 4 }, (_, i) => `thumb-${i}`).map((id) => (
                  <Skeleton key={id} className="h-14 w-14 rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-8 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-16 rounded-full" />
                <Skeleton className="h-10 w-16 rounded-full" />
                <Skeleton className="h-10 w-16 rounded-full" />
              </div>
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const primaryImage = galleryImages[selectedImageIndex] ?? selectedVariantImage ?? galleryImages[0];
  const variantPrices = variants.length
    ? variants.map((v) => v.finalPrice ?? product.price)
    : [product.price];
  const minPrice = Math.min(...variantPrices);
  const maxPrice = Math.max(...variantPrices);
  const showPriceRange = minPrice !== maxPrice;
  const selectedPrice = selectedVariant?.finalPrice ?? minPrice;
  const isComingSoon = product.status === "COMING_SOON";
  const isInStock = variants.length
    ? variants.some(
        (variant) => (variant.isAvailable ?? true) && (variant.stockQuantity ?? 0) > 0,
      )
    : product.isActive;
  const isSelectedVariantAvailable = variants.length
    ? Boolean(
        selectedVariant &&
          (selectedVariant.isAvailable ?? true) &&
          (selectedVariant.stockQuantity ?? 0) > 0,
      )
    : isInStock;
  const canAddToCart = isSelectedVariantAvailable && !isComingSoon;

  const handleAddToCart = () => {
    if (isComingSoon) {
      toast.message("Coming soon", {
        description: "This product is not available for purchase yet.",
      });
      return;
    }

    if (!isSelectedVariantAvailable) {
      toast.error("Unavailable", {
        description: "The selected variant is currently out of stock.",
      });
      return;
    }

    if (quantity > maxSelectableQty) {
      toast.error("Quantity not available", {
        description: `Only ${maxSelectableQty} item${
          maxSelectableQty > 1 ? "s are" : " is"
        } available right now.`,
      });
      setQuantity(maxSelectableQty);
      return;
    }

    for (let i = 0; i < quantity; i += 1) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: selectedPrice,
        image: primaryImage,
      });
    }

    toast.success(
      `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart 🛒`,
      {
        description: "You can review it in your cart anytime",
      },
    );
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      remove(String(product.id));
      toast("Removed from wishlist 💔");
    } else {
      add({
        id: String(product.id),
        name: product.name,
        price: selectedPrice,
        image: primaryImage,
      });
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(24,24,27,0.08),transparent_62%)]" />
      <section className="relative mx-auto max-w-7xl space-y-10 px-4 py-6 pb-28 sm:space-y-12 sm:py-10 lg:pb-10">
        <div className="mb-4 flex items-center gap-3 text-xs text-zinc-500 sm:mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <span className="text-zinc-300">|</span>
          <Link href="/shop" className="hover:text-zinc-800">
            Shop
          </Link>
          <span>/</span>
          <span className="max-w-full truncate text-zinc-700">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Image */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row">
            {galleryImages.length > 1 ? (
              <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:max-h-[34rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-pressed={selectedImageIndex === idx}
                    className={cn(
                      "relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-16 sm:w-16 sm:rounded-2xl",
                      selectedImageIndex === idx
                        ? "border-zinc-900 shadow-md"
                        : "border-transparent hover:border-zinc-300",
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="order-1 relative aspect-square flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm sm:aspect-[5/4] sm:rounded-3xl">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-[1.04]"
              />

              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-zinc-700 shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
                {selectedImageIndex + 1} / {galleryImages.length}
              </div>

              <Badge
                className={cn(
                  "absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide sm:bottom-4 sm:left-4",
                  isComingSoon
                    ? "border-sky-600 bg-sky-600 text-white"
                    : canAddToCart
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-zinc-900 bg-zinc-900 text-white",
                )}
              >
                {isComingSoon
                  ? "Coming soon"
                  : canAddToCart
                    ? "Ready to ship"
                    : "Sold out"}
              </Badge>

              {galleryImages.length > 1 ? (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? galleryImages.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow-md transition-all hover:bg-white sm:left-4 sm:p-2"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4 text-zinc-700 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === galleryImages.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow-md transition-all hover:bg-white sm:right-4 sm:p-2"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4 text-zinc-700 sm:h-5 sm:w-5" />
                  </button>
                </>
              ) : null}

              <button
                onClick={toggleWishlist}
                className="absolute right-3 top-3 rounded-full bg-white p-1.5 shadow sm:right-4 sm:top-4 sm:p-2"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5",
                    isInWishlist ? "fill-red-500 text-red-500" : "text-zinc-400",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full border-zinc-900 bg-zinc-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    {product.category?.name ?? "Product"}
                  </Badge>
                  {product.brand ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-600"
                    >
                      {product.brand}
                    </Badge>
                  ) : null}
                </div>
                <h1 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl md:text-4xl">
                  {product.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                      isComingSoon
                        ? "border-sky-600 bg-sky-600 text-white"
                        : canAddToCart
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-zinc-900 bg-zinc-900 text-white",
                    )}
                  >
                    {isComingSoon
                      ? "Coming soon"
                      : canAddToCart
                        ? "In stock"
                        : "Out of stock"}
                  </Badge>
                  {selectedVariant?.sku ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-zinc-300 px-3 py-1 text-[11px] font-medium text-zinc-600"
                    >
                      SKU: {selectedVariant.sku}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
                  ${selectedPrice.toFixed(2)}
                </span>
                {showPriceRange ? (
                  <span className="text-sm text-zinc-500">
                    Range ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
                  </span>
                ) : null}
              </div>

              <p className="mt-4 text-zinc-600 leading-relaxed">
                {product.description ||
                  "This is a high-quality product designed for comfort and style."}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                <div className="rounded-xl bg-zinc-100 px-3 py-2 text-zinc-600">
                  <span className="font-semibold text-zinc-900">Item ID</span> #{product.id}
                </div>
                <div className="rounded-xl bg-zinc-100 px-3 py-2 text-zinc-600">
                  <span className="font-semibold text-zinc-900">Category</span>{" "}
                  {product.category?.name ?? "General"}
                </div>
                <div className="rounded-xl bg-zinc-100 px-3 py-2 text-zinc-600 sm:col-span-1 col-span-2">
                  <span className="font-semibold text-zinc-900">Variant</span>{" "}
                  {selectedSize ? `Size ${selectedSize}` : "Any"} /{" "}
                  {selectedColor ?? "Any color"}
                </div>
              </div>

              <Separator className="my-5" />

              {(sizes.length > 0 || colors.length > 0) && (
                <div className="space-y-4">
                  {sizes.length > 0 ? (
                    <div>
                      <p className="mb-2 text-sm font-semibold text-zinc-900">Sizes</p>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                          const disabled = !availableSizes.has(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setSelectedSize(size)}
                              aria-pressed={selectedSize === size}
                              disabled={disabled}
                              className={cn(
                                "rounded-full border px-3 py-1 text-sm transition",
                                selectedSize === size
                                  ? "border-zinc-900 bg-zinc-900 text-white"
                                  : "border-transparent bg-zinc-100 text-zinc-700 hover:border-zinc-300",
                                disabled && "cursor-not-allowed opacity-40",
                              )}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                  {colors.length > 0 ? (
                    <div>
                      <p className="mb-2 text-sm font-semibold text-zinc-900">Colors</p>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                          const disabled = !availableColors.has(color);
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setSelectedColor(color)}
                              aria-pressed={selectedColor === color}
                              disabled={disabled}
                              className={cn(
                                "rounded-full border px-3 py-1 text-sm transition",
                                selectedColor === color
                                  ? "border-zinc-900 bg-zinc-900 text-white"
                                  : "border-transparent bg-zinc-100 text-zinc-700 hover:border-zinc-300",
                                disabled && "cursor-not-allowed opacity-40",
                              )}
                            >
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div>
                  <p className="mb-2 text-sm font-semibold text-zinc-900">Quantity</p>
                  <div className="inline-flex items-center rounded-full border border-zinc-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-l-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-semibold text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((current) => Math.min(maxSelectableQty, current + 1))
                      }
                      disabled={!canAddToCart || quantity >= maxSelectableQty}
                      className="flex h-9 w-9 items-center justify-center rounded-r-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-500">
                  {selectedVariant
                    ? `${selectedStock} left for selected variant`
                    : `${totalStock} total available`}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="h-12 flex-1 rounded-full bg-zinc-900 font-semibold text-white hover:bg-zinc-800"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isComingSoon ? "Coming Soon" : canAddToCart ? "Add to Cart" : "Unavailable"}
                </Button>

                <Button
                  variant="outline"
                  className={cn(
                    "h-12 w-full rounded-full p-0 sm:w-12",
                    isInWishlist
                      ? "border-red-200 bg-red-50 hover:bg-red-100"
                      : "border-zinc-200 hover:border-zinc-300",
                  )}
                  onClick={toggleWishlist}
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      isInWishlist ? "fill-red-500 text-red-500" : "text-zinc-600",
                    )}
                  />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <div className="flex items-center gap-2 text-zinc-900">
                  <Truck className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Fast Shipping</p>
                </div>
                <p className="mt-1 text-xs text-zinc-500">Dispatch in 24-48 hours.</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <div className="flex items-center gap-2 text-zinc-900">
                  <RefreshCcw className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Easy Returns</p>
                </div>
                <p className="mt-1 text-xs text-zinc-500">7-day return policy.</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3">
                <div className="flex items-center gap-2 text-zinc-900">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-wide">Secure Payment</p>
                </div>
                <p className="mt-1 text-xs text-zinc-500">Protected checkout.</p>
              </div>
            </div>

            <p className="flex items-center gap-2 text-xs text-zinc-500">
              <Sparkles className="h-4 w-4 text-zinc-600" />
              Curated quality product from our latest collection.
            </p>
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  You may also like
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
                  Related products
                </h2>
              </div>
              <Link href="/shop" className="text-sm text-zinc-500 hover:text-zinc-900">
                View all
              </Link>
            </div>
            <ProductGrid
              products={relatedProducts}
              gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              animated
            />
          </div>
        ) : null}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900">
              {product.name}
            </p>
            <p className="text-xs text-zinc-500">${selectedPrice.toFixed(2)}</p>
          </div>
          <Button
            className="h-10 rounded-full bg-zinc-900 px-4 font-semibold text-white hover:bg-zinc-800"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isComingSoon ? "Soon" : canAddToCart ? "Add" : "Unavailable"}
          </Button>
        </div>
      </div>
    </div>
  );
}
