"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import BlogCard from "@/components/blog/blogCard"
import BlogSidebar from "@/components/blog/blogSidebar"
import { getProductBlogs, type ProductBlogItem } from "@/lib/api/blog"

export default function BlogPage() {
  const [blogs, setBlogs] = useState<ProductBlogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        const data = await getProductBlogs(9)
        if (!active) return
        setBlogs(data)
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(
    () =>
      Array.from(new Set(blogs.map((item) => item.category).filter(Boolean))).slice(
        0,
        5,
      ),
    [blogs],
  )
  const sidebarProducts = useMemo(
    () =>
      blogs.slice(0, 3).map((item) => ({
        image: item.image,
        name: item.title,
        price: item.priceLabel,
        href: item.href,
      })),
    [blogs],
  )

  return (
    <>
      {/* Hero */}
      <section className="relative h-[260px] sm:h-[300px]">
        <Image
          src="/blog/bg-02.jpg"
          alt="Blog background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-4xl font-bold text-white">Blog</h1>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Blog List */}
          <div className="space-y-12 lg:col-span-9 sm:space-y-16">
            {loading ? (
              <div className="space-y-6">
                <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
                <div className="h-64 animate-pulse rounded-2xl bg-zinc-200" />
              </div>
            ) : blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogCard key={String(blog.id)} blog={blog} />
              ))
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
                <p className="text-lg font-semibold text-zinc-900">No posts available</p>
                <p className="mt-2 text-sm text-zinc-600">
                  No product data found to build blog content.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <BlogSidebar categories={categories} products={sidebarProducts} />
          </div>
        </div>
      </section>
    </>
  )
}
