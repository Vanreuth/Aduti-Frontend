import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export type BlogCardData = {
  image: string
  date: string
  title: string
  description: string
  comments?: string
  author?: string
  href?: string
}

interface BlogCardProps {
  blog: BlogCardData
}

export default function BlogCard({ blog }: BlogCardProps) {
  const href = blog.href || "/shop"
  const author = blog.author || "Admin"
  const comments = blog.comments || "0 Comments"

  return (
    <article className="space-y-6">
      <Link href={href} className="block overflow-hidden rounded-xl">
        <Image
          src={blog.image}
          alt={blog.title}
          width={900}
          height={500}
          className="w-full object-cover hover:scale-105 transition"
        />
      </Link>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{blog.date}</p>
        <h2 className="text-2xl font-semibold hover:text-primary">
          <Link href={href}>{blog.title}</Link>
        </h2>

        <p className="text-muted-foreground">{blog.description}</p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>By {author} • {comments}</span>

          <Link
            href={href}
            className="flex items-center gap-2 hover:text-primary"
          >
            Continue Reading <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}
