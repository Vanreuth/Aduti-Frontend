
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from '@/components/ui/button';
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
  { label: "Profile", href: "/account?tab=profile", icon: User },
  { label: "Orders", href: "/account?tab=orders", icon: Package },
  { label: "Settings", href: "/account?tab=settings", icon: Settings },
];

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-xl supports-backdrop-filter:bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-15 items-center justify-between">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-12">
              <Link href="/" className="flex items-center group">
                <div className="relative h-12 w-32 transition-transform group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt="MyStore Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                      isActive(link.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                    {link.name === "Deals" && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                        HOT
                      </span>
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
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all group"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 text-white text-xs font-bold">
                    2
                  </Badge>
                </Link>
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 hover:text-red-500 hover:bg-red-50 transition-all group hidden sm:flex"
                asChild
              >
                <Link href="/account/wishlist">
                  <Heart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs font-bold">
                    1
                  </Badge>
                </Link>
              </Button>

              <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />

              {mounted && (
                <>
                  {loading ? (
                    <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-blue-300 transition-all"
                        >
                          <Avatar className="h-10 w-10">
                            {user ? (
                              <>
                                <AvatarImage
                                  src={user.photoURL || ""}
                                  alt={user.displayName || ""}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                                  {user.displayName?.charAt(0).toUpperCase() ||
                                    user.email?.charAt(0).toUpperCase() ||
                                    "U"}
                                </AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white">
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-72" align="end">
                        {user ? (
                          <>
                            <DropdownMenuLabel className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={user.photoURL || ""} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    {user.displayName?.charAt(0).toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold truncate">
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
                                <DropdownMenuItem key={item.href} asChild>
                                  <Link href={item.href} className="flex items-center p-3">
                                    <item.icon className="h-4 w-4 mr-3" />
                                    {item.label}
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </div>
                            <DropdownMenuSeparator />
                            <div className="p-2">
                              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                <LogOut className="h-4 w-4 mr-3" />
                                Log out
                              </DropdownMenuItem>
                            </div>
                          </>
                        ) : (
                          <>
                            <DropdownMenuLabel className="p-4">
                              <p className="text-lg font-bold">Welcome!</p>
                              <p className="text-xs text-slate-600">Sign in to your account</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="p-2 space-y-2">
                              <Button asChild className="w-full">
                                <Link href="/login">Sign In</Link>
                              </Button>
                              <Button asChild variant="outline" className="w-full">
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

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">
                      MyStore
                    </SheetTitle>
                  </SheetHeader>

                  {user && (
                    <div className="py-6 border-b mb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={user.photoURL || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                            {user.displayName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator className="mb-4" />

                  <div className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <Button
                        key={link.href}
                        asChild
                        variant={isActive(link.href) ? "secondary" : "ghost"}
                        className="justify-start"
                      >
                        <Link href={link.href}>{link.name}</Link>
                      </Button>
                    ))}

                    <Separator className="my-2" />

                    {user ? (
                      <Button
                        variant="ghost"
                        className="justify-start text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    ) : (
                      <Button asChild className="mt-2">
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