"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  X,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/firebase/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

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

  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setQuantity(1);
      setSelectedImageIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !productId) return;

    let alive = true;
    setLoading(true);
    setProduct(null);

    (async () => {
      try {
        const products = await getAllProducts();
        const found = products.find((p) => String(p.id) === String(productId));
        if (alive) setProduct(found ?? null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [open, productId]);

  const isInWishlist = product ? has(String(product.id)) : false;

  // Generate multiple images for gallery effect (using same image with different crops)
  const productImages = product
    ? [
        product.image,
        product.image.replace("fit=crop", "fit=crop&crop=top"),
        product.image.replace("fit=crop", "fit=crop&crop=bottom"),
      ]
    : [];

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }

    toast.success(
      `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart 🛒`,
      {
        description: "You can review it in your cart anytime",
      }
    );
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
        price: product.price,
        image: product.image,
      });
      toast.success("Added to wishlist ❤️", { description: "Saved for later" });
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : star - 0.5 <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "fill-zinc-200 text-zinc-200"
          )}
        />
      ))}
    </div>
  );

  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] p-0 overflow-hidden rounded-3xl border-0 shadow-2xl bg-white">
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">
          {product?.name || "Quick View"}
        </DialogTitle>

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all hover:scale-105"
        >
          <X className="w-5 h-5 text-zinc-600" />
        </button>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-32"
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center py-32"
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
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-[90vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Gallery Section */}
                <div className="relative bg-linear-to-br from-zinc-100 to-zinc-50 p-4 md:p-6">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 flex flex-col gap-2">
                    {product.isNew && (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs font-bold rounded-full">
                        NEW
                      </Badge>
                    )}
                    {discount > 0 && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full">
                        -{discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Main Image */}
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg"
                  >
                    <Image
                      src={productImages[selectedImageIndex]}
                      alt={product.name}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Image Navigation */}
                    {productImages.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setSelectedImageIndex((prev) =>
                              prev === 0 ? productImages.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all hover:scale-110"
                        >
                          <ChevronLeft className="w-5 h-5 text-zinc-700" />
                        </button>
                        <button
                          onClick={() =>
                            setSelectedImageIndex((prev) =>
                              prev === productImages.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all hover:scale-110"
                        >
                          <ChevronRight className="w-5 h-5 text-zinc-700" />
                        </button>
                      </>
                    )}
                  </motion.div>

                  {/* Thumbnail Gallery */}
                  <div className="flex gap-2 md:gap-3 mt-4 justify-center">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={cn(
                          "relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all",
                          selectedImageIndex === idx
                            ? "border-zinc-900 shadow-md scale-105"
                            : "border-transparent hover:border-zinc-300"
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
                </div>

                {/* Product Info Section */}
                <div className="p-5 md:p-8 flex flex-col">
                  {/* Category */}
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    {product.category}
                  </p>

                  {/* Name */}
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-900 mb-3">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2 md:gap-3 mb-4">
                    {renderStars(product.rating)}
                    <span className="text-xs md:text-sm text-zinc-500">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <span className="text-2xl md:text-3xl font-bold text-zinc-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base md:text-lg text-zinc-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-xs md:text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Save $
                        {(product.originalPrice! - product.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base text-zinc-600 leading-relaxed mb-4 md:mb-6">
                    {product.description ||
                      "Premium quality product designed for style and comfort. Perfect for any occasion."}
                  </p>

                  {/* Quantity Selector */}
                  <div className="mb-4 md:mb-6">
                    <p className="text-sm font-semibold text-zinc-900 mb-2 md:mb-3">
                      Quantity
                    </p>
                    <div className="inline-flex items-center border border-zinc-200 rounded-full">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-l-full transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 md:w-12 text-center font-semibold text-zinc-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-r-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 md:gap-3 mb-4 md:mb-6">
                    <Button
                      className="flex-1 h-11 md:h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-sm md:text-base font-semibold shadow-lg shadow-zinc-900/20 hover:shadow-xl hover:shadow-zinc-900/30 transition-all"
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
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                      onClick={toggleWishlist}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4 md:w-5 md:h-5",
                          isInWishlist
                            ? "fill-red-500 text-red-500"
                            : "text-zinc-600"
                        )}
                      />
                    </Button>
                  </div>

                  {/* View Full Details Link */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-10 md:h-11 rounded-full border-zinc-300 hover:bg-zinc-50 mb-4 md:mb-6"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      onClick={() => onOpenChange(false)}
                    >
                      View Full Details
                    </Link>
                  </Button>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-2 md:gap-3 pt-4 border-t border-zinc-100">
                    <div className="text-center p-2 md:p-3 rounded-xl bg-zinc-50">
                      <Truck className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-zinc-700" />
                      <p className="text-[10px] md:text-xs text-zinc-600 font-medium">
                        Free Shipping
                      </p>
                    </div>
                    <div className="text-center p-2 md:p-3 rounded-xl bg-zinc-50">
                      <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-zinc-700" />
                      <p className="text-[10px] md:text-xs text-zinc-600 font-medium">
                        Secure Pay
                      </p>
                    </div>
                    <div className="text-center p-2 md:p-3 rounded-xl bg-zinc-50">
                      <RotateCcw className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-1.5 text-zinc-700" />
                      <p className="text-[10px] md:text-xs text-zinc-600 font-medium">
                        Easy Return
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
