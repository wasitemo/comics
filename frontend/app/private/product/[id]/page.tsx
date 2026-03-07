"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  product_id: number;
  account_id: number;
  product_title: string;
  genres: string[];
  author: string;
  release_date: string;
  price: string;
  sypnosis: string;
  product_image_url: string;
}

export default function PrivateProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = useParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/public/auth/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `https://comics-2mkb.onrender.com/protected/product/get-product/${id}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            router.push("/public/auth/login");
            return;
          }
          throw new Error("Failed to fetch product details");
        }

        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (!isCheckingAuth) {
      fetchProduct();
    }
  }, [isCheckingAuth, id, router]);

  if (isCheckingAuth || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">{error || "Product not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/private/product/"
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            ← Back to Product Management
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Product Details</h1>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {product.product_image_url && (
            <div className="w-full h-64 bg-gray-200">
              <img
                src={product.product_image_url}
                alt={product.product_title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="px-6 py-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.product_title}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Author</label>
                <p className="mt-1 text-gray-900">{product.author}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Release Date</label>
                <p className="mt-1 text-gray-900">{product.release_date}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="mt-1 text-gray-900">${product.price}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Genre</label>
                <p className="mt-1 text-gray-900">
                  {product.genres && product.genres.length > 0 ? [...new Set(product.genres)].join(", ") : "No genre"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Synopsis</label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{product.sypnosis}</p>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
            <Link
              href={`/private/product/${product.product_id}/edit`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Edit
            </Link>
            <Link
              href="/private/product/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
