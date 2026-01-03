"use client";

import Link from "next/link";
import { Heart, LogOut, ShoppingCart, ChevronRight } from "lucide-react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose, // ✅ ADD THIS
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePathname, useRouter } from "next/navigation";

export function MobileMenuSheet({
  links,
}: {
  links: { name: string; href: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const linkClass = (active: boolean) =>
    [
      "group flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition",
      active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100",
    ].join(" ");

  return (
    <SheetContent side="left" className="w-60 p-0">
      <SheetHeader className="bg-gradient-to-br from-zinc-900 to-zinc-800">
        <SheetTitle className="text-2xl font-bold text-white text-left">
          Additi
        </SheetTitle>
      </SheetHeader>

      {user && (
        <div className=" bg-zinc-50 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback className="bg-zinc-900 text-white">
                {user.displayName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-zinc-900 truncate">
                {user.displayName || "User"}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col px-2">
        {/* Main links */}
        <div className="space-y-1">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <SheetClose asChild key={link.href}>
                <Link href={link.href} className={linkClass(active)}>
                  <span>{link.name}</span>
                  <ChevronRight
                    className={[
                      "h-4 w-4 transition",
                      active
                        ? "opacity-80"
                        : "opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5",
                    ].join(" ")}
                  />
                </Link>
              </SheetClose>
            );
          })}
        </div>

        <Separator className="my-3" />

        {/* Cart */}
        <SheetClose asChild>
          <Link href="/cart" className={linkClass(isActive("/cart"))}>
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </span>
            <Badge className="bg-zinc-900 text-white text-xs">
              {totalItems}
            </Badge>
          </Link>
        </SheetClose>

        {/* Wishlist */}
        <SheetClose asChild>
          <Link href="/wishlist" className={linkClass(isActive("/wishlist"))}>
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </span>
            <Badge className="bg-red-500 text-white text-xs">
              {wishlistItems.length}
            </Badge>
          </Link>
        </SheetClose>

        <Separator className="my-3" />

        {/* Auth actions */}
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        ) : (
          <div className="space-y-2">
            <SheetClose asChild>
              <Button className="w-full bg-zinc-900 hover:bg-zinc-800">
                <Link href="/login">Sign In</Link>
              </Button>
            </SheetClose>

            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                <Link href="/register">Create Account</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </div>
    </SheetContent>
  );
}
