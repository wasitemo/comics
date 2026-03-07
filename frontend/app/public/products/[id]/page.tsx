"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  product_id: number;
  account_id: number;
  product_title: string;
  genre: string[];
  author: string;
  release_date: string;
  price: string;
  sypnosis: string;
  product_image_id: string;
  product_image_url: string;
}

export default function PublicProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://comics-2mkb.onrender.com/public/product/get-product/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError(err instanceof Error ? err.message : "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || "Product not found"}</p>
          <Link
            href="/public/products"
            className="text-indigo-600 hover:text-indigo-900"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/public/products"
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              {product.product_image_url ? (
                <img
                  src={product.product_image_url}
                  alt={product.product_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {product.product_title}
              </h1>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Author</label>
                  <p className="text-gray-900">{product.author}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Release Date</label>
                  <p className="text-gray-900">
                    {new Date(product.release_date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-indigo-600 font-bold text-lg">
                    ${product.price}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Genre</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.genre && product.genre.length > 0 ? (
                      product.genre.map((g, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                        >
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">No genre</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Synopsis</label>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap mt-1">
                    {product.sypnosis}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
