"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <section className="text-center py-24 bg-gradient-to-r from-black to-gray-900">
      <h2 className="text-5xl font-bold mb-6 text-white">
        Komik Premium untuk Pembaca Dewasa
      </h2>
      <p className="text-gray-400 mb-8 text-lg">
        Koleksi eksklusif dengan kualitas dan finishing terbaik.
      </p>

      <div className="space-x-4">
        <Link
          href="/public/products"
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition inline-block"
        >
          Lihat Produk
        </Link>
        {isAuthenticated ? (
          <Link
            href="/private/product/create"
            className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-3 rounded-lg transition inline-block"
          >
            Tambah Produk Baru
          </Link>
        ) : (
          <Link
            href="/public/auth/register"
            className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-3 rounded-lg transition inline-block"
          >
            Daftar Sekarang
          </Link>
        )}
      </div>
    </section>
  );
}
