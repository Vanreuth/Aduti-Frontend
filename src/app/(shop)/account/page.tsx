"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateMe } from "@/lib/api/user";

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

  if (authLoading || loading) return <div>Loading...</div>;
  if (!user) return <div>Access denied</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Toasts */}
      {(error || success) && (
        <div
          className={`fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 ${
            error
              ? "bg-red-50/90 border-red-200 text-red-800"
              : "bg-emerald-50/90 border-emerald-200 text-emerald-800"
          } flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md`}
        >
          {error ? <Icons.X /> : <Icons.Check />}
          <span>{error || success}</span>
          <button
            onClick={() => {
              setError("");
              setSuccess("");
            }}
          >
            <Icons.X />
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-zinc-900">
            Account Information
          </h1>
          <p className="mt-3 text-sm ">
            Update your details and security preferences.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 p-5 space-y-6"
        >
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 outline-none bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 outline-none bg-white"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 outline-none bg-white"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 outline-none bg-white"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Photo
            </label>

            <div className="flex items-center gap-4">
              {/* Preview */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center">
                {formData.photo ? (
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    className="w-full h-full object-cover"
                  />
                ) : user?.photo ? (
                  <img
                    src={user.photo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icons.User />
                )}
              </div>

              {/* File input */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    photo: e.target.files?.[0] || null,
                  }))
                }
                className="flex-1 text-sm"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Write a short bio about yourself"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 outline-none bg-white"
            />
          </div>

          {/* Security Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 outline-none bg-white"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>

            <label className="block text-sm font-semibold text-gray-700 mt-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 outline-none bg-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
