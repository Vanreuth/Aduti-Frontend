import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyStore - Your Online Store",
  description: "Quality products at great prices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <WishlistProvider>
                <Toaster
                  position="top-right"
                  closeButton
                  richColors
                  toastOptions={{
                    classNames: {
                      toast: "relative",
                      closeButton:
                        "absolute !right-0 !top-2 !left-auto text-zinc-500 hover:text-zinc-900",
                    },
                  }}
                />
                {children}
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
