import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import BlogPreview from "@/components/BlogPreview";
import ValuesSection from "@/components/ValuesSection";
import SupportSection from "@/components/SupportSection";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BlogPreview />
      <ValuesSection />
      <SupportSection />
      <Newsletter />
    </>
  );
}