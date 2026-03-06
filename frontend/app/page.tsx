"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import BlogPreview from "@/components/BlogPreview";
import ValuesSection from "@/components/ValuesSection";
import SupportSection from "@/components/SupportSection";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/public/auth/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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