import Image from "next/image"
import BlogCard from "@/components/blog/blogCard"
import BlogSidebar from "@/components/blog/blogSidebar"

const blogs = [
  {
    image: "/blog/blog-01.jpg",
    date: "22 Jan 2018",
    title: "8 Inspiring Ways to Wear Dresses in the Winter",
    description: "Class aptent taciti sociosqu ad litora torquent...",
    comments: "8 Comments",
  },
  {
    image: "/blog/blog-02.jpg",
    date: "18 Jan 2018",
    title: "The Great Big List of Men’s Gifts for the Holidays",
    description: "Class aptent taciti sociosqu ad litora torquent...",
    comments: "8 Comments",
  },
  {
    image: "/blog/blog-03.jpg",
    date: "16 Jan 2018",
    title: "5 Winter-to-Spring Fashion Trends to Try Now",
    description: "Class aptent taciti sociosqu ad litora torquent...",
    comments: "8 Comments",
  },
]

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[300px]">
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
      <section className="max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Blog List */}
          <div className="lg:col-span-9 space-y-16">
            {blogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}

            {/* Pagination */}
            <div className="flex gap-3">
              <button className="h-10 w-10 rounded border bg-black text-white">
                1
              </button>
              <button className="h-10 w-10 rounded border">2</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <BlogSidebar />
          </div>
        </div>
      </section>
    </>
  )
}
