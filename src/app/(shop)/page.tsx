import HeroSlider from "@/components/homecomponent/Slider";
import OurPolicy from "@/components/common/OurPolicy";
import NewsletterBox from "@/components/common/NewsletterBox";
import CategorySection from "@/components/homecomponent/CategorySection";
import ProductOverview from "@/components/homecomponent/ProductOverview";
export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Hero Slider */}
      <HeroSlider />
      <OurPolicy />
      <CategorySection />

      <ProductOverview />
      <NewsletterBox />
    </div>
  );
}
