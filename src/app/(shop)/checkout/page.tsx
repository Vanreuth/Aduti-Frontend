"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "@/context/CartContext";
import {
  createCheckout,
  generateKHQR,
  verifyPayment,
} from "@/lib/api/checkout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, ShoppingCart, AlertCircle } from "lucide-react";

type CheckoutStep =
  | "cart"
  | "generating"
  | "payment"
  | "verifying"
  | "success"
  | "error";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [khqrCode, setKhqrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

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
      setStep("verifying");

      pollingRef.current = setInterval(async () => {
        try {
          const result = await verifyPayment(orderId, paymentId);
          if (result.status === "COMPLETED") {
            // Payment confirmed
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            setStep("success");
            clear(); // Clear the cart
          }
        } catch (err) {
          console.error("Verification error:", err);
          // Continue polling on error - backend might be temporarily unavailable
        }
      }, 3000); // Poll every 3 seconds
    },
    [clear],
  );

  // Handle checkout process
  const handleCheckout = async () => {
    if (items.length === 0) return;

    setError(null);
    setStep("generating");

    try {
      // Step 1: Create order
      const cartPayload = {
        shippingAddress: "Default Address - Please update",
        phoneNumber: "000000000",
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

      // Step 2: Generate KHQR
      const khqrResult = await generateKHQR(orderIdStr);
      setKhqrCode(khqrResult.khqrCode);
      setPaymentId(String(khqrResult.id));
      setStep("payment");

      // Step 3: Start polling for payment verification
      startPolling(orderIdStr, String(khqrResult.id));
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Checkout failed");
      setStep("error");
    }
  };

  // Render cart summary
  const renderCartSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Your cart is empty</p>
            <Button
              variant="link"
              onClick={() => router.push("/shop")}
              className="mt-2"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Button onClick={handleCheckout} className="w-full mt-6" size="lg">
              Proceed to Payment
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );

  // Render generating state
  const renderGenerating = () => (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Generating payment QR code...</p>
          <p className="text-sm text-muted-foreground">Please wait a moment</p>
        </div>
      </CardContent>
    </Card>
  );

  // Render QR payment screen
  const renderPayment = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Scan to Pay with KHQR</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          {khqrCode && (
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <QRCodeSVG
                value={khqrCode}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
          )}
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">
              Amount: ${subtotal.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              Scan with Bakong or any supported banking app
            </p>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Waiting for payment confirmation...</span>
          </div>
          <p className="text-xs text-muted-foreground">Order ID: {orderId}</p>
        </div>
      </CardContent>
    </Card>
  );

  // Render success screen
  const renderSuccess = () => (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-green-600">
            Payment Successful!
          </h2>
          <p className="text-muted-foreground">Thank you for your purchase.</p>
          <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => router.push("/order")}>View Orders</Button>
            <Button variant="outline" onClick={() => router.push("/shop")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render error screen
  const renderError = () => (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-bold text-red-600">Checkout Failed</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {error || "An error occurred during checkout. Please try again."}
          </p>
          <Button onClick={() => setStep("cart")} className="mt-4">
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container max-w-lg mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {step === "cart" && renderCartSummary()}
      {step === "generating" && renderGenerating()}
      {(step === "payment" || step === "verifying") && renderPayment()}
      {step === "success" && renderSuccess()}
      {step === "error" && renderError()}
    </div>
  );
}
