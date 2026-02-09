"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/Tobar";
import { useMounted } from "@/hooks/useMounted";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useMounted();

  // Prevent Radix (Sheet/Dialog/DropdownMenu) from SSR+hydration mismatch
  if (!mounted) return null; // or return a skeleton header

  return (
    <>
      <TopBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
