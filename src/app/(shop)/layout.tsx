import TopBar from "@/components/layout/Tobar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen ">
      <TopBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
