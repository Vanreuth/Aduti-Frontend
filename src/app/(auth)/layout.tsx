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
  const mounted = useMounted(); // hook #1

  if (!mounted) return null; // safe after all hooks

  return (
    <>
      <TopBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
