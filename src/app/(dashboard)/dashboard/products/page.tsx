"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Package, Star, Trash2, Plus, RefreshCw } from "lucide-react";
import { Product } from "@/types/product";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setErr("");
    try {
      const ref = collection(db, "products");
      // If your createdAt exists for all docs, keep this.
      // If not, Firestore may error. In that case remove orderBy line.
      const q = query(ref, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const rows: Product[] = snap.docs.map((d) => {
        const data = d.data() as Omit<Product, "id">;
        return {
          id: (data as any).id || d.id,
          ...data,
        } as Product;
      });

      setProducts(rows);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => {
      return (
        p.name?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s) ||
        p.id?.toLowerCase().includes(s)
      );
    });
  }, [products, search]);

  const handleDelete = async (productId: string) => {
    const ok = confirm("Delete this product?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (e) {
      console.error(e);
      alert("Delete failed. Check console.");
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">All Products</h1>
          <p className="text-sm text-gray-500">
            Total: <b>{products.length}</b>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/products/add-product"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>

          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category, id..."
          className="w-full max-w-md rounded-lg border px-4 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* States */}
      {loading && (
        <div className="rounded-xl border bg-white p-6 text-sm text-gray-600">
          Loading products...
        </div>
      )}

      {!loading && err && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {err}
          <div className="mt-3">
            <button
              onClick={fetchProducts}
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-600">
          <Package className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          No products found.
        </div>
      )}

      {/* Grid */}
      {!loading && !err && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => {
            const hasDiscount =
              p.originalPrice &&
              p.originalPrice > 0 &&
              p.originalPrice > p.price;

            const discount = hasDiscount
              ? Math.round(
                  ((p.originalPrice! - p.price) / p.originalPrice!) * 100
                )
              : 0;

            return (
              <div
                key={p.id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />

                  <div className="absolute left-2 top-2 flex gap-2">
                    {p.isSale && (
                      <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                        Sale
                      </span>
                    )}
                    {p.isNew && (
                      <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                        New
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                        -{discount}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-xs font-semibold text-gray-500">
                    {p.category?.toUpperCase()}
                  </div>
                  <div className="mt-1 line-clamp-1 text-sm font-semibold text-gray-900">
                    {p.name}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-gray-900">
                        ${p.price?.toFixed(2)}
                      </div>
                      {hasDiscount && (
                        <div className="text-xs text-gray-500 line-through">
                          ${p.originalPrice!.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-600">
                      Stock: <b>{p.stock ?? 0}</b>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <Star className="h-4 w-4" />
                      <span className="font-semibold">
                        {p.rating?.toFixed(1)}
                      </span>
                      <span className="text-gray-500">({p.reviews ?? 0})</span>
                    </div>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs text-gray-600">
                    {p.description}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/dashboard/products/edit-product?id=${encodeURIComponent(
                        p.id
                      )}`}
                      className="flex-1 rounded-lg border px-3 py-2 text-center text-xs font-semibold hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/products/${encodeURIComponent(p.id)}`}
                      className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-black"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
