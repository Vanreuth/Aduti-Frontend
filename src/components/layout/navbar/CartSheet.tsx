"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export function CartSheet() {
  const router = useRouter();
  const { items, subtotal, totalItems, setQty, removeItem } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-zinc-900 text-white text-[10px] font-bold grid place-items-center">
            {totalItems}
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5" />
            Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center p-6 text-center">
            <div>
              <ShoppingCart className="h-16 w-16 text-zinc-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <p className="text-sm text-zinc-500 mt-2">
                Add some products to get started
              </p>
              <Button className="mt-5" onClick={() => router.push("/shop")}>
                Start Shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
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

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          className="p-2 hover:bg-zinc-100"
                          onClick={() => setQty(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="p-2 hover:bg-zinc-100"
                          onClick={() => setQty(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto text-red-500 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Subtotal</span>
                <span className="text-xl font-bold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => router.push("/cart")}>
                  View Cart
                </Button>
                <Button
                  className="bg-zinc-900 hover:bg-zinc-800"
                  onClick={() => router.push("/order")}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
