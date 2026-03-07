"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Genre {
  genre_id: number;
  genre: string;
}

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
  product_image_id?: string;
}

export default function PrivateProductEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = useParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [productTitle, setProductTitle] = useState("");
  const [genre, setGenre] = useState<number[]>([]);
  const [author, setAuthor] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [price, setPrice] = useState("");
  const [sypnosis, setSypnosis] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/public/auth/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          "https://comics-2mkb.onrender.com/protected/product/get-list-genre",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch genres:", response.status);
          return;
        }

        const data = await response.json();
        if (data.data) {
          setGenres(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch genres", err);
        setError("Failed to load genres. Please refresh the page.");
      }
    };

    if (!isCheckingAuth) {
      fetchGenres();
    }
  }, [isCheckingAuth]);

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
          throw new Error("Failed to fetch product details");
        }

        const data = await response.json();
        const product: Product = data.data;

        console.log("Product data:", product);

        setProductTitle(product.product_title);
        setAuthor(product.author);
        // Ensure release_date is in YYYY-MM-DD format for input type="date"
        const formattedDate = product.release_date ? product.release_date.split('T')[0] : '';
        console.log("Release date:", product.release_date, "-> formatted:", formattedDate);
        setReleaseDate(formattedDate);
        setPrice(product.price);
        setSypnosis(product.sypnosis);
        setImagePreview(product.product_image_url);

        // Map genre names to genre_ids
        if (product.genres && product.genres.length > 0 && genres.length > 0) {
          const selectedGenreIds = product.genres
            .map((genreName) => {
              const found = genres.find((g) => g.genre === genreName);
              return found ? found.genre_id : null;
            })
            .filter((id): id is number => id !== null);
          console.log("Selected genre IDs:", selectedGenreIds);
          setGenre(selectedGenreIds);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setFetchingProduct(false);
      }
    };

    if (!isCheckingAuth && genres.length > 0) {
      fetchProduct();
    }
  }, [isCheckingAuth, genres]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreChange = (genreId: number, checked: boolean) => {
    if (checked) {
      setGenre((prev) => [...prev, genreId]);
    } else {
      setGenre((prev) => prev.filter((id) => id !== genreId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (genre.length === 0) {
      setError("Please select at least one genre");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("product_title", productTitle);
      formData.append("author", author);
      formData.append("release_date", releaseDate);
      formData.append("price", String(price));
      formData.append("sypnosis", sypnosis);
      // Send genre as JSON string array
      formData.append("genre", JSON.stringify(genre));
      if (image) {
        formData.append("image", image);
      }

      console.log("Submitting formData:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(
        `https://comics-2mkb.onrender.com/protected/product/update-product/${id}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          router.push("/public/auth/login");
          return;
        }
        throw new Error(data.message || "Failed to update product");
      }

      router.push("/private/product/");
    } catch (err) {
      console.error("Update error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth || fetchingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            href="/private/product/"
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            ← Back to Product Management
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form className="bg-white shadow rounded-lg px-8 py-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="productTitle" className="block text-sm font-medium text-gray-700">
              Product Title
            </label>
            <input
              id="productTitle"
              name="productTitle"
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Genre
            </label>
            <div className="mt-2 space-y-2">
              {genres.map((g) => (
                <label key={g.genre_id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={genre.includes(g.genre_id)}
                    onChange={(e) => handleGenreChange(g.genre_id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{g.genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              id="author"
              name="author"
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">
              Release Date
            </label>
            <input
              id="releaseDate"
              name="releaseDate"
              type="date"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="sypnosis" className="block text-sm font-medium text-gray-700">
              Synopsis
            </label>
            <textarea
              id="sypnosis"
              name="sypnosis"
              required
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={sypnosis}
              onChange={(e) => setSypnosis(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image (optional)
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-auto object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
            <Link
              href="/private/product/"
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
