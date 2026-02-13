"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product, ProductVariant, ProductImage } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { getProductById } from "@/lib/api/product";

const PLACEHOLDER_IMAGE = "/product/placeholder.svg";

function getVariantImages(variants?: ProductVariant[]): ProductImage[] {
  if (!variants?.length) return [];
  return variants.flatMap((variant) => variant.images ?? []);
}

function uniq(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

function findVariant(
  variants: ProductVariant[] | undefined,
  size: string | null,
  color: string | null,
) {
  if (!variants?.length) return null;
  // if both chosen, match both
  if (size && color) {
    return (
      variants.find(
        (v) => (v.size ?? "") === size && (v.color ?? "") === color,
      ) ?? null
    );
  }
  // match either
  if (size) return variants.find((v) => (v.size ?? "") === size) ?? null;
  if (color) return variants.find((v) => (v.color ?? "") === color) ?? null;
  return variants[0] ?? null;
}

type QuickViewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
};

export function QuickViewDialog({
  open,
  onOpenChange,
  productId,
}: QuickViewDialogProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setQuantity(1);
      setSelectedImageIndex(0);
    }
  }, [open]);

  // Fetch product
  useEffect(() => {
    if (!open || !productId) return;

    let alive = true;
    setLoading(true);
    setProduct(null);

    (async () => {
      try {
        const found = await getProductById(productId);
        if (alive) setProduct(found ?? null);
      } catch {
        if (alive) setProduct(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [open, productId]);

  // derived
  const sizes = useMemo(
    () => uniq(product?.variants?.map((v) => v.size) ?? []),
    [product],
  );
  const colors = useMemo(
    () => uniq(product?.variants?.map((v) => v.color) ?? []),
    [product],
  );

  // set defaults when product changes
  useEffect(() => {
    if (!product) {
      setSelectedSize(null);
      setSelectedColor(null);
      return;
    }
    setSelectedSize((cur) => cur ?? sizes[0] ?? null);
    setSelectedColor((cur) => cur ?? colors[0] ?? null);
  }, [product, sizes, colors]);

  const chosenVariant = useMemo(
    () => findVariant(product?.variants, selectedSize, selectedColor),
    [product, selectedSize, selectedColor],
  );

  const isInWishlist = product ? has(String(product.id)) : false;

  const allImages = product
    ? getVariantImages(product.variants).map((img) => img.imageUrl)
    : [];

  // Prefer chosen variant image if exists, else all images, else placeholder
  const variantImages = (chosenVariant?.images ?? []).map((i) => i.imageUrl);
  const galleryImages =
    variantImages.length > 0
      ? variantImages
      : allImages.length > 0
        ? allImages
        : [PLACEHOLDER_IMAGE];

  // keep selectedImageIndex valid when gallery changes
  useEffect(() => {
    setSelectedImageIndex((idx) => Math.min(idx, galleryImages.length - 1));
  }, [galleryImages.length]);

  const primaryImage = galleryImages[0];

  const basePrice = product?.price ?? 0;
  const chosenPrice =
    chosenVariant?.finalPrice ?? chosenVariant?.priceAdjustment
      ? (basePrice + (chosenVariant?.priceAdjustment ?? 0))
      : basePrice;

  const productMeta = useMemo(() => {
    const brand = product?.brand?.trim();
    const category = product?.category?.name?.trim();
    return { brand, category };
  }, [product]);

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  }, [galleryImages.length]);

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  }, [galleryImages.length]);

  const handleAddToCart = () => {
    if (!product) return;

    // In cart, include variant info (helpful for later)
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: chosenPrice,
        image: primaryImage,
        // If your cart item type supports it, keep:
        // variant: { size: selectedSize, color: selectedColor, variantId: chosenVariant?.id }
      });
    }

    toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart 🛒`, {
      description: selectedSize || selectedColor
        ? `Option: ${[selectedSize, selectedColor].filter(Boolean).join(" / ")}`
        : "You can review it in your cart anytime",
    });
  };

  const toggleWishlist = () => {
    if (!product) return;

    if (isInWishlist) {
      remove(String(product.id));
      toast("Removed from wishlist 💔", { description: "No longer saved" });
    } else {
      add({
        id: String(product.id),
        name: product.name,
        price: chosenPrice,
        image: primaryImage,
      });
      toast.success("Added to wishlist ❤️", { description: "Saved for later" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden",
          "max-w-[750px]",
          "rounded-[26px]",
          "border border-zinc-300 bg-white",
          "shadow-[0_30px_80px_-35px_rgba(0,0,0,0.45)]",
        )}
        size="lg"
      >
        <DialogTitle className="sr-only">
          {product?.name || "Quick View"}
        </DialogTitle>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-28"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mx-auto h-12 w-12 rounded-full border-3 border-zinc-200 border-t-zinc-900"
                />
                <p className="mt-4 text-sm text-zinc-500 font-medium">
                  Loading product...
                </p>
              </div>
            </motion.div>
          ) : !product ? (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex items-center justify-center py-28"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-zinc-400" />
                </div>
                <p className="text-zinc-900 font-semibold text-lg">
                  Product not found
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  This product may have been removed.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-[92vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* LEFT: Image + Options + Description */}
                <div className="bg-zinc-50 p-4 md:p-6 lg:p-7">
                  {/* Main Image */}
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg border border-zinc-200"
                  >
                    <Image
                      src={galleryImages[selectedImageIndex]}
                      alt={product.name}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                      {selectedImageIndex + 1} / {galleryImages.length}
                    </div>

                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur shadow-md hover:bg-white transition"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5 text-zinc-700" />
                        </button>
                        <button
                          type="button"
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur shadow-md hover:bg-white transition"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5 text-zinc-700" />
                        </button>
                      </>
                    )}
                  </motion.div>

                  {/* Thumbnails */}
                  <div className="flex gap-3 mt-4 justify-center flex-wrap">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        aria-pressed={selectedImageIndex === idx}
                        aria-label={`Show image ${idx + 1}`}
                        className={cn(
                          "relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition bg-white",
                          selectedImageIndex === idx
                            ? "border-zinc-900 shadow-md"
                            : "border-transparent hover:border-zinc-300",
                        )}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Options under image */}
                  {(sizes.length > 0 || colors.length > 0) && (
                    <div className="mt-6 rounded-2xl border border-zinc-300 bg-white p-4 md:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-zinc-900">
                          Options
                        </p>
                        {(selectedSize || selectedColor) && (
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            {([selectedSize, selectedColor]
                              .filter(Boolean)
                              .join(" / ") || "Selected")}
                          </span>
                        )}
                      </div>

                      <div
                        className={cn(
                          "grid gap-4",
                          sizes.length > 0 && colors.length > 0
                            ? "md:grid-cols-2"
                            : "grid-cols-1",
                        )}
                      >
                        {sizes.length > 0 ? (
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                              Size
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {sizes.map((size) => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => setSelectedSize(size)}
                                  aria-pressed={selectedSize === size}
                                  className={cn(
                                    "px-3.5 py-1.5 rounded-full text-sm font-medium transition border",
                                    selectedSize === size
                                      ? "bg-zinc-900 text-white border-zinc-900"
                                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-white",
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
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                              Color
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {colors.map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => setSelectedColor(color)}
                                  aria-pressed={selectedColor === color}
                                  className={cn(
                                    "px-3.5 py-1.5 rounded-full text-sm font-medium transition border",
                                    selectedColor === color
                                      ? "bg-zinc-900 text-white border-zinc-900"
                                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-white",
                                  )}
                                >
                                  {color}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* Description under options */}
                  <div className="mt-4 rounded-2xl border border-zinc-300 bg-white p-4 md:p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
                      Details
                    </p>
                    <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                      {product.description ||
                        "Premium quality product designed for style and comfort. Perfect for any occasion."}
                    </p>
                  </div>
                </div>

                {/* RIGHT: Product Info + Actions */}
                <div className="p-6 md:p-8 lg:p-10 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] font-semibold bg-zinc-900 text-white border-zinc-900">
                      {productMeta.category ?? "Product"}
                    </Badge>
                    {productMeta.brand ? (
                      <Badge
                        variant="outline"
                        className="rounded-full border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-600"
                      >
                        {productMeta.brand}
                      </Badge>
                    ) : null}
                  </div>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">
                    {product.name}
                  </h2>

                  <div className="mb-6">
                    <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
                      ${Number(chosenPrice).toFixed(2)}
                    </span>
                    {chosenVariant ? (
                      <p className="mt-1 text-sm text-zinc-500">
                        Variant:{" "}
                        {[selectedSize, selectedColor].filter(Boolean).join(" / ")}
                      </p>
                    ) : null}
                  </div>

                  <Separator className="my-4" />

                  {/* Quantity */}
                  <div className="mb-5">
                    <p className="text-sm font-bold text-zinc-900 mb-2">
                      Quantity
                    </p>
                    <div className="inline-flex items-center border-2 border-zinc-300 rounded-full bg-white">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-l-full transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-zinc-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-r-full transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 md:gap-3 mb-4">
                    <Button
                      className="flex-1 h-11 md:h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-sm md:text-base font-bold shadow-lg shadow-zinc-900/20 hover:shadow-xl hover:shadow-zinc-900/30 transition-all"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Add to Cart
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-11 w-11 md:h-12 md:w-12 rounded-full border-2 transition-all shrink-0",
                        isInWishlist
                          ? "bg-red-50 border-red-200 hover:bg-red-100"
                          : "border-zinc-300 hover:border-zinc-400",
                      )}
                      onClick={toggleWishlist}
                      aria-label="Toggle wishlist"
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4 md:w-5 md:h-5",
                          isInWishlist
                            ? "fill-red-500 text-red-500"
                            : "text-zinc-600",
                        )}
                      />
                    </Button>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-10 md:h-11 rounded-full border-2 border-zinc-300 hover:bg-zinc-50 mb-6 font-semibold"
                  >
                    <Link
                      href={`/shop/${product.id}`}
                      onClick={() => onOpenChange(false)}
                    >
                      View Full Details
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
