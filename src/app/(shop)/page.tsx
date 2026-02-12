import Slider from "@/components/homecomponent/Slider";
import OurPolicy from "@/components/common/OurPolicy";
import NewsletterBox from "@/components/common/NewsletterBox";
import CategorySection from "@/components/homecomponent/CategorySection";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import ProductOverview from "@/components/shop/ProductOverview";
export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/*  Slider */}
      <Slider />
      <OurPolicy />
      <CategorySection />
      <FeaturedProducts />
      <ProductOverview />
      <NewsletterBox />
    </div>
  );
}
