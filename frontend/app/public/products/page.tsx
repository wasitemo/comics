"use client";

import { useEffect, useState } from "react";
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

export default function PublicProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const limit = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch products for current page
        const startId = (page - 1) * limit + 1;
        const endId = page * limit;
        const productIds = [];
        for (let i = startId; i <= endId; i++) {
          productIds.push(i);
        }

        const promises = productIds.map((id) =>
          fetch(`https://comics-2mkb.onrender.com/public/product/get-product/${id}`)
            .then((res) => {
              if (res.ok) return res.json();
              return null;
            })
            .catch(() => null)
        );

        const results = await Promise.all(promises);
        const fetchedProducts = results
          .filter((result) => result && result.data)
          .map((result) => result.data);

        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
          // Estimate total pages (since API doesn't provide list endpoint)
          setTotalPage(Math.ceil((endId + 10) / limit)); // Assume there might be more
        } else if (page === 1) {
          setTotalPage(1);
          setTotalData(0);
        }
        setTotalData(fetchedProducts.length + (page - 1) * limit);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">Total: {totalData} products</p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  href={`/public/products/${product.product_id}`}
                  key={product.product_id}
                  className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
                >
                  {product.product_image_url ? (
                    <img
                      src={product.product_image_url}
                      alt={product.product_title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200"></div>
                  )}
                  <div className="p-4">
                    <h2 className="font-bold text-lg mb-2 line-clamp-2">
                      {product.product_title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">
                      by {product.author}
                    </p>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                      {product.sypnosis}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-600 font-bold">
                        ${product.price}
                      </span>
                      <span className="text-indigo-600 text-sm font-medium">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {page} of {totalPage}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPage}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}
