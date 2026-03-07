"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardMenuOpen, setDashboardMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setDashboardMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  if (loading) {
    return (
      <nav className="bg-black px-8 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-yellow-400 font-bold text-xl">
          Bronze Climate Emporium
        </h1>
        <div className="text-gray-400 text-sm">Loading...</div>
      </nav>
    );
  }

  // Hide navbar on auth pages
  if (pathname?.startsWith("/public/auth")) {
    return null;
  }

  return (
    <nav className="bg-black px-4 sm:px-8 py-4 flex justify-between items-center border-b border-gray-800 sticky top-0 z-50">
      <Link
        href="/"
        className="text-yellow-400 font-bold text-xl hover:text-yellow-300 transition"
      >
        Bronze Climate Emporium
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Public Links */}
        <div className="flex space-x-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-yellow-400 transition text-sm"
          >
            Beranda
          </Link>
          <Link
            href="/public/products"
            className="text-gray-300 hover:text-yellow-400 transition text-sm"
          >
            Produk
          </Link>
          <Link
            href="/public/blog"
            className="text-gray-300 hover:text-yellow-400 transition text-sm"
          >
            Blog
          </Link>
        </div>

        {/* Auth Links */}
        <div className="flex items-center space-x-4 pl-6 border-l border-gray-700">
          {isAuthenticated ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setDashboardMenuOpen(!dashboardMenuOpen)}
                  className="text-gray-300 hover:text-yellow-400 transition text-sm font-medium flex items-center"
                >
                  Dashboard ▾
                </button>
                {dashboardMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 border border-gray-700 z-50">
                    <Link
                      href="/private/auth"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                      onClick={() => setDashboardMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/private/product"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                      onClick={() => setDashboardMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      href="/private/blog"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                      onClick={() => setDashboardMenuOpen(false)}
                    >
                      Blog
                    </Link>
                    <Link
                      href="/private/genre"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                      onClick={() => setDashboardMenuOpen(false)}
                    >
                      Genre
                    </Link>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/public/auth/login"
                className="text-gray-300 hover:text-yellow-400 transition text-sm"
              >
                Login
              </Link>
              <Link
                href="/public/auth/register"
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-gray-300 hover:text-yellow-400 transition"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-gray-800 py-4 px-4 space-y-4 z-40">
          <Link
            href="/"
            className="block text-gray-300 hover:text-yellow-400 transition text-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            Beranda
          </Link>
          <Link
            href="/public/products"
            className="block text-gray-300 hover:text-yellow-400 transition text-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            Produk
          </Link>
          <Link
            href="/public/blog"
            className="block text-gray-300 hover:text-yellow-400 transition text-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>

          <div className="border-t border-gray-700 pt-4">
            {isAuthenticated ? (
              <>
                <div className="text-xs text-gray-500 uppercase mb-2">
                  Dashboard
                </div>
                <Link
                  href="/private/auth"
                  className="block text-gray-300 hover:text-yellow-400 transition text-sm py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/private/product"
                  className="block text-gray-300 hover:text-yellow-400 transition text-sm py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/private/blog"
                  className="block text-gray-300 hover:text-yellow-400 transition text-sm py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/private/genre"
                  className="block text-gray-300 hover:text-yellow-400 transition text-sm py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Genre
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 hover:text-red-300 transition text-sm py-1 mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/public/auth/login"
                  className="block text-gray-300 hover:text-yellow-400 transition text-sm py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/public/auth/register"
                  className="block bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md text-sm font-medium transition mt-2 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
