"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

type ComingSoonSectionProps = {
  products: Product[];
  loading: boolean;
};

const PLACEHOLDER_IMAGE = "/product/placeholder.svg";

function parseAvailableDate(value?: string | null) {
  if (!value?.trim()) return null;

  const normalized = value.trim().replace(" ", "T");
  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  return null;
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function getPrimaryImage(product: Product) {
  const image = product.variants?.flatMap((variant) => variant.images ?? [])[0];
  return image?.imageUrl ?? PLACEHOLDER_IMAGE;
}

function getDisplayPrice(product: Product) {
  const variantPrices = (product.variants ?? []).map(
    (variant) => variant.finalPrice ?? product.price,
  );
  const minVariantPrice =
    variantPrices.length > 0 ? Math.min(...variantPrices) : product.price;

  return minVariantPrice;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function ComingSoonSection({
  products,
  loading,
}: ComingSoonSectionProps) {
  const [now, setNow] = useState(() => Date.now());

  const heroProduct = useMemo(() => {
    if (!products.length) return null;

    const bySoonestLaunch = [...products].sort((a, b) => {
      const dateA = parseAvailableDate(a.availableDate)?.getTime() ?? Number.POSITIVE_INFINITY;
      const dateB = parseAvailableDate(b.availableDate)?.getTime() ?? Number.POSITIVE_INFINITY;
      return dateA - dateB;
    });

    return bySoonestLaunch[0];
  }, [products]);

  const launchDate = useMemo(() => {
    if (!heroProduct) return null;
    const parsed = parseAvailableDate(heroProduct.availableDate);
    return parsed && parsed.getTime() > now ? parsed : null;
  }, [heroProduct, now]);

  useEffect(() => {
    if (!heroProduct) return;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [heroProduct]);

  if (loading) {
    return (
      <section className="w-full px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_360px]">
            <div className="hidden h-56 animate-pulse rounded-2xl bg-white/70 lg:block" />
            <div className="h-72 animate-pulse rounded-2xl bg-white/75 sm:h-80" />
            <div className="h-72 animate-pulse rounded-2xl bg-white/70 sm:h-80" />
          </div>
        </div>
      </section>
    );
  }

  if (!heroProduct) {
    return null;
  }

  const countdownMs = launchDate ? launchDate.getTime() - now : 0;
  const countdown = formatCountdown(countdownMs);
  const price = getDisplayPrice(heroProduct);
  const categories = Array.from(
    new Set(products.map((product) => product.category?.name).filter(Boolean)),
  ).slice(0, 3) as string[];
  const sideLabels = categories.length
    ? categories
    : ["New Collection", "Coming Soon", "Accessories"];
  const activeLabelIndex = Math.min(1, Math.max(0, sideLabels.length - 1));

  return (
    <section className="w-full px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-[#efeeeb] p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[220px_minmax(0,1fr)_360px]">
          <aside className="hidden rounded-2xl bg-white/70 p-8 lg:block">
            <ul className="space-y-6">
              {sideLabels.map((label, index) => (
                <li
                  key={label}
                  className={
                    index === activeLabelIndex
                      ? "text-4xl font-semibold text-zinc-900"
                      : "text-4xl font-medium text-zinc-400"
                  }
                >
                  {label}
                </li>
              ))}
            </ul>
          </aside>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white/70 p-5 sm:p-7">
              <Image
                src={getPrimaryImage(heroProduct)}
                alt={heroProduct.name}
                fill
                className="object-contain p-6 sm:p-8"
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 60vw, 90vw"
                quality={90}
              />
            </div>
            <div className="absolute right-3 top-3 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg sm:h-28 sm:w-28">
              <span className="text-sm tracking-wide text-zinc-200">Sale Of</span>
              <span className="text-3xl font-bold leading-none">
                {currencyFormatter.format(price)}
              </span>
            </div>
          </div>

          <div className="space-y-7">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500 sm:text-sm">
              Deal Of The Week
            </p>
            <h2 className="text-3xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
              {heroProduct.name}
            </h2>

            {launchDate ? (
              <div className="space-y-3">
                <div className="flex items-baseline gap-3 sm:gap-4">
                  {[
                    { value: countdown.days, label: "Days" },
                    { value: countdown.hours, label: "Hours" },
                    { value: countdown.minutes, label: "Minutes" },
                    { value: countdown.seconds, label: "Seconds" },
                  ].map((item, index, arr) => (
                    <div key={item.label} className="flex items-baseline gap-3 sm:gap-4">
                      <div className="text-left">
                        <p className="text-3xl font-semibold text-zinc-900 sm:text-5xl">
                          {item.value}
                        </p>
                        <p className="mt-2 text-sm text-zinc-600">{item.label}</p>
                      </div>
                      {index !== arr.length - 1 ? (
                        <span className="text-3xl font-semibold text-zinc-900 sm:text-5xl">:</span>
                      ) : null}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-zinc-500">
                  Launches on {launchDate.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-base text-zinc-600">
                Launch date will be announced soon.
              </p>
            )}

            <Button
              asChild
              size="lg"
              className="h-12 rounded-none bg-zinc-900 px-10 text-sm font-semibold tracking-[0.2em] text-white hover:bg-zinc-800"
            >
              <Link href={`/shop/${heroProduct.id}`}>SHOP NOW</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
