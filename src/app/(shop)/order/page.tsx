"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, CreditCard, Truck, MapPin, ChevronRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Mock Data
const INITIAL_CART = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.00,
    quantity: 1,
    image: "/images/headphones.jpg", // Replace with real path
    color: "Black"
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 185.50,
    quantity: 1,
    image: "/images/chair.jpg",
    color: "Gray"
  }
];

export default function OrderPage() {
  const [cart] = useState(INITIAL_CART);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = 15.00;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    alert("Order placed successfully!");
    setLoading(false);
    // Redirect to success page here
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Link href="/cart" className="hover:text-gray-900">Cart</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Information & Payment</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure 256-bit SSL Encrypted</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="lg:grid lg:grid-cols-12 lg:gap-8">
          
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
                  <Input id="address" placeholder="123 Main St, Apt 4B" required />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">NY</SelectItem>
                        <SelectItem value="ca">CA</SelectItem>
                        <SelectItem value="tx">TX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-1 col-span-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input id="zip" placeholder="10001" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
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
                  defaultValue="card" 
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Card
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                    <Label
                      htmlFor="paypal"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                    >
                      {/* SVG for PayPal logo typically goes here */}
                      <span className="mb-3 text-xl font-bold italic">Pay<span className="text-blue-600">Pal</span></span>
                      PayPal
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                    <Label
                      htmlFor="cod"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                    >
                      <Truck className="mb-3 h-6 w-6" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {/* Card Details Form (Conditional) */}
                {paymentMethod === 'card' && (
                  <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
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
                  <CardTitle className="text-base">Order Notes (Optional)</CardTitle>
               </CardHeader>
               <CardContent>
                  <Textarea placeholder="Special instructions for delivery..." className="resize-none" />
               </CardContent>
            </Card>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="sticky top-8">
              <Card className="shadow-lg border-0 bg-white ring-1 ring-gray-200">
                <CardHeader className="bg-gray-50/50 pb-4 border-b">
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your items before paying</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6 grid gap-6">
                  {/* Cart Items List */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border">
                           {/* Placeholder for Next/Image */}
                           <span className="text-xs text-gray-400">IMG</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">Color: {item.color}</p>
                          <div className="flex justify-between items-center mt-2">
                             <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                             <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  {/* Coupon Code Input */}
                  <div className="flex gap-2">
                     <Input placeholder="Discount code" className="bg-gray-50" />
                     <Button variant="outline" type="button">Apply</Button>
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
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50/50 pt-6 pb-6 border-t">
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg" disabled={loading}>
                    {loading ? (
                       <span className="flex items-center gap-2">Processing...</span>
                    ) : (
                       <span>Pay ${total.toFixed(2)}</span>
                    )}
                  </Button>
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
      </div>
    </div>
  );
}