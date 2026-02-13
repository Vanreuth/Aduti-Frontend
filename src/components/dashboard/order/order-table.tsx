"use client";

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import {
  ArrowDownWideNarrow,
  CheckCircle2,
  ClipboardList,
  Eye,
  Search,
  Truck,
  UserCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminOrders, getOrderById } from "@/lib/api/orders";
import type { Order, OrderAmount } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { cn } from "@/lib/utils";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type SortBy = "newest" | "oldest" | "amount-high" | "amount-low";

function toNumber(value: OrderAmount | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formatCurrency(value: OrderAmount | null | undefined) {
  return currencyFormatter.format(toNumber(value));
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

function formatStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "PENDING":
    case "CONFIRMED":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

function getItemCount(order: Order) {
  return (order.items ?? []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
}

function isPositiveInteger(text: string) {
  return /^[1-9]\d*$/.test(text);
}

function sortOrders(data: Order[], sortBy: SortBy) {
  const sorted = [...data];
  sorted.sort((a, b) => {
    if (sortBy === "newest" || sortBy === "oldest") {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    }

    const amountA = toNumber(a.totalAmount);
    const amountB = toNumber(b.totalAmount);
    return sortBy === "amount-high" ? amountB - amountA : amountA - amountB;
  });
  return sorted;
}

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>(
    "ALL",
  );
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [userIdInput, setUserIdInput] = useState("");
  const [appliedUserId, setAppliedUserId] = useState<number | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminOrders(
        appliedUserId !== null ? { userId: appliedUserId } : undefined,
      );
      setOrders(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load orders";
      setError(message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [appliedUserId]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + toNumber(order.totalAmount),
      0,
    );
    const pending = orders.filter(
      (order) => order.status === "PENDING" || order.status === "CONFIRMED",
    ).length;
    const shipped = orders.filter((order) => order.status === "SHIPPED").length;
    const delivered = orders.filter((order) => order.status === "DELIVERED").length;

    return { totalOrders, totalRevenue, pending, shipped, delivered };
  }, [orders]);

  const filteredAndSortedOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const byStatus =
      statusFilter === "ALL"
        ? orders
        : orders.filter((order) => order.status === statusFilter);

    const bySearch = !term
      ? byStatus
      : byStatus.filter((order) => {
          const fields = [
            String(order.id),
            String(order.userId ?? ""),
            order.userEmail ?? "",
            order.username ?? "",
            order.status ?? "",
            order.phoneNumber ?? "",
            order.shippingAddress ?? "",
          ];
          return fields.some((field) => field.toLowerCase().includes(term));
        });

    return sortOrders(bySearch, sortBy);
  }, [orders, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedOrders.length / pageSize));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedOrders.slice(start, start + pageSize);
  }, [currentPage, pageSize, filteredAndSortedOrders]);

  const hasActiveFilters =
    appliedUserId !== null || searchTerm.trim().length > 0 || statusFilter !== "ALL";

  const applyUserFilter = () => {
    const trimmed = userIdInput.trim();
    if (!trimmed) {
      setAppliedUserId(null);
      return;
    }
    if (!isPositiveInteger(trimmed)) {
      toast.error("Invalid user ID", {
        description: "Please enter a positive numeric user ID.",
      });
      return;
    }

    setAppliedUserId(Number(trimmed));
    setCurrentPage(1);
  };

  const onUserIdKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyUserFilter();
    }
  };

  const clearUserFilter = () => {
    setUserIdInput("");
    setAppliedUserId(null);
    setCurrentPage(1);
  };

  const openOrderDetail = async (orderId: number) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailOrder(null);

    try {
      const order = await getOrderById(orderId);
      if (!order) {
        throw new Error("Order data is empty.");
      }
      setDetailOrder(order);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load order details";
      setDetailError(message);
      toast.error("Load order failed", { description: message });
    } finally {
      setDetailLoading(false);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSortBy("newest");
    clearUserFilter();
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Review, filter, and inspect customer orders in one place.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {loading
            ? "Updating..."
            : `Showing ${filteredAndSortedOrders.length} of ${orders.length} orders`}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-semibold">{summary.totalOrders}</p>
            </div>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-2xl font-semibold">
                {formatCurrency(summary.totalRevenue)}
              </p>
            </div>
            <ArrowDownWideNarrow className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold">{summary.pending}</p>
            </div>
            <UserCircle2 className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">In Transit / Delivered</p>
              <p className="text-2xl font-semibold">
                {summary.shipped} / {summary.delivered}
              </p>
            </div>
            <Truck className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by order, user, phone, status, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as (typeof STATUS_OPTIONS)[number])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "ALL" ? "All Statuses" : formatStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="amount-high">Amount: High to Low</SelectItem>
              <SelectItem value="amount-low">Amount: Low to High</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              placeholder="User ID"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              onKeyDown={onUserIdKeyDown}
              className="w-[130px]"
            />
            <Button onClick={applyUserFilter} type="button">
              Apply
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={clearAllFilters}
            disabled={!hasActiveFilters && !userIdInput}
            type="button"
            className="w-full lg:w-auto"
          >
            Clear Filters
          </Button>
        </div>

        {(appliedUserId !== null || statusFilter !== "ALL" || searchTerm.trim()) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {appliedUserId !== null && (
              <Badge variant="outline" className="gap-1">
                User ID: {appliedUserId}
                <button
                  type="button"
                  className="rounded-sm p-0.5 hover:bg-muted"
                  onClick={clearUserFilter}
                  aria-label="Clear user filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {statusFilter !== "ALL" && (
              <Badge variant="outline" className="gap-1">
                Status: {formatStatusLabel(statusFilter)}
                <button
                  type="button"
                  className="rounded-sm p-0.5 hover:bg-muted"
                  onClick={() => setStatusFilter("ALL")}
                  aria-label="Clear status filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchTerm.trim() && (
              <Badge variant="outline" className="gap-1">
                Search: {searchTerm.trim()}
                <button
                  type="button"
                  className="rounded-sm p-0.5 hover:bg-muted"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table className="min-w-[980px]">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="mt-2 h-3 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="mt-2 h-3 w-40" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="mx-auto h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-28 text-center">
                    <div className="space-y-2">
                      <p className="font-medium">No orders found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters.
                      </p>
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllFilters}
                          type="button"
                        >
                          Reset Filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="font-medium">#{order.id}</div>
                      <div className="text-xs text-muted-foreground">
                        Updated: {formatDateTime(order.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.username ?? "Unknown user"}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.userEmail ?? "No email"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        User ID: {order.userId ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {getItemCount(order)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(order.status)}
                        className={cn(
                          "uppercase tracking-wide",
                          order.status === "DELIVERED" && "gap-1",
                        )}
                      >
                        {order.status === "DELIVERED" && <CheckCircle2 className="h-3 w-3" />}
                        {formatStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-[220px] truncate text-sm text-muted-foreground"
                        title={order.shippingAddress ?? "No address"}
                      >
                        {order.shippingAddress ?? "No address"}
                      </div>
                      {order.phoneNumber ? (
                        <div className="text-xs text-muted-foreground">{order.phoneNumber}</div>
                      ) : null}
                    </TableCell>
                    <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void openOrderDetail(order.id)}
                        className="gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[860px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Data loaded from <code>/api/orders/:orderId</code>.
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <p className="text-sm text-muted-foreground">Loading order details...</p>
          ) : detailError ? (
            <p className="text-sm text-destructive">{detailError}</p>
          ) : detailOrder ? (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">Order #{detailOrder.id}</Badge>
                <Badge variant={getStatusBadgeVariant(detailOrder.status)}>
                  {formatStatusLabel(detailOrder.status)}
                </Badge>
                <Badge variant="secondary">
                  Total: {formatCurrency(detailOrder.totalAmount)}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Card>
                  <CardContent className="space-y-2 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Customer
                    </p>
                    <div>
                      <span className="font-medium">Username:</span>{" "}
                      {detailOrder.username ?? "—"}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {detailOrder.userEmail ?? "—"}
                    </div>
                    <div>
                      <span className="font-medium">User ID:</span>{" "}
                      {detailOrder.userId ?? "—"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="space-y-2 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Delivery
                    </p>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {detailOrder.phoneNumber ?? "—"}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span>{" "}
                      {detailOrder.shippingAddress ?? "—"}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {formatDateTime(detailOrder.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>{" "}
                      {formatDateTime(detailOrder.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Items</h4>
                <div className="max-h-[260px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant ID</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(detailOrder.items ?? []).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-20 text-center">
                            No items
                          </TableCell>
                        </TableRow>
                      ) : (
                        (detailOrder.items ?? []).map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-xs text-muted-foreground">
                                Product ID: {item.productId}
                              </div>
                            </TableCell>
                            <TableCell>{item.productVariantId ?? "—"}</TableCell>
                            <TableCell className="font-medium">{item.quantity}</TableCell>
                            <TableCell>{formatCurrency(item.price)}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(item.subtotal)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No order data.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
