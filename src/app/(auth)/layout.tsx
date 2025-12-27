"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      // Wait for auth to finish loading
      if (loading) {
        setChecking(true);
        return;
      }

      // If no user, allow auth pages to render
      if (!user) {
        setChecking(false);
        return;
      }

      // User is logged in, need to redirect
      setShouldRedirect(true);

      try {
        // Fetch user profile from Firestore to get role
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role;

          // Redirect based on role
          if (userRole === "admin") {
            router.replace("/dashboard");
          } else {
            // Customer or any other role redirects to home
            router.replace("/");
          }
        } else {
          // If no user profile exists, default to home
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        // On error, redirect to home as fallback
        router.replace("/");
      }
    };

    checkUserAndRedirect();
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading || checking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping mx-auto opacity-20"></div>
          </div>
          <p className="text-gray-700 font-medium mt-6">
            {shouldRedirect ? "Redirecting..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render auth pages if user is logged in (prevents flash)
  if (user) {
    return null;
  }

  return (
    <>
      <main>{children}</main>
    </>
  );
}