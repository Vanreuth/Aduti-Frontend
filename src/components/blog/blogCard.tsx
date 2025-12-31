import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BlogCardProps {
  blog: {
    image: string
    date: string
    title: string
    description: string
    comments: string
  }
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="space-y-6">
      <Link href="/blog/1" className="block overflow-hidden rounded-xl">
        <Image
          src={blog.image}
          alt={blog.title}
          width={900}
          height={500}
          className="w-full object-cover hover:scale-105 transition"
        />
      </Link>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold hover:text-primary">
          <Link href="/blog/1">{blog.title}</Link>
        </h2>

        <p className="text-muted-foreground">{blog.description}</p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>By Admin • {blog.comments}</span>

          <Link
            href="/blog/1"
            className="flex items-center gap-2 hover:text-primary"
          >
            Continue Reading <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}
