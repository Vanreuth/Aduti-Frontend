import type { Product } from "@/types/api";

export function getPrimaryProductImage(product: Product): string | null {
  // Prefer first variant image if exists
  for (const v of product.variants ?? []) {
    const img = v.images?.[0]?.imageUrl;
    if (img) return img;
  }
  return null;
}

export function getMinVariantPrice(product: Product): number {
  const base = Number(product.price ?? 0);
  const variants = product.variants ?? [];
  if (variants.length === 0) return base;

  const prices = variants
    .map((v) => Number(v.finalPrice ?? base))
    .filter((n) => Number.isFinite(n));

  return prices.length ? Math.min(...prices) : base;
}

export function getTotalStock(product: Product): number {
  return (product.variants ?? []).reduce((sum, v) => sum + Number(v.stockQuantity ?? 0), 0);
}

export function isInStock(product: Product): boolean {
  return getTotalStock(product) > 0;
}
