"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { loginApi } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const canSubmit = useMemo(() => {
    return username.trim() !== "" && password.trim() !== "" && !isBusy;
  }, [username, password, isBusy]);

  useEffect(() => {
    if (!user) return;

    if (user.roles?.includes("ADMIN")) {
      router.push("/dashboard");
    } else {
      router.push("/shop");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setIsBusy(true);
      setError("");
      await loginApi({ username, password });
      await refreshUser();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="overflow-hidden ">
      <div className="flex my-20 items-center justify-center  ">
        <Card className="w-full max-w-md rounded-3xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-semibold text-zinc-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-zinc-600">
              Sign in with your staff account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Alert (no scroll, compact) */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-red-900">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-100">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-5">
                      Login failed
                    </p>
                    <p className="mt-0.5 text-sm text-red-700">{error}</p>

                    {/* <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setError("")}
                        className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Dismiss
                      </button>
                      <Link
                        href="/forgot-password"
                        className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Reset password
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isBusy}
                  className="h-11"
                  autoComplete="username"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link
                    href="/forgot-password"
                    className="text-sm text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
                  >
                    Forgot password?
                  </Link> */}
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isBusy}
                    className="h-11 pr-11"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isBusy}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-zinc-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-zinc-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={!canSubmit}
              >
                {isBusy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="pt-1 text-center text-sm text-zinc-700">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </div>

            <div className="flex justify-center gap-4 pt-2 text-xs text-zinc-500">
              <Link
                href="/terms"
                className="hover:text-zinc-900 hover:underline"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-zinc-900 hover:underline"
              >
                Privacy
              </Link>
              <Link
                href="/help"
                className="hover:text-zinc-900 hover:underline"
              >
                Help
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
