import CartItem from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Title from "@/components/common/Title";

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

export default function CartPage() {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="max-w-7xl mx-auto py-16">
      <div className="text-3xl font-bold mb-8">
        <Title text1={"SHOPPING CART"} text2={""} />
      </div>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="border rounded-xl p-6 space-y-4 sticky top-24">
              <h2 className="text-xl font-semibold">Cart Totals</h2>

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Button asChild className="w-full mt-4">
                <Link href="/order">Proceed to Checkout</Link>
              </Button>

              <Link
                href="/shop"
                className="block text-center text-sm text-muted-foreground hover:text-primary"
              >
                Continue Shopping
              </Link>
            </div>
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
    </div>
  );
}
