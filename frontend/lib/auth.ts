"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setIsAuthenticated(!!storedToken);

      if (requireAuth && !storedToken) {
        router.push("/public/auth/login");
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setIsAuthenticated(!!storedToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [requireAuth, router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setToken(null);
    router.push("/");
  };

  return { isAuthenticated, isLoading, token, logout };
}
