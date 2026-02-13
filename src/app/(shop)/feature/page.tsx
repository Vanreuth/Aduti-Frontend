"use client";
import {
  Truck,
  Shield,
  Headphones,
  RefreshCw,
  Award,
  Zap,
  Globe,
  Heart,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mainFeatures = [
  {
    icon: Truck,
    title: "Free Shipping",
    description:
      "Free shipping on all orders over $50. Fast and reliable delivery to your doorstep.",
    color: "bg-blue-500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description:
      "Your payment information is processed securely with industry-standard encryption.",
    color: "bg-emerald-500",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description:
      "30-day hassle-free return policy. Not satisfied? Get a full refund.",
    color: "bg-rose-500",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our customer support team is available around the clock to help you.",
    color: "bg-orange-500",
  },
];

const additionalFeatures = [
  {
    icon: Zap,
    title: "Fast Checkout",
    description: "Quick and easy checkout process with saved payment methods.",
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    description: "We ship to over 100 countries worldwide.",
  },
  {
    icon: Heart,
    title: "Wishlist",
    description: "Save your favorite items and get notified about price drops.",
  },
  {
    icon: Package,
    title: "Order Tracking",
    description: "Track your orders in real-time from dispatch to delivery.",
  },
  {
    icon: Clock,
    title: "Quick Delivery",
    description: "Express delivery options available for urgent orders.",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "All products are quality checked before shipping.",
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products" },
  { value: "100+", label: "Countries" },
  { value: "99%", label: "Satisfaction Rate" },
];

const howItWorks = [
  {
    step: "01",
    title: "Browse",
    desc: "Explore our wide range of products",
  },
  { step: "02", title: "Select", desc: "Add items to your cart" },
  {
    step: "03",
    title: "Checkout",
    desc: "Secure payment processing",
  },
  {
    step: "04",
    title: "Receive",
    desc: "Fast delivery to your door",
  },
];

export default function Features() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#f2f4f7] via-[#f8f9fb] to-[#f2f4f7]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1f2937] px-4 py-16 text-white sm:py-20 md:py-24">
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>
        <div className="absolute -left-28 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-[12%] top-[15%] h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Why Choose <span className="text-emerald-400">Aditi</span>?
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-base text-zinc-300 sm:text-lg md:text-xl">
            We&apos;re committed to providing you with the best shopping
            experience. Discover the features that make us stand out from the
            rest.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-white px-8 text-zinc-900 hover:bg-zinc-100 sm:w-auto"
            >
              <Link href="/shop">Start Shopping</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full border-zinc-600 bg-transparent px-8 text-white hover:bg-zinc-800 sm:w-auto"
            >
              <Link href="/contact">Talk to Support</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="bg-gradient-to-b from-transparent via-[#f7f9fc] to-[#eef2f6] px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 md:text-4xl">
              Our Core Features
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-600">
              Everything you need for a seamless shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-7"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-zinc-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-[#eceff4] via-[#f6f8fb] to-[#eceff4] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-sm sm:p-6"
              >
                <div className="mb-2 text-3xl font-bold text-zinc-900 sm:text-4xl md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-zinc-600 sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] to-[#f3f6fa] px-4 py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 md:text-4xl">
              More Features
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-600">
              Discover all the ways we make your shopping experience better
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-colors duration-300 hover:bg-zinc-50 sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 shadow-sm">
                  <feature.icon className="h-6 w-6 text-zinc-700" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-zinc-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-[#edf1f6] to-[#f7f9fc] px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-600">
              Shopping with us is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600">{item.desc}</p>
                {index < 3 && (
                  <div
                    className="absolute -right-1/2 top-7 hidden h-0.5 w-full -translate-y-1/2 bg-zinc-200 lg:block"
                    style={{ left: "58%", width: "84%" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-[#f7f9fc] to-[#eef2f6] px-4 py-14 sm:py-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 px-6 py-12 text-center text-white sm:px-10 sm:py-16">
          <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-4 py-2 text-sm font-medium text-emerald-200">
            <CheckCircle className="h-4 w-4" />
            Join thousands of happy customers
          </div>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Start Shopping?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-zinc-300">
            Experience the best online shopping with premium products, fast
            delivery, and excellent customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-8 text-zinc-900 hover:bg-zinc-100"
            >
              <Link href="/shop">Browse Products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-zinc-600 bg-transparent px-8 text-white hover:bg-zinc-800"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
