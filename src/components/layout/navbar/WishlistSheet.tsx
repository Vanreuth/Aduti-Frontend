"use client";

import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export function WishlistSheet() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hidden sm:flex"
        >
          <Heart className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">
            {items.length}
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-5 w-5 text-red-500" />
            Wishlist ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center p-6 text-center">
            <div>
              <Heart className="h-16 w-16 text-zinc-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
              <p className="text-sm text-zinc-500 mt-2">
                Save items you love to your wishlist
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {items.map((item) => (
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
                  <h4 className="font-medium truncate">{item.name}</h4>
                  <p className="text-lg font-semibold mt-1">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        });
                        remove(item.id);
                      }}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(item.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
