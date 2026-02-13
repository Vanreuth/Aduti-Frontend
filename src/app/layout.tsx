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
  title: "AditiStore - Online Store for Quality Products",
  description: "Quality products at great prices",
  icons: {
    icon: [
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
      { url: "/icon.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.png?v=2",
    apple: "/apple-icon.png?v=2",
  },
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
