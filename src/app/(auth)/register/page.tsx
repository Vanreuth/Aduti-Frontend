"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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
import GoogleButton from "@/components/auth/GoogleButton";

export default function SignupPage() {
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });
  
  // UX State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const getStrengthColor = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 80) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  useEffect(() => {
    const scorePassword = (password: string) => {
      if (!password) return 0;
      let score = Math.min(password.length * 10, 60);
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 15;
      if (/\d/.test(password)) score += 15;
      if (/[^A-Za-z0-9]/.test(password)) score += 10;
      return Math.min(score, 100);
    };

    setPasswordStrength(scorePassword(formData.password));
  }, [formData.password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (passwordStrength < 40) {
        return setError("Password is too weak. Please include numbers or symbols.");
    }

    setLoading(true);

    try {
      // 2. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 3. Update Auth Profile (Display Name)
      await updateProfile(user, {
        displayName: formData.name,
      });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        displayName: formData.name,
        email: formData.email,
        phone: formData.phoneNumber,
        address: formData.address || null,
        bio: formData.bio || "",
        photoURL: formData.photoURL || "",
        role: "customer",
        status: "Active",
        createdAt: serverTimestamp(),
        provider: "email",
      });

      // 5. Redirect
      router.replace("/dashboard"); 

    } catch (err: any) {
      console.error("Signup Error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-linear-to-br from-slate-950 via-zinc-900 to-slate-800 px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-8 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-16 left-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-sky-500 to-indigo-500" />
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

              <GoogleButton />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSignup} className="grid gap-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      className="h-11"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="(+855) 12 345 678"
                      required
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
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
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
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
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

                <div className="grid gap-4 lg:grid-cols-1">
                  <div className="grid gap-2">
                    <Label htmlFor="photoURL">Photo URL</Label>
                    <Input
                      id="photoURL"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.photoURL}
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
