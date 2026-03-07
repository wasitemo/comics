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

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://comics-2mkb.onrender.com/public/blog/get-blog?page=1&limit=3"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        if (data.data) {
          setBlogs(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-8 bg-gray-950">
        <h3 className="text-3xl font-bold mb-10">Blog Terbaru</h3>
        <div className="text-center text-gray-400">Loading...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-8 bg-gray-950">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-3xl font-bold">Blog Terbaru</h3>
        <Link
          href="/public/blog"
          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
        >
          Lihat Semua →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Link href={`/public/blog/${blog.blog_id}`} key={blog.blog_id}>
              <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition">
                {blog.blog_image_url ? (
                  <img
                    src={blog.blog_image_url}
                    alt={blog.blog_title}
                    className="w-full h-40 object-cover mb-4 rounded"
                  />
                ) : (
                  <div className="h-40 bg-gray-700 mb-4 rounded"></div>
                )}
                <h4 className="font-bold text-lg mb-2">{blog.blog_title}</h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {blog.blog_content}
                </p>
                <button className="bg-yellow-400 text-black px-4 py-2 rounded text-sm font-medium">
                  Baca Selengkapnya
                </button>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-400">No blogs available</div>
        )}
      </div>
    </section>
  );
}
