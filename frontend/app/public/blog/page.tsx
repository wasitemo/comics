"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Blog {
  blog_id: number;
  account_id: number;
  blog_title: string;
  blog_content: string;
  blog_image_url: string;
  create_at: string;
}

export default function PublicBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const limit = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://comics-2mkb.onrender.com/public/blog/get-blog?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        if (data.data) {
          setBlogs(data.data);
          setTotalPage(data.total_page || 1);
          setTotalData(data.total_data || 0);
        }
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && blogs.length === 0) {
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
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Blog</h1>
          <p className="mt-2 text-gray-600">Total: {totalData} articles</p>
        </div>

        {blogs.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  href={`/public/blog/${blog.blog_id}`}
                  key={blog.blog_id}
                  className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
                >
                  {blog.blog_image_url ? (
                    <img
                      src={blog.blog_image_url}
                      alt={blog.blog_title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200"></div>
                  )}
                  <div className="p-6">
                    <h2 className="font-bold text-lg mb-2 line-clamp-2">
                      {blog.blog_title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.blog_content}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {new Date(blog.create_at).toLocaleDateString()}
                      </span>
                      <span className="text-indigo-600 text-sm font-medium">
                        Read More →
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
            <p className="text-gray-500 text-lg">No blogs available</p>
          </div>
        )}
      </div>
    </div>
  );
}
