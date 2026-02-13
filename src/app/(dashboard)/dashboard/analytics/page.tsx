"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  ChartNoAxesCombined,
  DollarSign,
  RefreshCw,
  ShoppingBag,
  Tags,
  TrendingUp,
} from "lucide-react";
import { getProductDashboardAnalytics } from "@/lib/api/product";
import type { ProductDashboardData } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatStatus(status?: string) {
  if (!status) return "Unknown";
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusVariant(
  status?: string,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "ACTIVE") return "default";
  if (status === "COMING_SOON") return "secondary";
  if (status === "OUT_OF_STOCK" || status === "DISCONTINUED") return "destructive";
  return "outline";
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProductDashboardData | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const analytics = await getProductDashboardAnalytics();
      setData(analytics);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load analytics data";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const categoryMaxValue = useMemo(() => {
    if (!data?.categoryStats?.length) return 1;
    return Math.max(1, ...data.categoryStats.map((c) => c.totalValue ?? 0));
  }, [data?.categoryStats]);

  const activeRate = useMemo(() => {
    if (!data?.productStats.totalProducts) return 0;
    return Math.round(
      (data.productStats.activeProducts / data.productStats.totalProducts) * 100,
    );
  }, [data?.productStats]);

  const sortedCategoryStats = useMemo(() => {
    return [...(data?.categoryStats ?? [])].sort(
      (a, b) => (b.totalValue ?? 0) - (a.totalValue ?? 0),
    );
  }, [data?.categoryStats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Live product analytics.</p>
        </div>
        <Button variant="outline" onClick={() => void loadAnalytics()} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Analytics
        </Button>
      </div>

      {error ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <Button size="sm" variant="outline" onClick={() => void loadAnalytics()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card key={`analytics-skeleton-${idx}`}>
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
                <Skeleton className="h-5 w-44" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={`category-skeleton-${idx}`} className="h-12 w-full" />
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-44" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-52 w-full" />
              </CardContent>
            </Card>
          </div>
        </>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Catalog Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{money.format(data.priceStats.totalValue)}</p>
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Across {data.productStats.totalProducts} products
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{money.format(data.priceStats.avgPrice)}</p>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Min {money.format(data.priceStats.minPrice)} • Max{" "}
                  {money.format(data.priceStats.maxPrice)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{activeRate}%</p>
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {data.productStats.activeProducts} active / {data.productStats.totalProducts} total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tracked Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{data.productStats.totalCategories}</p>
                  <Tags className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Ranked by product value</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Category Value Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sortedCategoryStats.map((item) => {
                  const width = Math.max(
                    10,
                    Math.round(((item.totalValue ?? 0) / categoryMaxValue) * 100),
                  );
                  return (
                    <div key={item.categorySlug} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.categoryName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.productCount} products • Avg {money.format(item.avgPrice ?? 0)}
                          </p>
                        </div>
                        <p className="font-semibold">{money.format(item.totalValue ?? 0)}</p>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartNoAxesCombined className="h-5 w-5" />
                  Product Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Active Products</p>
                  <p className="text-3xl font-bold">{data.productStats.activeProducts}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground">Inactive Products</p>
                  <p className="text-3xl font-bold">{data.productStats.inactiveProducts}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Active Ratio</span>
                    <span>{activeRate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${Math.max(4, activeRate)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-[540px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentProducts.slice(0, 8).map((item) => (
                      <TableRow key={`recent-${item.id}`}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.category?.name ?? "Uncategorized"}
                          </div>
                        </TableCell>
                        <TableCell>{money.format(item.price ?? 0)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(item.status)}>
                            {formatStatus(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-[540px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Flags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topProducts.slice(0, 8).map((item) => (
                      <TableRow key={`top-${item.id}`}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.category?.name ?? "Uncategorized"}
                          </div>
                        </TableCell>
                        <TableCell>{item.salesCount ?? 0}</TableCell>
                        <TableCell>{money.format(item.price ?? 0)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
                            <Badge variant={item.isActive ? "default" : "outline"}>
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
