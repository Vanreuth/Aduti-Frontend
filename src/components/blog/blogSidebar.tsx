import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const categories = ["Fashion", "Beauty", "Street Style", "Life Style", "DIY & Crafts"]

export default function BlogSidebar() {
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
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* Featured Products */}
      <div>
        <h4 className="font-semibold mb-4">Featured Products</h4>
        <div className="space-y-4">
          {[
            { img: "/product/product-03.jpg", name: "White Shirt", price: "$19.00" },
            { img: "/product/product-09.jpg", name: "Converse Shoes", price: "$39.00" },
            { img: "/product/product-15.jpg", name: "Leather Watch", price: "$17.00" },
          ].map((p) => (
            <div key={p.name} className="flex gap-4">
              <Image src={p.img} alt={p.name} width={70} height={70} />
              <div>
                <p className="text-sm">{p.name}</p>
                <span className="text-sm text-muted-foreground">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
