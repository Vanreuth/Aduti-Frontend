"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

// Icons
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { register } from "@/lib/api/auth";

export default function SignupPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    photo: "",
    password: "",
    confirmPassword: "",
  });

  // UX State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  function getStrengthColor(v) {
    if (v < 40) return "bg-red-500/20";
    if (v < 80) return "bg-yellow-500/20";
    return "bg-emerald-500/20";
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber?.trim() || "",
        address: formData.address?.trim() || "",
        bio: formData.bio?.trim() || "",
        photo: formData.photo?.trim() || "",
      });

      router.push("/dashboard");
    } catch (err) {
      setError((err as Error)?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const p = formData.password || "";
    let score = 0;
    if (p.length >= 6) score += 25;
    if (p.length >= 10) score += 15;
    if (/[A-Z]/.test(p)) score += 20;
    if (/[0-9]/.test(p)) score += 20;
    if (/[^A-Za-z0-9]/.test(p)) score += 20;
    setPasswordStrength(Math.min(score, 100));
  }, [formData.password]);

  return (
    <div className="relative min-h-screen w-full bg-linear-to-br px-6 py-10">
      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-2xl">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-2 px-10 pt-10">
            <CardTitle className="text-3xl font-semibold text-zinc-900">
              Create an account
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Enter your information below to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 px-10 pb-8">
            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-2"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignup} className="grid gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="username">
                    Full Name
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="John Doe"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Password
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2 ">
                  <Label htmlFor="confirmPassword">
                    Confirm Password
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className={
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? "h-11 border-red-500 focus-visible:ring-red-500"
                        : "h-11"
                    }
                  />
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Passwords match
                      </div>
                    )}
                </div>
              </div>

              {formData.password && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Strength</span>
                    <span
                      className={
                        passwordStrength > 80
                          ? "text-emerald-600 font-medium"
                          : ""
                      }
                    >
                      {passwordStrength < 40
                        ? "Weak"
                        : passwordStrength < 80
                          ? "Medium"
                          : "Strong"}
                    </span>
                  </div>
                  <Progress
                    value={passwordStrength}
                    className={getStrengthColor(passwordStrength)}
                  />
                </div>
              )}

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="(+855) 12 345 678"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Street, City, Country"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-1">
                <div className="grid gap-2">
                  <Label htmlFor="photo">Photo </Label>
                  <Input
                    id="photo"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.photo}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-11"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    disabled={loading}
                    rows={3}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="mt-2 h-11 w-full bg-zinc-900 hover:bg-zinc-800"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t px-10 pb-10 pt-6">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
            <p className="text-center text-xs text-muted-foreground px-4">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
