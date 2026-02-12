import Link from "next/link";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/layout/Tobar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Header />

      <main>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <p className="text-sm text-zinc-500">403</p>

            <h1 className="mt-2 text-3xl font-bold text-zinc-900">
              Access Denied
            </h1>

            <p className="mt-3 text-zinc-600">
              You don’t have permission to access this page. Please contact an
              administrator if you believe this is a mistake.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button asChild className="bg-zinc-900 hover:bg-zinc-800">
                <Link href="/">Go Home</Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/shop">Go to Shop</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
