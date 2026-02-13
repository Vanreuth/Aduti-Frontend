import { getFeaturedProducts } from "@/lib/api/product";
import type { Product } from "@/types/product";

export type ProductBlogItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  comments: string;
  author: string;
  href: string;
  category: string;
  priceLabel: string;
};

const FALLBACK_IMAGE = "/blog/blog-01.jpg";

function toExcerpt(text: string, max = 130) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return "Explore the latest product highlights and style updates.";
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 3).trimEnd()}...`;
}

function toDate(value?: string | null) {
  if (!value) return "Recently";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  return parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPrimaryImage(product: Product) {
  const image = product.variants?.flatMap((variant) => variant.images ?? [])[0];
  return image?.imageUrl ?? FALLBACK_IMAGE;
}

function mapProductToBlog(product: Product): ProductBlogItem {
  return {
    id: product.id,
    title: product.name,
    description: toExcerpt(product.description ?? ""),
    image: getPrimaryImage(product),
    date: toDate(product.createdAt ?? product.updatedAt),
    comments: "0 Comments",
    author: product.createdByUsername?.trim() || "Admin",
    href: `/shop/${product.id}`,
    category: product.category?.name || "General",
    priceLabel: `$${Number(product.price ?? 0).toFixed(2)}`,
  };
}

export async function getProductBlogs(limit = 9): Promise<ProductBlogItem[]> {
  try {
    const featuredProducts = await getFeaturedProducts(limit);
    return (featuredProducts ?? []).map(mapProductToBlog).slice(0, limit);
  } catch {
    return [];
  }
}
