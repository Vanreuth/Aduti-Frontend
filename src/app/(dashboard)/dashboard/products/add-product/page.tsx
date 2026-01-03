"use client";

import React, { useMemo, useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Plus,
  Upload,
  Wand2,
  Tag,
  Star,
  Boxes,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import { ProductForm } from "@/types/product";

// Preset products for migration
const presetProducts = [
  {
    id: "prod_001",
    name: "Esprit Ruffle Shirt",
    price: 16.64,
    originalPrice: 24.99,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900",
    category: "women",
    rating: 4.5,
    reviews: 128,
    isSale: true,
    stock: 50,
    description: "Elegant ruffle shirt perfect for any occasion",
  },
  {
    id: "prod_002",
    name: "Herschel Supply Bag",
    price: 35.31,
    image: "https://images.unsplash.com/photo-1673505705677-93516a00ca06?w=900",
    category: "bag",
    rating: 4.8,
    reviews: 89,
    isNew: true,
    stock: 30,
    description: "Durable backpack for everyday use",
  },
  // Add all 12 products here...
];

function classNames(...v: Array<string | false | undefined | null>) {
  return v.filter(Boolean).join(" ");
}

function formatMoney(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function AdminProductManager() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "migrate">("add");

  const categories = ["women", "men", "bag", "shoes", "watches"];

  const [productForm, setProductForm] = useState<ProductForm>({
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

  const computed = useMemo(() => {
    const price = Number(productForm.price || 0);
    const original = Number(productForm.originalPrice || 0);
    const hasOriginal = !!productForm.originalPrice && original > 0;
    const hasSale = hasOriginal && original > price;
    const discount = hasSale
      ? Math.round(((original - price) / original) * 100)
      : 0;

    return {
      price,
      original,
      hasOriginal,
      hasSale,
      discount,
      rating: Math.min(5, Math.max(0, Number(productForm.rating || 0))),
      reviews: Math.max(0, Number(productForm.reviews || 0)),
      stock: Math.max(0, Number(productForm.stock || 0)),
    };
  }, [productForm]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProductForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProductForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const generateProductId = () => {
    const randomNum = Math.floor(Math.random() * 10000);
    return `prod_${randomNum.toString().padStart(4, "0")}`;
  };

  const fillGeneratedId = () => {
    setProductForm((prev) => ({ ...prev, id: prev.id || generateProductId() }));
  };

  function cleanUrl(url: string) {
    return (url || "")
      .trim()
      .replace(/^"+|"+$/g, "")
      .replace(/^'+|'+$/g, "")
      .replace(/^https:\//, "https://");
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Adding product...");

    try {
      const productId = productForm.id || generateProductId();
      const productRef = doc(db, "products", productId);

      const payload: any = {
        id: productId,
        name: productForm.name.trim(),
        price: parseFloat(productForm.price),
        image: cleanUrl(productForm.image),
        category: productForm.category,
        rating: parseFloat(productForm.rating),
        reviews: parseInt(productForm.reviews),
        stock: parseInt(productForm.stock),
        description: productForm.description.trim(),
        isSale: productForm.isSale,
        isNew: productForm.isNew,
        featured: productForm.isNew || productForm.isSale,
        createdAt: serverTimestamp(),
      };

      if (productForm.originalPrice?.trim()) {
        payload.originalPrice = parseFloat(productForm.originalPrice);
      }

      await setDoc(productRef, payload);

      setStatus(`✅ Product "${productForm.name}" added successfully!`);
      setProductForm({
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
    } catch (error) {
      setStatus("❌ Failed to add product. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMigrateAll = async () => {
    setLoading(true);
    setStatus("Starting migration...");

    try {
      for (const product of presetProducts) {
        const productRef = doc(db, "products", product.id);

        await setDoc(productRef, {
          ...product,
          createdAt: serverTimestamp(),
          featured: product.isNew || product.isSale || false,
        });

        setStatus(`Migrated: ${product.name}`);
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      setStatus(
        `✅ All ${presetProducts.length} products migrated successfully!`
      );
    } catch (error) {
      setStatus("❌ Migration failed. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      {/* Status */}
      {status && (
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <div
            className={classNames(
              "rounded-xl border px-4 py-3 text-sm",
              status.includes("✅")
                ? "border-green-200 bg-green-50 text-green-800"
                : status.includes("❌")
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-blue-200 bg-blue-50 text-blue-800"
            )}
          >
            {status}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {activeTab === "add" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_.75fr]">
            {/* Form */}
            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Add New Product
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Fill the details below. Preview updates instantly on the
                  right.
                </p>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-7 p-6">
                {/* Section: Basics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Info className="h-4 w-4 text-gray-500" />
                    Basics
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600">
                        Product ID (optional)
                      </label>
                      <input
                        type="text"
                        name="id"
                        value={productForm.id}
                        onChange={handleInputChange}
                        placeholder="prod_0001 or leave empty"
                        className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        If empty, a random ID will be generated on submit.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={fillGeneratedId}
                      className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-200"
                    >
                      <Wand2 className="h-4 w-4" />
                      Generate
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Nike Air Max Sneakers"
                      className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gray-100" />

                {/* Section: Pricing */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Tag className="h-4 w-4 text-gray-500" />
                    Pricing
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={productForm.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        placeholder="99.99"
                        className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600">
                        Original Price (optional)
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={productForm.originalPrice}
                        onChange={handleInputChange}
                        step="0.01"
                        placeholder="149.99"
                        className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                      {computed.hasSale && (
                        <p className="mt-2 text-xs text-green-700">
                          Discount: <b>{computed.discount}%</b>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gray-100" />

                {/* Section: Media + Category */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    Media & Category
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600">
                      Image URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={productForm.image}
                      onChange={handleInputChange}
                      required
                      placeholder="https://images.unsplash.com/..."
                      className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Tip: use a direct URL that ends with an image response
                      (unsplash is ok).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gray-100" />

                {/* Section: Inventory */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Boxes className="h-4 w-4 text-gray-500" />
                    Inventory & Social Proof
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600">
                        Rating (0-5) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="rating"
                        value={productForm.rating}
                        onChange={handleInputChange}
                        required
                        step="0.1"
                        min="0"
                        max="5"
                        className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600">
                        Reviews <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="reviews"
                        value={productForm.reviews}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={productForm.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gray-100" />

                {/* Section: Description + Flags */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Star className="h-4 w-4 text-gray-500" />
                    Description & Flags
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Write a short, clear description..."
                      className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        name="isSale"
                        checked={productForm.isSale}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                      />
                      <span className="font-semibold text-gray-800">
                        On Sale
                      </span>
                    </label>

                    <label className="inline-flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={productForm.isNew}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                      />
                      <span className="font-semibold text-gray-800">
                        New Arrival
                      </span>
                    </label>

                    <span className="inline-flex items-center rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                      Featured:{" "}
                      {productForm.isNew || productForm.isSale ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? "Adding Product..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl border bg-white shadow-sm">
                <div className="border-b px-5 py-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Live Preview
                  </h3>
                  <p className="mt-1 text-xs text-gray-600">
                    This is how your product card could look in the store.
                  </p>
                </div>

                <div className="p-5">
                  <div className="overflow-hidden rounded-2xl border">
                    <div className="relative aspect-[4/3] w-full bg-gray-100">
                      {productForm.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={productForm.image}
                          alt="preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                          Image preview
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex gap-2">
                        {productForm.isSale && (
                          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                            Sale
                          </span>
                        )}
                        {productForm.isNew && (
                          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-gray-500">
                            {productForm.category
                              ? productForm.category.toUpperCase()
                              : "CATEGORY"}
                          </div>
                          <div className="mt-1 text-base font-semibold text-gray-900">
                            {productForm.name || "Product name"}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-bold text-gray-900">
                            {formatMoney(computed.price || 0)}
                          </div>
                          {computed.hasOriginal && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatMoney(computed.original)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Star className="h-4 w-4" />
                          <span className="font-semibold">
                            {computed.rating.toFixed(1)}
                          </span>
                          <span className="text-gray-500">
                            ({computed.reviews})
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-gray-600">
                          Stock: {computed.stock}
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                        {productForm.description ||
                          "Product description will appear here..."}
                      </p>
                    </div>
                  </div>

                  {/* Quick checks */}
                  <div className="mt-5 rounded-2xl border bg-gray-50 p-4">
                    <div className="text-xs font-semibold text-gray-700">
                      Quick checks
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-gray-600">
                      <li>• Use a valid image URL (preview should show).</li>
                      <li>
                        • If On Sale, set Original Price higher than Price.
                      </li>
                      <li>• Keep description short (1–2 lines is best).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Migrate Tab
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Migrate Preset Products
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                This will migrate <b>{presetProducts.length}</b> preset products
                to your Firebase database. Do this only once.
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-900">
                  ⚠️ <b>Warning:</b> This will add all preset products to your
                  database. Make sure you haven&apos;t migrated them already.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border bg-gray-50 p-4">
                  <div className="text-xs font-semibold text-gray-600">
                    Preset count
                  </div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">
                    {presetProducts.length}
                  </div>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-4">
                  <div className="text-xs font-semibold text-gray-600">
                    Collection
                  </div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">
                    products
                  </div>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-4">
                  <div className="text-xs font-semibold text-gray-600">
                    Mode
                  </div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">
                    Overwrite
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    Uses setDoc (same ID will overwrite).
                  </div>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border">
                <div className="grid grid-cols-[140px_1fr_120px_120px] gap-0 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                  <div>ID</div>
                  <div>Name</div>
                  <div>Category</div>
                  <div className="text-right">Price</div>
                </div>

                <div className="max-h-[340px] overflow-auto">
                  {presetProducts.map((p) => (
                    <div
                      key={p.id}
                      className="grid grid-cols-[140px_1fr_120px_120px] items-center gap-0 border-t px-4 py-3 text-sm"
                    >
                      <div className="font-mono text-xs text-gray-700">
                        {p.id}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {p.name}
                      </div>
                      <div className="text-xs text-gray-700">{p.category}</div>
                      <div className="text-right font-semibold text-gray-900">
                        {formatMoney(p.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleMigrateAll}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-gray-400"
              >
                {loading
                  ? "Migrating..."
                  : `Migrate ${presetProducts.length} Products`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
