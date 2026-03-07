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
  create_at: string;
}

export default function PrivateBlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
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

          setBlog(data.data || null);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    }
  }, [unwrappedParams.id, router, isCheckingAuth]);

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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/private/blog/"
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            ← Back to Blog Management
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Blog Details</h1>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Blog Information</h2>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{blog.blog_id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-900">{blog.blog_title}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Content</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{blog.blog_content}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Account ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{blog.account_id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Image</dt>
                <dd className="mt-1 text-sm">
                  {blog.blog_image_url ? (
                    <a
                      href={blog.blog_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Image
                    </a>
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">{blog.create_at}</dd>
              </div>
            </dl>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-4">
            <Link
              href={`/private/blog/${blog.blog_id}/edit`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Edit Blog
            </Link>
            <Link
              href="/private/blog/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
