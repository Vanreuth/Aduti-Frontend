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
  Truck,
  Shield,
  RotateCcw,
  Star,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, ProductVariant, ProductImage } from "@/types/api";
import { getProductById } from "@/lib/api/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PLACEHOLDER_IMAGE = "/product/placeholder.svg";

function getVariantImages(variants?: ProductVariant[]): ProductImage[] {
  if (!variants?.length) return [];
  return variants.flatMap((variant) => variant.images ?? []);
}

function getUniqueList(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  const isInWishlist = product ? has(String(product.id)) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const found = await getProductById(String(id));
        setProduct(found ?? null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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

  useEffect(() => {
    if (!product) {
      setSelectedSize(null);
      setSelectedColor(null);
      return;
    }
    setSelectedImageIndex(0);
    setQuantity(1);
    setSelectedSize((current) => current ?? sizes[0] ?? null);
    setSelectedColor((current) => current ?? colors[0] ?? null);
  }, [product, sizes, colors]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <Skeleton className="aspect-3/4 rounded-3xl" />
              <div className="flex gap-2 mt-4">
                {Array.from({ length: 4 }, (_, i) => `thumb-${i}`).map((id) => (
                  <Skeleton key={id} className="h-16 w-16 rounded-2xl" />
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

  const primaryImage = galleryImages[0];
  const variantPrices = product.variants?.length
    ? product.variants.map((v) => v.finalPrice ?? product.price)
    : [product.price];
  const minPrice = Math.min(...variantPrices);
  const maxPrice = Math.max(...variantPrices);
  const showPriceRange = minPrice !== maxPrice;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: minPrice,
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
        price: minPrice,
        image: primaryImage,
      });
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/shop" className="hover:text-zinc-800">
            Shop
          </Link>
          <span>/</span>
          <span className="text-zinc-700">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-zinc-100">
              <Image
                src={galleryImages[selectedImageIndex]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />

              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                {selectedImageIndex + 1} / {galleryImages.length}
              </div>

              {galleryImages.length > 1 ? (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? galleryImages.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-zinc-700" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === galleryImages.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-zinc-700" />
                  </button>
                </>
              ) : null}

              {/* Wishlist */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 p-2 rounded-full bg-white shadow"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isInWishlist ? "fill-red-500 text-red-500" : "text-zinc-400",
                  )}
                />
              </button>
            </div>

            {galleryImages.length > 1 ? (
              <div className="flex gap-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-pressed={selectedImageIndex === idx}
                    className={cn(
                      "relative h-16 w-16 rounded-2xl overflow-hidden border-2 transition-all",
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
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                {product.category?.name ?? "Product"}
              </p>
              <h1 className="text-3xl font-bold text-zinc-900">
                {product.name}
              </h1>
              <div className="mt-2 text-sm text-zinc-500">
                {product.brand ? <span>{product.brand}</span> : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-zinc-200 text-zinc-200"
                />
              ))}
              <span className="text-xs text-zinc-500">No reviews yet</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-zinc-900">
                {showPriceRange
                  ? `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`
                  : `$${minPrice.toFixed(2)}`}
              </span>
            </div>

            <p className="text-zinc-600 leading-relaxed">
              {product.description ||
                "This is a high-quality product designed for comfort and style."}
            </p>

            {(sizes.length > 0 || colors.length > 0) && (
              <div className="space-y-4">
                {sizes.length > 0 ? (
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 mb-2">
                      Sizes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          aria-pressed={selectedSize === size}
                          className={cn(
                            "px-3 py-1 rounded-full text-sm transition border",
                            selectedSize === size
                              ? "bg-zinc-900 text-white border-zinc-900"
                              : "bg-zinc-100 text-zinc-700 border-transparent hover:border-zinc-300",
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {colors.length > 0 ? (
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 mb-2">
                      Colors
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          aria-pressed={selectedColor === color}
                          className={cn(
                            "px-3 py-1 rounded-full text-sm transition border",
                            selectedColor === color
                              ? "bg-zinc-900 text-white border-zinc-900"
                              : "bg-zinc-100 text-zinc-700 border-transparent hover:border-zinc-300",
                          )}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-zinc-900 mb-2">
                Quantity
              </p>
              <div className="inline-flex items-center border border-zinc-200 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-l-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-zinc-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-r-full transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-12"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className={cn(
                  "rounded-full h-12 w-12 p-0",
                  isInWishlist
                    ? "bg-red-50 border-red-200 hover:bg-red-100"
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

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100">
              <div className="text-center p-3 rounded-xl bg-white">
                <Truck className="w-5 h-5 mx-auto mb-1.5 text-zinc-700" />
                <p className="text-xs text-zinc-600 font-medium">
                  Free Shipping
                </p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white">
                <Shield className="w-5 h-5 mx-auto mb-1.5 text-zinc-700" />
                <p className="text-xs text-zinc-600 font-medium">
                  Secure Pay
                </p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white">
                <RotateCcw className="w-5 h-5 mx-auto mb-1.5 text-zinc-700" />
                <p className="text-xs text-zinc-600 font-medium">
                  Easy Returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
