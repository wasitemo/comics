"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Blog {
  blog_id: number;
  account_id: number;
  blog_title: string;
  blog_content: string;
  blog_image_url: string;
  create_at: string;
}

export default function PublicBlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `https://comics-2mkb.onrender.com/public/blog/get-blog/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blog details");
        }

        const data = await response.json();
        setBlog(data.data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
        setError(err instanceof Error ? err.message : "Blog not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || "Blog not found"}</p>
          <Link
            href="/public/blog"
            className="text-indigo-600 hover:text-indigo-900"
          >
            ← Back to Blogs
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
            href="/public/blog"
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            ← Back to Blogs
          </Link>
        </div>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {blog.blog_image_url && (
            <img
              src={blog.blog_image_url}
              alt={blog.blog_title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {blog.blog_title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span>
                {new Date(blog.create_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {blog.blog_content}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
