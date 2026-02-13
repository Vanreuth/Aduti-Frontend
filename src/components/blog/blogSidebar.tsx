import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type SidebarProduct = {
  image: string
  name: string
  price: string
  href: string
}

const defaultCategories = ["Fashion", "Beauty", "Street Style", "Life Style", "DIY & Crafts"]

const defaultProducts: SidebarProduct[] = [
  { image: "/product/product-03.jpg", name: "White Shirt", price: "$19.00", href: "/shop" },
  { image: "/product/product-09.jpg", name: "Converse Shoes", price: "$39.00", href: "/shop" },
  { image: "/product/product-15.jpg", name: "Leather Watch", price: "$17.00", href: "/shop" },
]

type BlogSidebarProps = {
  categories?: string[]
  products?: SidebarProduct[]
}

export default function BlogSidebar({
  categories = defaultCategories,
  products = defaultProducts,
}: BlogSidebarProps) {
  return (
    <aside className="space-y-12">
      {/* Search */}
      <div className="flex gap-2">
        <Input placeholder="Search..." />
        <Button>Search</Button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold mb-4">Categories</h4>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat} className="text-muted-foreground hover:text-primary">
              <button type="button">{cat}</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Featured Products */}
      <div>
        <h4 className="font-semibold mb-4">Featured Products</h4>
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.name} className="flex gap-4">
              <Image src={p.image} alt={p.name} width={70} height={70} />
              <div>
                <Link href={p.href} className="text-sm hover:text-primary">
                  {p.name}
                </Link>
                <span className="text-sm text-muted-foreground">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
