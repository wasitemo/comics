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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch first 4 products (ID 1-4)
        const productIds = [1, 2, 3, 4];
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

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-8">
        <h3 className="text-3xl font-bold mb-10">Produk Unggulan</h3>
        <div className="text-center text-gray-400">Loading...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-8">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-3xl font-bold">Produk Unggulan</h3>
        <Link
          href="/public/products"
          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
        >
          Lihat Semua →
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              href={`/public/products/${product.product_id}`}
              key={product.product_id}
            >
              <div className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition">
                {product.product_image_url ? (
                  <img
                    src={product.product_image_url}
                    alt={product.product_title}
                    className="w-full h-40 object-cover mb-4 rounded"
                  />
                ) : (
                  <div className="h-40 bg-gray-700 mb-4 rounded"></div>
                )}
                <h4 className="font-bold text-lg mb-2">{product.product_title}</h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.sypnosis}
                </p>
                <button className="bg-yellow-400 text-black px-4 py-2 rounded text-sm font-medium">
                  Lihat Detail
                </button>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-4 text-center text-gray-400">No products available</div>
        )}
      </div>
    </section>
  );
}
