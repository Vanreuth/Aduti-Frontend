"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateMe } from "@/lib/api/user";
import { getMyOrders } from "@/lib/api/orders";
import type { Order, OrderAmount, OrderStatus } from "@/types/order";

const Icons = {
  Eye: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),

  EyeOff: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.943-9.543-7a9.965 9.965 0 012.224-3.592M6.223 6.223A9.965 9.965 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.121 5.062M15 12a3 3 0 00-3-3M3 3l18 18"
      />
    </svg>
  ),

  User: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Mail: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  Phone: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
  Map: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Lock: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  Edit: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  X: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
};

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    newPassword: "",
    confirmPassword: "",
    photo: null as File | null,
  });

  useEffect(() => {
    if (!user) return;

    setOriginalEmail(user.email);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      bio: user.bio || "",
      newPassword: "",
      confirmPassword: "",
      photo: null,
    });

    setLoading(false);
  }, [user]);

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load your orders";
      setOrdersError(message);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    if (!user) {
      setOrders([]);
      setOrdersError("");
      setOrdersLoading(false);
      return;
    }

    (async () => {
      if (!active) return;
      await refreshOrders();
    })();

    return () => {
      active = false;
    };
  }, [user, refreshOrders]);

  const formatMoney = (value: OrderAmount) => {
    const numeric = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numeric)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numeric);
  };

  const formatDate = (value: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const statusTone = (status: OrderStatus) => {
    if (status === "DELIVERED") return "bg-emerald-100 text-emerald-700";
    if (status === "SHIPPED") return "bg-blue-100 text-blue-700";
    if (status === "PENDING" || status === "CONFIRMED")
      return "bg-amber-100 text-amber-700";
    if (status === "CANCELLED") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  const photoPreviewUrl = useMemo(
    () => (formData.photo ? URL.createObjectURL(formData.photo) : null),
    [formData.photo],
  );

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [orders]);

  const orderStats = useMemo(() => {
    const total = sortedOrders.length;
    const pending = sortedOrders.filter(
      (order) => order.status === "PENDING" || order.status === "CONFIRMED",
    ).length;
    const delivered = sortedOrders.filter(
      (order) => order.status === "DELIVERED",
    ).length;

    return { total, pending, delivered };
  }, [sortedOrders]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    const fd = new FormData();

    if (formData.username) fd.append("username", formData.username);
    if (formData.email && formData.email !== originalEmail)
      fd.append("email", formData.email);
    if (formData.phoneNumber) fd.append("phoneNumber", formData.phoneNumber);
    if (formData.address) fd.append("address", formData.address);
    if (formData.bio) fd.append("bio", formData.bio);
    if (formData.photo) fd.append("photo", formData.photo);

    if (formData.newPassword) {
      fd.append("password", formData.newPassword);
      fd.append("confirmPassword", formData.confirmPassword);
    }

    if ([...fd.keys()].length === 0) {
      setError("No changes to update");
      return;
    }

    try {
      setSaving(true);
      await updateMe(fd);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        Loading account...
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
        Access denied
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0f2fe_0%,_#f8fafc_35%,_#f8fafc_100%)] px-4 py-10 sm:px-6 lg:px-8">
      {(error || success) && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl backdrop-blur-md ${
            error
              ? "border-red-200 bg-red-50/90 text-red-800"
              : "border-emerald-200 bg-emerald-50/90 text-emerald-800"
          }`}
        >
          {error ? <Icons.X /> : <Icons.Check />}
          <span className="text-sm font-medium">{error || success}</span>
          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
            }}
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            <Icons.X />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-sky-100 bg-white/80 px-6 py-6 shadow-lg shadow-sky-100/50 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Account Center
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900 sm:text-3xl">
            Manage profile and orders
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Update your personal details, keep your account secure, and track every
            order in one place.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[300px,1fr]">
          <aside className="h-fit rounded-3xl border border-zinc-200/70 bg-white/90 p-5 shadow-lg shadow-zinc-200/50 backdrop-blur-sm xl:sticky xl:top-24">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-sky-100 bg-slate-100">
                {photoPreviewUrl ? (
                  <img src={photoPreviewUrl} alt="Preview avatar" className="h-full w-full object-cover" />
                ) : user.photo ? (
                  <img src={user.photo} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                    <Icons.User />
                  </div>
                )}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-zinc-900">{user.username}</h2>
              <p className="mt-1 break-all text-sm text-zinc-500">{user.email}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">
                  {user.roles?.[0] ?? "USER"}
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  {orderStats.total} orders
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Pending</span>
                <span className="font-semibold text-zinc-900">{orderStats.pending}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Delivered</span>
                <span className="font-semibold text-zinc-900">{orderStats.delivered}</span>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl border border-zinc-200/70 bg-white/90 p-5 shadow-lg shadow-zinc-200/50 backdrop-blur-sm sm:p-6"
            >
              <section className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-slate-500">
                    <Icons.User />
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-900">Profile Details</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-slate-500">
                    <Icons.Edit />
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-900">Photo and Bio</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-[120px,1fr]">
                  <div className="h-28 w-28 overflow-hidden rounded-2xl border border-zinc-200 bg-slate-100">
                    {photoPreviewUrl ? (
                      <img src={photoPreviewUrl} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : user?.photo ? (
                      <img src={user.photo} alt={user.username} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        <Icons.User />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          photo: e.target.files?.[0] || null,
                        }))
                      }
                      className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-sky-700"
                    />
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Write a short bio about yourself"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-sky-500 transition focus:ring-2"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-slate-500">
                    <Icons.Lock />
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-900">Security</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 pr-10 text-sm outline-none ring-sky-500 transition focus:ring-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                      >
                        {showNewPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 pr-10 text-sm outline-none ring-sky-500 transition focus:ring-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                      >
                        {showConfirmPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-zinc-500">Changes are applied to your account profile.</p>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            <section className="rounded-3xl border border-zinc-200/70 bg-white/90 p-5 shadow-lg shadow-zinc-200/50 backdrop-blur-sm sm:p-6">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">My Orders</h2>
                  <p className="text-sm text-zinc-500">
                    Order history loaded from <code>/api/orders</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void refreshOrders()}
                  disabled={ordersLoading}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {ordersLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Total Orders</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">{orderStats.total}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Pending</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">{orderStats.pending}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Delivered</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">{orderStats.delivered}</p>
                </div>
              </div>

              {ordersLoading ? (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
                  Loading your orders...
                </div>
              ) : ordersError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {ordersError}
                </div>
              ) : sortedOrders.length === 0 ? (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
                  No orders found.
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedOrders.map((order) => (
                    <article key={order.id} className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm text-zinc-500">
                            Order <span className="font-semibold text-zinc-900">#{order.id}</span>
                          </p>
                          <p className="text-xs text-zinc-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-sm font-semibold text-zinc-900">
                            {formatMoney(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm text-zinc-700 sm:grid-cols-3">
                        <p>
                          <span className="text-zinc-500">Items:</span> {order.items?.length ?? 0}
                        </p>
                        <p>
                          <span className="text-zinc-500">Phone:</span> {order.phoneNumber || "-"}
                        </p>
                        <p>
                          <span className="text-zinc-500">Address:</span> {order.shippingAddress || "-"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
