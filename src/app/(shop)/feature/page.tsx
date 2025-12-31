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
    color: "bg-purple-500",
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

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-zinc-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Why Choose <span className="text-emerald-400">Aduti</span>?
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-8">
            We&apos;re committed to providing you with the best shopping
            experience. Discover the features that make us stand out from the
            rest.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full px-8"
          >
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Our Core Features
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Everything you need for a seamless shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 hover:shadow-xl transition-all duration-500"
              >
                <div
                  className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-zinc-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-zinc-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              More Features
            </h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Discover all the ways we make your shopping experience better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <feature.icon className="w-6 h-6 text-zinc-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">
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
      <section className="py-20 px-4 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Shopping with us is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
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
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="text-6xl font-bold text-zinc-800 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
                {index < 3 && (
                  <div
                    className="hidden md:block absolute top-8 right-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2"
                    style={{ left: "60%", width: "80%" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Join thousands of happy customers
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-zinc-600 mb-8 max-w-2xl mx-auto">
            Experience the best online shopping with premium products, fast
            delivery, and excellent customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-zinc-900 hover:bg-zinc-800 rounded-full px-8"
            >
              <Link href="/shop">Browse Products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
