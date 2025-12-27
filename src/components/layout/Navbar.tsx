"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  LogOut,
  User,
  Package,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button"
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
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Product", href: "/product" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const ACCOUNT_MENU = [
  { label: "Profile", href: "/account?tab=profile", icon: User },
  { label: "Orders", href: "/account?tab=orders", icon: Package },
  { label: "Settings", href: "/account?tab=settings", icon: Settings },
];

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-center py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex-1 text-center">
            Free shipping for standard order over $100
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/help"
              className="hover:text-gray-300 transition-colors"
            >
              Help & FAQs
            </Link>
            <Link
              href={user ? "/account" : "/login"}
              className="hover:text-gray-300 transition-colors"
            >
              My Account
            </Link>
            <select className="bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer">
              <option value="EN">EN</option>
              <option value="FR">FR</option>
            </select>
            <select className="bg-transparent border-none text-white text-sm focus:outline-none cursor-pointer">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-xl supports-backdrop-filter:bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-12">
              <Link href="/" className="flex items-center group">
                <button className="text-2xl font-bold">MyStore</button>
              </Link>

              <div className="hidden lg:flex items-center gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                    {link.name === "Shop" && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                        HOT
                      </span>
                    )}
                    {isActive(link.href) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Icons & User Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all hover:scale-110"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all hover:scale-110 group"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg text-xs font-bold group-hover:scale-110 transition-transform">
                    2
                  </Badge>
                </Link>
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 hover:text-red-500 hover:bg-red-50 transition-all hover:scale-110 group"
                asChild
              >
                <Link href="/account/wishlist">
                  <Heart className="h-5 w-5 group-hover:fill-red-500 transition-all" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg text-xs font-bold group-hover:scale-110 transition-transform">
                    1
                  </Badge>
                </Link>
              </Button>

              <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />

              {loading ? (
                <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-blue-300 hover:shadow-lg transition-all"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-blue-100 hover:ring-blue-200 transition-all">
                        {user ? (
                          <>
                            <AvatarImage
                              src={user.photoURL || ""}
                              alt={user.displayName || ""}
                            />
                            <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                              {user.displayName?.charAt(0).toUpperCase() ||
                                user.email?.charAt(0).toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </>
                        ) : (
                          <AvatarFallback className="bg-linear-to-br from-slate-400 to-slate-500 text-white text-sm font-semibold">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-72 shadow-xl border-slate-200"
                    align="end"
                    forceMount
                  >
                    {user ? (
                      <>
                        <DropdownMenuLabel className="font-normal p-4 bg-linear-to-br from-blue-50 to-purple-50 rounded-t-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                              <AvatarImage
                                src={user.photoURL || ""}
                                alt={user.displayName || ""}
                              />
                              <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {user.displayName?.charAt(0).toUpperCase() ||
                                  user.email?.charAt(0).toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-1 flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">
                                {user.displayName || "User"}
                              </p>
                              <p className="text-xs text-slate-600 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                          {ACCOUNT_MENU.map((item) => (
                            <DropdownMenuItem
                              key={item.href}
                              asChild
                              className="cursor-pointer rounded-lg p-3 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all group"
                            >
                              <Link
                                href={item.href}
                                className="flex items-center"
                              >
                                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-all group-hover:scale-110">
                                  <item.icon className="h-4 w-4 text-blue-700" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                    {item.label}
                                  </span>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                          <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer rounded-lg p-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all group"
                          >
                            <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 group-hover:bg-red-200 transition-all group-hover:scale-110">
                              <LogOut className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="font-semibold">Log out</span>
                          </DropdownMenuItem>
                        </div>
                      </>
                    ) : (
                      <>
                        <DropdownMenuLabel className="font-normal p-4 bg-linear-to-br from-blue-50 to-purple-50 rounded-t-lg">
                          <div className="text-center">
                            <p className="text-lg font-bold text-slate-900 mb-1">
                              Welcome!
                            </p>
                            <p className="text-xs text-slate-600">
                              Sign in to access your account
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="p-2 space-y-2">
                          <DropdownMenuItem
                            asChild
                            className="cursor-pointer rounded-lg p-0 focus:bg-transparent"
                          >
                            <Link
                              href="/login"
                              className="flex items-center justify-center w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                            >
                              Sign In
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            className="cursor-pointer rounded-lg p-0 focus:bg-transparent"
                          >
                            <Link
                              href="/register"
                              className="flex items-center justify-center w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-lg border-2 border-slate-300 hover:border-slate-400 transition-all"
                            >
                              Create Account
                            </Link>
                          </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                          <DropdownMenuItem
                            asChild
                            className="cursor-pointer rounded-lg p-3 hover:bg-slate-50 transition-all"
                          >
                            <Link
                              href="/account/orders"
                              className="flex items-center"
                            >
                              <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                <Package className="h-4 w-4 text-slate-600" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-900">
                                  Track Order
                                </span>
                                <span className="text-xs text-slate-500">
                                  Check order status
                                </span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        </div>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-75 sm:w-100">
                  <SheetHeader>
                    <SheetTitle className="text-left text-2xl font-bold">
                      COZA{" "}
                      <span className="font-light text-slate-500">STORE</span>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Mobile User Info */}
                  {user && (
                    <div className="py-6 border-b border-slate-200 mb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-14 w-14 ring-2 ring-blue-100">
                          <AvatarImage src={user.photoURL || ""} />
                          <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                            {user.displayName?.charAt(0).toUpperCase() ||
                              user.email?.charAt(0).toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {ACCOUNT_MENU.slice(0, 2).map((item) => (
                          <Button
                            key={item.href}
                            variant="outline"
                            size="sm"
                            asChild
                            className="justify-start bg-white hover:bg-slate-50 border-slate-200"
                          >
                            <Link
                              href={item.href}
                              className="flex items-center"
                            >
                              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded bg-slate-100">
                                <item.icon className="h-3.5 w-3.5 text-slate-600" />
                              </div>
                              {item.label}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="mb-4" />

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <Button
                        key={link.href}
                        asChild
                        variant={isActive(link.href) ? "secondary" : "ghost"}
                        className={`justify-start text-base h-11 rounded-lg transition-all ${
                          isActive(link.href)
                            ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <Link href={link.href}>{link.name}</Link>
                      </Button>
                    ))}

                    <Separator className="my-2" />

                    {user ? (
                      <Button
                        variant="ghost"
                        className="justify-start text-base h-11 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        onClick={handleLogout}
                      >
                        <div className="mr-2 flex h-6 w-6 items-center justify-center rounded bg-red-50">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        Sign Out
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="mt-2 w-full h-11 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
