"use client";

import CartItem from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Title from "@/components/common/Title";
import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, subtotal, clear, setQty, removeItem } = useCart();

  const handleClear = () => {
    const ok = window.confirm("Clear all items from your cart?");
    if (ok) clear();
  };

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <div className="text-3xl font-bold mb-8">
        <Title text1="SHOPPING CART" text2="" />
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={(id) => setQty(id, item.quantity + 1)}
                  onDecrease={(id) => setQty(id, item.quantity - 1)}
                  onRemove={(id) => removeItem(id)}
                />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Cart Totals</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <Button asChild className="w-full">
                  <Link href="/order">Proceed to Checkout</Link>
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={handleClear}
                >
                  Clear cart
                </Button>

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold mb-2">Your cart is empty 🛒</h2>
      <p className="text-muted-foreground">
        Looks like you haven’t added anything yet
      </p>

      <div className="mt-5 flex items-center justify-center gap-3">
        <Button asChild>
          <Link href="/shop">Go Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back Home</Link>
        </Button>
      </div>
    </div>
  );
}
