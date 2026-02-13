"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Boxes,
  DollarSign,
  Layers3,
  PackageCheck,
  PackageX,
  RefreshCw,
  Star,
} from "lucide-react";
import { getProductDashboardAnalytics } from "@/lib/api/product";
import type { DashboardProduct, ProductDashboardData } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatStatus(status?: string) {
  if (!status) return "Unknown";
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusVariant(
  status?: string,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "ACTIVE" || status === "DELIVERED") return "default";
  if (status === "COMING_SOON" || status === "PENDING") return "secondary";
  if (status === "OUT_OF_STOCK" || status === "CANCELLED") return "destructive";
  return "outline";
}

function ProductRow({ product }: { product: DashboardProduct }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-background p-3">
      <div className="space-y-1">
        <p className="font-medium leading-tight">{product.name}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{product.category?.name ?? "Uncategorized"}</span>
          <span>•</span>
          <span>#{product.id}</span>
          <span>•</span>
          <span>{formatDate(product.createdAt)}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{money.format(product.price ?? 0)}</p>
        <Badge variant={getStatusVariant(product.status)} className="mt-1">
          {formatStatus(product.status)}
        </Badge>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductDashboardData | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const analytics = await getProductDashboardAnalytics();
      setData(analytics);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const maxCategoryCount = useMemo(() => {
    if (!data?.categoryStats?.length) return 1;
    return Math.max(1, ...data.categoryStats.map((item) => item.productCount ?? 0));
  }, [data?.categoryStats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Product performance overview.</p>
        </div>
        <Button variant="outline" onClick={() => void loadDashboard()} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <Button size="sm" variant="outline" onClick={() => void loadDashboard()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Card key={`metric-skeleton-${idx}`}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={`recent-skeleton-${idx}`} className="h-16 w-full" />
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-44" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={`top-skeleton-${idx}`} className="h-16 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{data.productStats.totalProducts}</p>
                  <Boxes className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{data.productStats.activeProducts}</p>
                  <PackageCheck className="h-5 w-5 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inactive Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{data.productStats.inactiveProducts}</p>
                  <PackageX className="h-5 w-5 text-destructive" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{data.productStats.totalCategories}</p>
                  <Layers3 className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Catalog Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{money.format(data.priceStats.totalValue)}</p>
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(data.recentProducts ?? []).slice(0, 6).map((product) => (
                  <ProductRow key={`recent-${product.id}`} product={product} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(data.topProducts ?? []).slice(0, 6).map((product) => (
                  <div
                    key={`top-${product.id}`}
                    className="flex items-start justify-between gap-4 rounded-lg border bg-background p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium leading-tight">{product.name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{product.category?.name ?? "Uncategorized"}</span>
                        <span>•</span>
                        <span>{compactNumber.format(product.salesCount ?? 0)} sales</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{money.format(product.price ?? 0)}</p>
                      {product.isFeatured ? (
                        <Badge variant="secondary" className="mt-1">
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data.categoryStats ?? []).map((item) => {
                const width = Math.max(
                  8,
                  Math.round(((item.productCount ?? 0) / maxCategoryCount) * 100),
                );
                return (
                  <div key={item.categorySlug} className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">{item.categoryName}</p>
                        <p className="text-xs text-muted-foreground">
                          Avg {money.format(item.avgPrice ?? 0)} • Total {money.format(item.totalValue ?? 0)}
                        </p>
                      </div>
                      <Badge variant="outline">{item.productCount} products</Badge>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-muted/20">
            <CardContent className="flex items-center justify-between p-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>
                  Price range: {money.format(data.priceStats.minPrice)} to{" "}
                  {money.format(data.priceStats.maxPrice)}
                </span>
              </div>
              <span className="font-medium">
                Avg: {money.format(data.priceStats.avgPrice)}
              </span>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
