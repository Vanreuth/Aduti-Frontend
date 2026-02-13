"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { updateMe } from "@/lib/api/user";

type SettingsFormState = {
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  bio: string;
  password: string;
  confirmPassword: string;
  photo: File | null;
};

function getInitials(name: string) {
  const value = name.trim();
  if (!value) return "U";
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function createEmptyForm(): SettingsFormState {
  return {
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    password: "",
    confirmPassword: "",
    photo: null,
  };
}

export default function SettingsPage() {
  const { user, loading, refreshUser } = useAuth();

  const [form, setForm] = useState<SettingsFormState>(createEmptyForm());
  const [originalEmail, setOriginalEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    setOriginalEmail(user.email || "");
    setForm({
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      bio: user.bio || "",
      password: "",
      confirmPassword: "",
      photo: null,
    });
  }, [user]);

  const photoPreview = useMemo(() => {
    if (!form.photo) return null;
    return URL.createObjectURL(form.photo);
  }, [form.photo]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      photo: event.target.files?.[0] || null,
    }));
  };

  const handleReset = () => {
    if (!user) return;
    setForm({
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      bio: user.bio || "",
      password: "",
      confirmPassword: "",
      photo: null,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Password confirmation does not match.");
      return;
    }

    const formData = new FormData();

    if (form.username.trim()) formData.append("username", form.username.trim());
    if (form.email.trim() && form.email.trim() !== originalEmail) {
      formData.append("email", form.email.trim());
    }
    if (form.phoneNumber.trim()) formData.append("phoneNumber", form.phoneNumber.trim());
    if (form.address.trim()) formData.append("address", form.address.trim());
    if (form.bio.trim()) formData.append("bio", form.bio.trim());
    if (form.photo) formData.append("photo", form.photo);

    if (form.password) {
      formData.append("password", form.password);
      formData.append("confirmPassword", form.confirmPassword);
    }

    if ([...formData.keys()].length === 0) {
      toast.error("No changes to update.");
      return;
    }

    try {
      setSaving(true);
      await updateMe(formData);
      await refreshUser();
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        photo: null,
      }));
      toast.success("Profile updated successfully.");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error("Update failed", { description: message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-muted/20 p-6 text-sm text-muted-foreground">
        Loading profile settings...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border bg-destructive/5 p-6 text-sm text-destructive">
        You need to log in to manage dashboard settings.
      </div>
    );
  }

  const displayName = form.username.trim() || "User";
  const initials = getInitials(displayName);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your dashboard profile information and security settings.
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border bg-muted/10 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage
                  src={photoPreview ?? user.photo ?? undefined}
                  alt={displayName}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{displayName}</p>
                <p className="text-sm text-muted-foreground break-all">
                  {form.email || "No email"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Profile Picture</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="max-w-[230px]"
                />
                <Camera className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us a little about yourself"
            className="min-h-[110px]"
          />
        </div>

        <div className="rounded-xl border bg-muted/10 p-4">
          <p className="mb-4 text-sm font-medium">Change Password (optional)</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleReset} disabled={saving}>
            Reset
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
