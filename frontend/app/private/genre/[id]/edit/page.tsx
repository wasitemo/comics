"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Genre {
  genre_id: number;
  account_id: number;
  genre: string;
}

export default function PrivateGenreEditPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [genreName, setGenreName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/public/auth/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (!isCheckingAuth) {
      const fetchGenre = async () => {
        setLoading(true);
        setError("");

        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `https://comics-2mkb.onrender.com/protected/genre/get-genre/${unwrappedParams.id}`,
            {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            if (response.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              router.push("/public/auth/login");
              return;
            }
            if (response.status === 404) {
              throw new Error("Genre not found");
            }
            throw new Error(data.message || "Failed to fetch genre");
          }

          const genreData = data.data;
          setGenre(genreData);
          setGenreName(genreData.genre);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchGenre();
    }
  }, [unwrappedParams.id, router, isCheckingAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://comics-2mkb.onrender.com/protected/genre/update-genre/${unwrappedParams.id}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ genre: genreName }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          router.push("/public/auth/login");
          return;
        }
        throw new Error(data.message || "Failed to update genre");
      }

      router.push(`/private/genre/${unwrappedParams.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !genre) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Link
              href="/private/genre/"
              className="text-indigo-600 hover:text-indigo-900 text-sm"
            >
              ← Back to Genre Management
            </Link>
          </div>
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error || "Genre not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            href={`/private/genre/${genre.genre_id}`}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            ← Back to Genre Details
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Genre</h1>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form className="bg-white shadow rounded-lg px-8 py-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
              Genre
            </label>
            <input
              id="genre"
              name="genre"
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Genre"}
            </button>
            <Link
              href={`/private/genre/${genre.genre_id}`}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
