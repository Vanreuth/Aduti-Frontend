"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Product } from "@/types/product";

type FeaturedSectionProps = {
  products: Product[];
  loading: boolean;
};

const PLACEHOLDER_IMAGE = "/product/placeholder.svg";

function getPrimaryImage(product: Product) {
  const image = product.variants?.flatMap((variant) => variant.images ?? [])[0];
  return image?.imageUrl ?? PLACEHOLDER_IMAGE;
}

function formatDisplayDate(value?: string | null) {
  if (!value) return "Recently added";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recently added";

  return parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function FeaturedSection({ products, loading }: FeaturedSectionProps) {
  if (loading) {
    return (
      <section className="w-full bg-[#f1f1f1] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <div className="mx-auto h-4 w-40 animate-pulse rounded bg-zinc-200" />
            <div className="mx-auto mt-4 h-10 w-80 animate-pulse rounded bg-zinc-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={`featured-skeleton-${index}`}>
                <div className="aspect-[4/3] animate-pulse bg-zinc-200" />
                <div className="mx-5 -mt-10 space-y-3 bg-white p-6 shadow-sm">
                  <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />
                  <div className="h-7 w-full animate-pulse rounded bg-zinc-200" />
                  <div className="h-7 w-3/4 animate-pulse rounded bg-zinc-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  const featuredItems = products.slice(0, 3);

  return (
    <section className="w-full bg-[#f1f1f1] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">
            Latest Picks
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-zinc-900 sm:text-5xl">
            Featured Product Trends
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredItems.map((product) => (
            <article key={product.id} className="group">
              <Link
                href={`/shop/${product.id}`}
                className="block overflow-hidden"
                aria-label={product.name}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={getPrimaryImage(product)}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              <div className="mx-5 -mt-10 space-y-4 bg-white p-6 shadow-sm">
                <p className="flex items-center gap-2 text-sm text-zinc-600">
                  <CalendarDays className="h-4 w-4 text-zinc-500" />
                  {formatDisplayDate(product.createdAt ?? product.updatedAt)}
                </p>

                <h3 className="line-clamp-2 text-3xl font-semibold leading-tight text-zinc-900 sm:text-[2rem]">
                  <Link href={`/shop/${product.id}`} className="hover:text-zinc-700">
                    {product.name}
                  </Link>
                </h3>

                <Link
                  href={`/shop/${product.id}`}
                  className="inline-block border-b-2 border-zinc-900 pb-1 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900 hover:text-zinc-700"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
