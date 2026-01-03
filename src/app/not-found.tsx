import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-sm text-zinc-500">404</p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">
          Page not found
        </h1>
        <p className="mt-3 text-zinc-600">
          Sorry, the page you’re looking for doesn’t exist or was moved.
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
  );
}
