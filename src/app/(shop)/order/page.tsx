"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Truck,
  MapPin,
  ChevronRight,
  ShieldCheck,
  QrCode,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  createCheckout,
  generateKHQR,
  verifyPayment,
} from "@/lib/api/checkout";

export default function OrderPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("khqr");

  // Form fields
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // KHQR payment states
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [khqrCode, setKhqrCode] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<"form" | "qr" | "success">(
    "form",
  );
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const pollAttemptsRef = useRef<number>(0);
  const MAX_POLL_ATTEMPTS = 60; // 5 minutes at 5 second intervals

  // Calculations
  const shippingCost = 0; // Free shipping
  const tax = subtotal * 0.0; // No tax for now
  const total = subtotal + shippingCost + tax;

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Poll for payment verification
  const startPolling = useCallback(
    (orderId: string, paymentId: string) => {
      pollAttemptsRef.current = 0;

      pollingRef.current = setInterval(async () => {
        pollAttemptsRef.current++;
        console.log(
          `[KHQR] Poll attempt ${pollAttemptsRef.current}/${MAX_POLL_ATTEMPTS}`,
        );

        // Timeout after max attempts
        if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
          console.log("[KHQR] Polling timeout reached");
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          setError(
            "Payment verification timed out. Please check your order status.",
          );
          return;
        }

        try {
          const payment = await verifyPayment(orderId, paymentId);
          console.log("[KHQR] Verification response:", JSON.stringify(payment));

          // Backend returns status === 'COMPLETED' when payment is successful
          if (payment.status === "COMPLETED") {
            console.log("[KHQR] Payment COMPLETED, clearing interval");
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            setPaymentStep("success");
            clear();
          }
        } catch (err) {
          console.error("Verification error:", err);
        }
      }, 5000); // Poll every 5 seconds
    },
    [clear],
  );

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!user) {
      router.push("/login?redirect=/order");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === "khqr") {
        // Step 1: Create order
        const cartPayload = {
          shippingAddress,
          phoneNumber,
          paymentMethod: "KHQR" as const,
          items: items.map((item) => ({
            productId: Number(item.id),
            productVariantId: null,
            quantity: item.quantity,
          })),
        };

        const checkoutResult = await createCheckout(cartPayload);
        const orderIdStr = String(checkoutResult.id);
        setOrderId(orderIdStr);
        console.log("[KHQR] Order created, orderId:", orderIdStr);

        // Step 2: Generate KHQR
        const khqrResult = await generateKHQR(orderIdStr);
        console.log("[KHQR] KHQR generated:", JSON.stringify(khqrResult));
        console.log(
          "[KHQR] paymentId:",
          khqrResult.id,
          "md5Hash:",
          khqrResult.md5Hash,
        );

        setKhqrCode(khqrResult.khqrCode);
        setPaymentId(String(khqrResult.id));
        setPaymentStep("qr");

        // Step 3: Start polling for payment verification
        startPolling(orderIdStr, String(khqrResult.id));
      } else {
        // Handle other payment methods (COD, Card)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert("Order placed successfully!");
        clear();
        router.push("/");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Checkout failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb / Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Link href="/cart" className="hover:text-gray-900">
                Cart
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">
                Information & Payment
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure 256-bit SSL Encrypted</span>
          </div>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="lg:grid lg:grid-cols-12 lg:gap-8"
        >
          {/* Left Column: Input Forms */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Shipping Information */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, Apt 4B"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Payment Method */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  defaultValue="khqr"
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="khqr"
                      id="khqr"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="khqr"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                    >
                      <QrCode className="mb-3 h-6 w-6" />
                      KHQR (Bakong)
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Card
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="cod"
                      id="cod"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cod"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                    >
                      <Truck className="mb-3 h-6 w-6" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {/* KHQR Info */}
                {paymentMethod === "khqr" && (
                  <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                    <p className="font-medium">
                      Pay with Bakong or any KHQR-supported bank app
                    </p>
                    <p className="mt-1 text-blue-600">
                      A QR code will be generated after you click &quot;Place
                      Order&quot;
                    </p>
                  </div>
                )}

                {/* Card Details Form (Conditional) */}
                {paymentMethod === "card" && (
                  <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC / CVV</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3. Delivery Notes */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">
                  Order Notes (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Special instructions for delivery..."
                  className="resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="sticky top-8">
              <Card className="shadow-lg border-0 bg-white ring-1 ring-gray-200">
                <CardHeader className="bg-gray-50/50 pb-4 border-b">
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Review your items before paying
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 grid gap-6">
                  {/* Cart Items List */}
                  <div className="space-y-4 max-h-75 overflow-y-auto pr-2">
                    {items.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        Your cart is empty
                      </p>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border overflow-hidden relative">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">IMG</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                              {item.name}
                            </h4>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-sm font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                      {error}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-gray-50/50 pt-6 pb-6 border-t">
                  {!user ? (
                    <Button
                      type="button"
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg"
                      onClick={() => router.push("/login?redirect=/order")}
                    >
                      Log in to Place Order
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg"
                      disabled={loading || items.length === 0}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span>Place Order - ${total.toFixed(2)}</span>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Trust Badges */}
              <div className="mt-6 flex justify-center gap-4 grayscale opacity-60">
                {/* Icons for Visa, Mastercard, etc. could go here */}
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </form>

        {/* KHQR Payment Modal */}
        {paymentStep === "qr" && khqrCode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader className="text-center">
                <CardTitle>Scan to Pay with KHQR</CardTitle>
                <CardDescription>
                  Use Bakong or any supported banking app
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <QRCodeSVG
                    value={khqrCode}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Waiting for payment...</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>Order ID: {orderId}</p>
                  <p>Payment ID: {paymentId}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Screen */}
        {paymentStep === "success" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-4 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <h2 className="text-2xl font-bold text-green-600">
                    Payment Successful!
                  </h2>
                  <p className="text-gray-600">Thank you for your purchase.</p>
                  <p className="text-sm text-gray-500">Order ID: {orderId}</p>
                  <div className="flex gap-3 mt-4">
                    <Button onClick={() => router.push("/shop")}>
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
