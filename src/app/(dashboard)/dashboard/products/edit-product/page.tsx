"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Save, Trash2, RefreshCw, PackageSearch } from "lucide-react";
import { Product, ProductForm } from "@/types/product";

const categories = ["women", "men", "bag", "shoes", "watches"];

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [selectedId, setSelectedId] = useState<string>("");

  const [form, setForm] = useState<ProductForm>({
    id: "",
    name: "",
    price: "",
    originalPrice: "",
    image: "",
    category: "women",
    rating: "4.5",
    reviews: "0",
    stock: "0",
    description: "",
    isSale: false,
    isNew: false,
  });

  const fetchProducts = async () => {
    setLoadingList(true);
    setStatus("");
    try {
      const snap = await getDocs(collection(db, "products"));
      const rows: Product[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: data.id || d.id,
          name: data.name || "",
          price: Number(data.price || 0),
          originalPrice:
            data.originalPrice !== undefined
              ? Number(data.originalPrice)
              : undefined,
          image: data.image || "",
          category: data.category || "women",
          rating: Number(data.rating || 0),
          reviews: Number(data.reviews || 0),
          stock: Number(data.stock || 0),
          description: data.description || "",
          isSale: !!data.isSale,
          isNew: !!data.isNew,
          featured: !!data.featured,
        };
      });

      // sort by name (stable + no index needed)
      rows.sort((a, b) => a.name.localeCompare(b.name));

      setProducts(rows);

      // Auto-select first if none
      if (!selectedId && rows.length > 0) {
        setSelectedId(rows[0].id);
      }
    } catch (e: any) {
      console.error(e);
      setStatus("❌ Failed to fetch products. Check console.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s)
      );
    });
  }, [products, search]);

  // When selected product changes -> load into form
  useEffect(() => {
    if (!selectedId) return;
    const p = products.find((x) => x.id === selectedId);
    if (!p) return;

    setForm({
      id: p.id,
      name: p.name ?? "",
      price: String(p.price ?? ""),
      originalPrice:
        p.originalPrice !== undefined ? String(p.originalPrice) : "",
      image: p.image ?? "",
      category: p.category ?? "women",
      rating: String(p.rating ?? "4.5"),
      reviews: String(p.reviews ?? "0"),
      stock: String(p.stock ?? "0"),
      description: p.description ?? "",
      isSale: !!p.isSale,
      isNew: !!p.isNew,
    });
  }, [selectedId, products]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as any;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) return;

    setSaving(true);
    setStatus("Saving changes...");

    try {
      const ref = doc(db, "products", form.id);

      const price = Number(form.price);
      const originalPrice =
        form.originalPrice.trim() !== ""
          ? Number(form.originalPrice)
          : undefined;

      await updateDoc(ref, {
        name: form.name.trim(),
        price,
        originalPrice,
        image: form.image.trim(),
        category: form.category,
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        stock: Number(form.stock),
        description: form.description.trim(),
        isSale: form.isSale,
        isNew: form.isNew,
        featured: form.isSale || form.isNew,
        updatedAt: serverTimestamp(),
      });

      setStatus("✅ Updated successfully!");

      // update local list too
      setProducts((prev) =>
        prev.map((p) =>
          p.id === form.id
            ? {
                ...p,
                name: form.name.trim(),
                price,
                originalPrice,
                image: form.image.trim(),
                category: form.category,
                rating: Number(form.rating),
                reviews: Number(form.reviews),
                stock: Number(form.stock),
                description: form.description.trim(),
                isSale: form.isSale,
                isNew: form.isNew,
                featured: form.isSale || form.isNew,
              }
            : p
        )
      );
    } catch (e) {
      console.error(e);
      setStatus("❌ Update failed. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const ok = confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "products", selectedId));
      setStatus("✅ Deleted!");

      setProducts((prev) => prev.filter((p) => p.id !== selectedId));

      // pick next selection
      const remaining = products.filter((p) => p.id !== selectedId);
      setSelectedId(remaining[0]?.id || "");
    } catch (e) {
      console.error(e);
      setStatus("❌ Delete failed. Check console.");
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedId);

  return (
    <div className="">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit Product</h1>
          <p className="text-sm text-gray-500">
            Select a product, then update fields.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {status && (
        <div
          className={`mb-4 rounded-lg border p-3 text-sm ${
            status.includes("✅")
              ? "border-green-200 bg-green-50 text-green-800"
              : status.includes("❌")
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          {status}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: Selector */}
        <div className="rounded-xl border bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <PackageSearch className="h-4 w-4" />
            Select Product
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, id, category..."
            className="mb-3 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
          />

          {loadingList ? (
            <div className="rounded-lg border bg-gray-50 p-3 text-sm text-gray-600">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 p-3 text-sm text-gray-600">
              No products found.
            </div>
          ) : (
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {filteredProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          )}

          {selectedProduct && (
            <div className="mt-4 overflow-hidden rounded-xl border">
              <div className="aspect-[4/3] bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-gray-500">
                  {selectedProduct.category?.toUpperCase()}
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {selectedProduct.name}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  ID: <span className="font-mono">{selectedProduct.id}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleDelete}
            disabled={!selectedId}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </button>
        </div>

        {/* Right: Edit form */}
        <div className="rounded-xl border bg-white p-6">
          {!selectedId ? (
            <div className="text-sm text-gray-600">
              Select a product to edit.
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600">
                    Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600">
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="originalPrice"
                    value={form.originalPrice}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600">
                    Reviews
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="reviews"
                    value={form.reviews}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex items-end gap-3">
                  <label className="inline-flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      name="isSale"
                      checked={form.isSale}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    On Sale
                  </label>

                  <label className="inline-flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      name="isNew"
                      checked={form.isNew}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    New
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600">
                  Image URL
                </label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                  required
                />
                <div className="mt-3 overflow-hidden rounded-xl border">
                  <div className="aspect-[4/2] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        form.image ||
                        "https://via.placeholder.com/800x400?text=Preview"
                      }
                      alt="preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://via.placeholder.com/800x400?text=Invalid+Image";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
