"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useSyncExternalStore } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  LogOut,
  User,
  Package,
  X,
  ChevronRight,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Features", href: "/feature" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const ACCOUNT_MENU = [
  { label: "Profile", href: "/account", icon: User },
  { label: "Orders", href: "/order", icon: Package },
];

const POPULAR_SEARCHES = [
  "Shoes",
  "T-Shirts",
  "Watches",
  "Bags",
  "Sunglasses",
  "Jackets",
];

// Custom hook to handle hydration without setState in useEffect
const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useHydrated();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Sample cart items (replace with actual cart state/context)
  const cartItems = [
    {
      id: 1,
      name: "Classic White T-Shirt",
      price: 29.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Denim Jacket",
      price: 89.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
    },
  ];

  // Sample wishlist items (replace with actual wishlist state/context)
  const wishlistItems = [
    {
      id: 1,
      name: "Premium Leather Watch",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop",
    },
    {
      id: 1,
      name: "Premium Leather Watch",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop",
    },
  ];

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-zinc-900/5"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between gap-8">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-zinc-100 rounded-full"
                >
                  <Menu className="h-5 w-5 text-zinc-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-6 bg-linear-to-br from-zinc-900 to-zinc-800">
                  <SheetTitle className="text-2xl font-bold text-white text-left">
                    Aduti
                  </SheetTitle>
                </SheetHeader>

                {user && (
                  <div className="p-6 bg-zinc-50 border-b">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg">
                        <AvatarImage src={user.photoURL || ""} />
                        <AvatarFallback className="bg-linear-to-br from-zinc-700 to-zinc-900 text-white text-lg font-semibold">
                          {user.displayName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-zinc-900 truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-sm text-zinc-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col p-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                        isActive(link.href)
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                      }`}
                    >
                      {link.name}
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  ))}

                  <Separator className="my-4" />

                  <Link
                    href="/cart"
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                    </span>
                    <Badge className="bg-zinc-900 text-white text-xs">2</Badge>
                  </Link>

                  <Link
                    href="/account/wishlist"
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </span>
                    <Badge className="bg-red-500 text-white text-xs">1</Badge>
                  </Link>

                  <Separator className="my-4" />

                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  ) : (
                    <div className="space-y-2 px-4">
                      <Button
                        asChild
                        className="w-full bg-zinc-900 hover:bg-zinc-800"
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/register">Create Account</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center group shrink-0">
              <div className="relative h-24 w-24 rounded-full transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/Shop_Logo.png"
                  alt="Aduti Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center bg-zinc-50 rounded-full p-1.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-6 py-3 text-md font-medium transition-all duration-300 rounded-full ${
                      isActive(link.href)
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/25"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full bg-blue-100 hover:bg-blue-200 transition-all"
              >
                <Search className="h-5 w-5" color="#3b82f6" />
              </Button>

              {/* Wishlist - Hidden on mobile */}
              <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full bg-pink-100 hover:bg-pink-200 hidden sm:flex transition-all"
                  >
                    <Heart className="h-5 w-5" color="#ec4899" />
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-pink-500 text-white text-[10px] font-bold">
                      {wishlistItems.length}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-105 p-0 flex flex-col border-l-0 bg-linear-to-b from-zinc-50 to-white"
                >
                  {/* Modern Gradient Header */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-pink-500 via-rose-500 to-red-500" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
                    <SheetHeader className="relative p-6 pb-10">
                      <SheetTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                        <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg shadow-pink-900/20">
                          <Heart className="h-6 w-6 text-white" fill="white" />
                        </div>
                        My Wishlist
                      </SheetTitle>
                      <p className="text-white/80 text-sm mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs font-bold">
                          {wishlistItems.length}
                        </span>
                        {wishlistItems.length === 1 ? "item" : "items"} saved
                      </p>
                    </SheetHeader>
                    {/* Curved bottom edge */}
                    <div className="absolute -bottom-1 left-0 right-0 h-8 bg-linear-to-b from-zinc-50 to-white rounded-t-4xl" />
                  </div>

                  {wishlistItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-3xl bg-linear-to-br from-pink-100 via-rose-50 to-pink-100 flex items-center justify-center mb-6 shadow-xl shadow-pink-200/50">
                          <Heart className="h-14 w-14 text-pink-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center">
                          <span className="text-pink-600 text-lg">✨</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-zinc-500 mb-8 max-w-xs leading-relaxed">
                        Start adding items you love and they&apos;ll appear here
                      </p>
                      <Button
                        onClick={() => {
                          setIsWishlistOpen(false);
                          router.push("/shop");
                        }}
                        className="bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-6 rounded-2xl font-semibold shadow-xl shadow-pink-500/30 transition-all hover:shadow-2xl hover:shadow-pink-500/40 hover:-translate-y-1 active:scale-95"
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        Discover Products
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
                        {wishlistItems.map((item, index) => (
                          <div
                            key={item.id}
                            className="group relative bg-linear-to-br from-pink-50 via-rose-50 to-fuchsia-50 rounded-3xl overflow-hidden border-2 border-pink-100/80 hover:border-pink-200 shadow-lg shadow-pink-100/50 hover:shadow-xl hover:shadow-pink-200/60 transition-all duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {/* Top Section - Image and Quick Info */}
                            <div className="flex p-3 gap-3">
                              {/* Product Image - Larger and More Prominent */}
                              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-linear-to-br from-pink-100/50 to-rose-100/50 shrink-0 ring-2 ring-pink-200/50">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-pink-900/40 via-pink-900/10 to-transparent" />
                                {/* Price Tag on Image */}
                                <div className="absolute bottom-2 left-2 right-2">
                                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg border border-pink-100">
                                    <span className="text-lg font-bold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                      ${item.price.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                {/* Heart Badge */}
                                <div className="absolute top-2 left-2 p-2 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/40">
                                  <Heart
                                    className="h-3.5 w-3.5 text-white"
                                    fill="white"
                                  />
                                </div>
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0 py-1">
                                <h4 className="font-bold text-zinc-800 text-base leading-tight line-clamp-2 group-hover:text-pink-600 transition-colors">
                                  {item.name}
                                </h4>

                                {/* Saved label */}
                                <div className="mt-2 flex items-center gap-1.5">
                                  <span className="text-xs px-2.5 py-1 rounded-full bg-pink-200/60 text-pink-700 font-semibold border border-pink-200">
                                    ❤️ Saved
                                  </span>
                                </div>

                                {/* Delete Button - Top Right */}
                                <button className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 hover:bg-red-100 text-pink-400 hover:text-red-500 transition-all active:scale-90 shadow-sm border border-pink-100">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Bottom Section - Add to Cart Button */}
                            <div className="px-3 pb-3">
                              <Button className="w-full h-11 bg-linear-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-zinc-900/30 hover:shadow-xl hover:shadow-zinc-900/40 transition-all active:scale-[0.98] border border-zinc-700">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 pt-2 bg-white border-t border-zinc-100">
                        <Button
                          className="w-full h-14 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-semibold text-base shadow-xl shadow-pink-500/25 transition-all hover:shadow-2xl hover:shadow-pink-500/35 hover:-translate-y-0.5 active:scale-[0.98]"
                          onClick={() => {
                            setIsWishlistOpen(false);
                            router.push("/account/wishlist");
                          }}
                        >
                          View Full Wishlist
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </Button>
                      </div>
                    </>
                  )}
                </SheetContent>
              </Sheet>

              {/* Cart */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full bg-emerald-100 hover:bg-emerald-200 transition-all"
                  >
                    <ShoppingCart className="h-5 w-5" color="#10b981" />
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-105 p-0 flex flex-col border-l-0 bg-linear-to-b from-zinc-50 to-white"
                >
                  {/* Modern Gradient Header */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
                    <SheetHeader className="relative p-6 pb-10">
                      <SheetTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                        <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg shadow-emerald-900/20">
                          <ShoppingCart className="h-6 w-6 text-white" />
                        </div>
                        Shopping Cart
                      </SheetTitle>
                      <p className="text-white/80 text-sm mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs font-bold">
                          {cartItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </span>
                        {cartItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        ) === 1
                          ? "item"
                          : "items"}{" "}
                        in cart
                      </p>
                    </SheetHeader>
                    {/* Curved bottom edge */}
                    <div className="absolute -bottom-1 left-0 right-0 h-8 bg-linear-to-b from-zinc-50 to-white rounded-t-4xl" />
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-3xl bg-linear-to-br from-emerald-100 via-teal-50 to-emerald-100 flex items-center justify-center mb-6 shadow-xl shadow-emerald-200/50">
                          <ShoppingCart className="h-14 w-14 text-emerald-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center">
                          <span className="text-emerald-600 text-lg">🛒</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-zinc-500 mb-8 max-w-xs leading-relaxed">
                        Looks like you haven&apos;t added any items to your cart
                        yet
                      </p>
                      <Button
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push("/shop");
                        }}
                        className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 rounded-2xl font-semibold shadow-xl shadow-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-95"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
                        {cartItems.map((item, index) => (
                          <div
                            key={item.id}
                            className="group relative bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl overflow-hidden border-2 border-emerald-100/80 hover:border-emerald-200 shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:shadow-emerald-200/60 transition-all duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {/* Top Section - Image and Quick Info */}
                            <div className="flex p-3 gap-3">
                              {/* Product Image - Larger and More Prominent */}
                              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-linear-to-br from-emerald-100/50 to-teal-100/50 shrink-0 ring-2 ring-emerald-200/50">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-emerald-900/40 via-emerald-900/10 to-transparent" />
                                {/* Price Tag on Image */}
                                <div className="absolute bottom-2 left-2 right-2">
                                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg border border-emerald-100">
                                    <span className="text-lg font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                      ${item.price.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0 py-1">
                                <h4 className="font-bold text-zinc-800 text-base leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                  {item.name}
                                </h4>

                                {/* Item Total */}
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-200/60 text-emerald-700 font-semibold border border-emerald-200">
                                    💰 $
                                    {(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>

                                {/* Delete Button - Top Right */}
                                <button className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 hover:bg-red-100 text-emerald-400 hover:text-red-500 transition-all active:scale-90 shadow-sm border border-emerald-100">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Bottom Section - Quantity Controls */}
                            <div className="px-3 pb-3">
                              <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-emerald-100">
                                <span className="text-xs font-semibold text-emerald-700 pl-2">
                                  Quantity
                                </span>
                                <div className="flex items-center gap-1">
                                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 shadow-sm hover:shadow transition-all active:scale-90 border border-emerald-200 hover:border-emerald-300">
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <div className="w-12 h-9 flex items-center justify-center bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/40 border border-emerald-400">
                                    <span className="text-sm font-bold text-white">
                                      {item.quantity}
                                    </span>
                                  </div>
                                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 shadow-sm hover:shadow transition-all active:scale-90 border border-emerald-200 hover:border-emerald-300">
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cart Footer with Summary */}
                      <div className="bg-white border-t border-zinc-100 rounded-t-3xl -mt-2 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                        {/* Summary Section */}
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-500">Subtotal</span>
                            <span className="font-semibold text-zinc-700">
                              ${cartTotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-500">Shipping</span>
                            <span className="font-semibold text-emerald-600 flex items-center gap-1">
                              <span className="text-xs">🎉</span> Free
                            </span>
                          </div>
                          <div className="h-px bg-linear-to-r from-transparent via-zinc-200 to-transparent my-2" />
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-zinc-900 font-bold text-lg">
                              Total
                            </span>
                            <span className="text-3xl font-bold text-emerald-600">
                              ${cartTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-5 pt-0 space-y-3">
                          <Button
                            className="w-full h-14 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-semibold text-base shadow-xl shadow-emerald-500/25 transition-all hover:shadow-2xl hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:scale-[0.98]"
                            onClick={() => {
                              setIsCartOpen(false);
                              router.push("/checkout");
                            }}
                          >
                            Proceed to Checkout
                            <ChevronRight className="h-5 w-5 ml-2" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full h-11 text-zinc-500 hover:text-zinc-900 rounded-xl font-medium hover:bg-zinc-100 transition-all"
                            onClick={() => {
                              setIsCartOpen(false);
                              router.push("/cart");
                            }}
                          >
                            View Full Cart
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </SheetContent>
              </Sheet>

              {/* Divider */}
              <div className="h-8 w-px bg-zinc-200 mx-2 hidden md:block" />

              {/* User Menu */}
              {mounted && (
                <>
                  {loading ? (
                    <div className="h-10 w-10 rounded-full bg-zinc-200 animate-pulse" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-zinc-300 transition-all duration-300"
                        >
                          <Avatar className="h-10 w-10">
                            {user ? (
                              <>
                                <AvatarImage
                                  src={user.photoURL || ""}
                                  alt={user.displayName || ""}
                                />
                                <AvatarFallback className="bg-linear-to-br from-zinc-700 to-zinc-900 text-white text-sm font-semibold">
                                  {user.displayName?.charAt(0).toUpperCase() ||
                                    user.email?.charAt(0).toUpperCase() ||
                                    "U"}
                                </AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback className="bg-zinc-100 text-zinc-600">
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-72 p-0 overflow-hidden"
                        align="end"
                      >
                        {user ? (
                          <>
                            <DropdownMenuLabel className="p-0">
                              <div className="p-5 bg-linear-to-br from-zinc-900 to-zinc-800">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-14 w-14 ring-2 ring-white/20">
                                    <AvatarImage src={user.photoURL || ""} />
                                    <AvatarFallback className="bg-white/10 text-white text-lg">
                                      {user.displayName
                                        ?.charAt(0)
                                        .toUpperCase() || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                      {user.displayName || "User"}
                                    </p>
                                    <p className="text-xs text-zinc-400 truncate">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DropdownMenuLabel>
                            <div className="p-2">
                              {ACCOUNT_MENU.map((item) => (
                                <DropdownMenuItem
                                  key={item.href}
                                  asChild
                                  className="cursor-pointer"
                                >
                                  <Link
                                    href={item.href}
                                    className="flex items-center px-3 py-2.5 rounded-lg hover:bg-zinc-100"
                                  >
                                    <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center mr-3">
                                      <item.icon className="h-4 w-4 text-zinc-600" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-700">
                                      {item.label}
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </div>
                            <DropdownMenuSeparator className="m-0" />
                            <div className="p-2">
                              <DropdownMenuItem
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                                  <LogOut className="h-4 w-4 text-red-600" />
                                </div>
                                <span className="text-sm font-medium">
                                  Sign Out
                                </span>
                              </DropdownMenuItem>
                            </div>
                          </>
                        ) : (
                          <>
                            <DropdownMenuLabel className="p-6 bg-linear-to-br from-zinc-900 to-zinc-800">
                              <p className="text-lg font-bold text-white">
                                Welcome!
                              </p>
                              <p className="text-sm text-zinc-400 mt-1">
                                Sign in to access your account
                              </p>
                            </DropdownMenuLabel>
                            <div className="p-4 space-y-2">
                              <Button
                                asChild
                                className="w-full bg-zinc-900 hover:bg-zinc-800"
                              >
                                <Link href="/login">Sign In</Link>
                              </Button>
                              <Button
                                asChild
                                variant="outline"
                                className="w-full border-zinc-200"
                              >
                                <Link href="/register">Create Account</Link>
                              </Button>
                            </div>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-100">
          {/* Backdrop with blur and opacity */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Search Content */}
          <div className="relative z-10 flex flex-col items-center pt-20 md:pt-32 px-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Search Form */}
            <div className="w-full max-w-2xl">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full h-16 md:h-20 pl-16 pr-6 rounded-2xl bg-white text-lg md:text-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-zinc-100 text-zinc-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Popular Searches */}
              <div className="mt-8">
                <p className="text-white/60 text-sm font-medium mb-4">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/shop?search=${encodeURIComponent(term)}`);
                        setIsSearchOpen(false);
                      }}
                      className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-8">
                <p className="text-white/60 text-sm font-medium mb-4">
                  Quick Links
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: "New Arrivals", href: "/shop?filter=new" },
                    { name: "Best Sellers", href: "/shop?filter=best" },
                    { name: "On Sale", href: "/shop?filter=sale" },
                    { name: "All Products", href: "/shop" },
                  ].map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsSearchOpen(false)}
                      className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium text-center transition-all"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Press ESC hint */}
              <p className="mt-10 text-center text-white/40 text-sm">
                Press{" "}
                <kbd className="px-2 py-1 rounded bg-white/10 text-white/60 font-mono text-xs">
                  ESC
                </kbd>{" "}
                to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
