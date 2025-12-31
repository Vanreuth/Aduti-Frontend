"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  LogOut,
  User,
  Package,
  Settings,
  X,
  ChevronRight,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
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

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

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
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist - Hidden on mobile */}
              <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 hidden sm:flex"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                      {wishlistItems.length}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-96 p-0 flex flex-col"
                >
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                      <Heart className="h-5 w-5 text-red-500" />
                      Wishlist ({wishlistItems.length})
                    </SheetTitle>
                  </SheetHeader>

                  {wishlistItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <Heart className="h-16 w-16 text-zinc-200 mb-4" />
                      <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-sm text-zinc-500 mb-6">
                        Save items you love to your wishlist
                      </p>
                      <Button
                        onClick={() => {
                          setIsWishlistOpen(false);
                          router.push("/shop");
                        }}
                      >
                        Browse Products
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto p-4 space-y-4">
                        {wishlistItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
                          >
                            <div className="h-20 w-20 rounded-lg overflow-hidden bg-white shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={100}
                                height={100}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-zinc-900 truncate">
                                {item.name}
                              </h4>
                              <p className="text-lg font-semibold text-zinc-900 mt-1">
                                ${item.price.toFixed(2)}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs"
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  Add to Cart
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t">
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => {
                            setIsWishlistOpen(false);
                            router.push("/account/wishlist");
                          }}
                        >
                          View Full Wishlist
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
                    className="relative rounded-full hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-zinc-900 text-white text-[10px] font-bold">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-96 p-0 flex flex-col"
                >
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                      <ShoppingCart className="h-5 w-5" />
                      Shopping Cart ({cartItems.length})
                    </SheetTitle>
                  </SheetHeader>

                  {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <ShoppingCart className="h-16 w-16 text-zinc-200 mb-4" />
                      <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-sm text-zinc-500 mb-6">
                        Add some products to get started
                      </p>
                      <Button
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push("/shop");
                        }}
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto p-4 space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 p-3 rounded-xl bg-zinc-50"
                          >
                            <div className="h-20 w-20 rounded-lg overflow-hidden bg-white shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={100}
                                height={100}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-zinc-900 truncate">
                                {item.name}
                              </h4>
                              <p className="text-lg font-semibold text-zinc-900 mt-1">
                                ${item.price.toFixed(2)}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center border rounded-lg">
                                  <button className="p-1.5 hover:bg-zinc-100 transition-colors">
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="px-3 text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  <button className="p-1.5 hover:bg-zinc-100 transition-colors">
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-600">Subtotal</span>
                          <span className="text-xl font-bold text-zinc-900">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsCartOpen(false);
                              router.push("/cart");
                            }}
                          >
                            View Cart
                          </Button>
                          <Button
                            className="bg-zinc-900 hover:bg-zinc-800"
                            onClick={() => {
                              setIsCartOpen(false);
                              router.push("/checkout");
                            }}
                          >
                            Checkout
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
