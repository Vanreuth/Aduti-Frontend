"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shop/StarRating";
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

  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

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

  const handleAddToCart = () => {
    if (!product) return;

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

  // Close dialog then navigate (clean UX)
  const closeAndGo = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-5 border-b">
          <DialogTitle className="text-base font-semibold">
            Quick View
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          {loading ? (
            <div className="py-10 text-center">
              <div className="mx-auto h-10 w-10 rounded-full border-t-2 border-b-2 border-zinc-900 animate-spin" />
              <p className="mt-3 text-sm text-zinc-600">Loading...</p>
            </div>
          ) : !product ? (
            <div className="py-10 text-center">
              <p className="text-zinc-900 font-semibold">Product not found</p>
              <p className="mt-2 text-sm text-zinc-600">
                This product may have been removed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">
                    {product.name}
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-zinc-500">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-zinc-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-zinc-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed line-clamp-4">
                  {product.description ||
                    "Premium quality product for your style."}
                </p>

                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-11"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-full h-11 px-4"
                    onClick={toggleWishlist}
                    aria-label="Toggle wishlist"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        isInWishlist
                          ? "fill-red-500 text-red-500"
                          : "text-zinc-700"
                      )}
                    />
                  </Button>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <Link href={`/products/${product.id}`} onClick={closeAndGo}>
                    View full details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
