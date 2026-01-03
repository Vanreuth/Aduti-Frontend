"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shop/StarRating";
import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/firebase/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();
  const { add, remove, has } = useWishlist();

  const isInWishlist = product ? has(String(product.id)) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      const products = await getAllProducts();
      const found = products.find((p) => String(p.id) === String(id));

      if (!found) {
        setProduct(null);
      } else {
        setProduct(found);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-900" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

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

  const toggleWishlist = () => {
    if (isInWishlist) {
      remove(String(product.id));
      toast("Removed from wishlist 💔");
    } else {
      add({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
      });
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div className="container-app">
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />

            {/* Wishlist */}
            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 p-2 rounded-full bg-white shadow"
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
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-zinc-900">{product.name}</h1>

            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-sm text-zinc-500">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-zinc-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-zinc-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-zinc-600 leading-relaxed">
              {product.description ||
                "This is a high-quality product designed for comfort and style."}
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-12"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className="rounded-full h-12 px-6"
                onClick={toggleWishlist}
              >
                {isInWishlist ? "Remove Wishlist" : "Add Wishlist"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
