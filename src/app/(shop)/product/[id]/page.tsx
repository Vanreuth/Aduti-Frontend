"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  description: string;
  details: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
}

// Sample products data - in real app, fetch from API
const products: Record<string, Product> = {
  "1": {
    id: 1,
    name: "Esprit Ruffle Shirt",
    price: 16.64,
    originalPrice: 24.99,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
    ],
    category: "Women",
    rating: 4.5,
    reviews: 128,
    description:
      "A beautiful ruffle shirt perfect for any occasion. Made with premium quality fabric that ensures comfort and style. The elegant design features delicate ruffles that add a feminine touch to your wardrobe.",
    details: [
      "100% Premium Cotton",
      "Machine washable",
      "Relaxed fit",
      "Imported",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Pink", hex: "#FFC0CB" },
    ],
    inStock: true,
  },
  "2": {
    id: 2,
    name: "Herschel Supply Bag",
    price: 35.31,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
    ],
    category: "Bag",
    rating: 4.8,
    reviews: 89,
    description:
      "Classic Herschel bag with modern functionality. Features multiple compartments for organization and durable construction for everyday use.",
    details: [
      "Durable polyester fabric",
      "Padded laptop sleeve",
      "Multiple pockets",
      "Adjustable straps",
    ],
    colors: [
      { name: "Navy", hex: "#000080" },
      { name: "Black", hex: "#000000" },
      { name: "Grey", hex: "#808080" },
    ],
    inStock: true,
  },
  "3": {
    id: 3,
    name: "Only Check Trouser",
    price: 25.5,
    images: [
      "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVufGVufDB8fDB8fHww",
    ],
    category: "Men",
    rating: 4.3,
    reviews: 56,
    description:
      "Stylish check trousers perfect for both casual and semi-formal occasions. Comfortable fit with a modern silhouette.",
    details: [
      "65% Polyester, 35% Viscose",
      "Dry clean only",
      "Slim fit",
      "Side pockets",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Grey Check", hex: "#808080" },
      { name: "Navy Check", hex: "#000080" },
    ],
    inStock: true,
  },
};

// Default product for IDs not in our sample data
const defaultProduct: Product = {
  id: 0,
  name: "Premium Fashion Item",
  price: 49.99,
  originalPrice: 69.99,
  images: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop",
  ],
  category: "Fashion",
  rating: 4.5,
  reviews: 100,
  description:
    "A premium fashion item crafted with attention to detail. Perfect for any occasion and designed to make you stand out.",
  details: [
    "High-quality materials",
    "Comfortable fit",
    "Easy care instructions",
    "Versatile styling options",
  ],
  sizes: ["S", "M", "L", "XL"],
  colors: [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
  ],
  inStock: true,
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const product = products[productId] || {
    ...defaultProduct,
    id: parseInt(productId) || 0,
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || ""
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : star - 0.5 <= rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "fill-zinc-200 text-zinc-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-zinc-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-zinc-500 hover:text-zinc-900">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
            <Link href="/shop" className="text-zinc-500 hover:text-zinc-900">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-zinc-100">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 text-sm font-bold bg-red-500 text-white rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-zinc-900"
                        : "border-transparent hover:border-zinc-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            {/* Category */}
            <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              {renderStars(product.rating)}
              <span className="text-sm text-zinc-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-zinc-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-zinc-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-zinc-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-zinc-900 mb-3">
                  Color: <span className="font-normal">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-zinc-900 ring-2 ring-zinc-900 ring-offset-2"
                          : "border-zinc-300 hover:border-zinc-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-zinc-900 mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-12 h-10 px-4 rounded-lg border font-medium transition-all ${
                        selectedSize === size
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center border border-zinc-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-base font-semibold">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              {/* Wishlist */}
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-lg border-zinc-300 ${
                  isWishlisted ? "bg-red-50 border-red-200" : ""
                }`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-zinc-600"
                  }`}
                />
              </Button>

              {/* Share */}
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-lg border-zinc-300"
              >
                <Share2 className="w-5 h-5 text-zinc-600" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-50 rounded-xl mb-8">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-zinc-700" />
                <p className="text-xs text-zinc-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-zinc-700" />
                <p className="text-xs text-zinc-600">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-zinc-700" />
                <p className="text-xs text-zinc-600">Easy Returns</p>
              </div>
            </div>

            {/* Stock Status */}
            <p
              className={`text-sm font-medium ${
                product.inStock ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
            </p>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-transparent px-6 py-3"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-transparent px-6 py-3"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                  Product Details
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-zinc-600"
                    >
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-zinc-900">
                      {product.rating}
                    </p>
                    <div className="mt-1">{renderStars(product.rating)}</div>
                    <p className="text-sm text-zinc-500 mt-1">
                      {product.reviews} reviews
                    </p>
                  </div>
                </div>
                <p className="text-zinc-600">
                  Customer reviews will be displayed here. This section can be
                  connected to your review system.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="max-w-2xl space-y-4">
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2">Shipping</h4>
                  <p className="text-zinc-600">
                    Free standard shipping on orders over $50. Express shipping
                    available at checkout. Delivery typically takes 3-5 business
                    days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-2">Returns</h4>
                  <p className="text-zinc-600">
                    We accept returns within 30 days of purchase. Items must be
                    unworn and in original packaging. Free returns on all
                    orders.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
