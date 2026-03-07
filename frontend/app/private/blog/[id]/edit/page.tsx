"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Blog {
  blog_id: number;
  account_id: number;
  blog_title: string;
  blog_content: string;
  blog_image_id: string;
  blog_image_url: string;
}

export default function PrivateBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      const fetchBlog = async () => {
        setLoading(true);
        setError("");

        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `https://comics-2mkb.onrender.com/protected/blog/get-blog/${unwrappedParams.id}`,
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
              throw new Error("Blog not found");
            }
            throw new Error(data.message || "Failed to fetch blog");
          }

          const blogData = data.data;
          setBlog(blogData);
          setBlogTitle(blogData.blog_title);
          setBlogContent(blogData.blog_content);
          setImagePreview(blogData.blog_image_url);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    }
  }, [unwrappedParams.id, router, isCheckingAuth]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("blog_title", blogTitle);
      formData.append("blog_content", blogContent);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `https://comics-2mkb.onrender.com/protected/blog/update-blog/${unwrappedParams.id}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
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
        throw new Error(data.message || "Failed to update blog");
      }

      router.push(`/private/blog/${unwrappedParams.id}`);
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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Link
              href="/private/blog/"
              className="text-indigo-600 hover:text-indigo-900 text-sm"
            >
              ← Back to Blog Management
            </Link>
          </div>
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error || "Blog not found"}</p>
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
            href={`/private/blog/${blog.blog_id}`}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            ← Back to Blog Details
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Blog</h1>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form className="bg-white shadow rounded-lg px-8 py-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="blogTitle" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="blogTitle"
              name="blogTitle"
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="blogContent" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="blogContent"
              name="blogContent"
              required
              rows={6}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image <span className="text-gray-500 font-normal">(leave empty to keep current)</span>
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
              disabled={submitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Blog"}
            </button>
            <Link
              href={`/private/blog/${blog.blog_id}`}
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
