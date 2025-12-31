"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart } from "lucide-react"

interface WishlistItemProps {
  item: {
    id: number
    name: string
    price: number
    image: string
    inStock: boolean
  }
}

export default function WishlistItem({ item }: WishlistItemProps) {
  return (
    <div className="flex items-center gap-6 border rounded-xl p-4">
      {/* Image */}
      <Image
        src={item.image}
        alt={item.name}
        width={120}
        height={120}
        className="rounded-lg"
      />

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-muted-foreground">${item.price.toFixed(2)}</p>

        <p
          className={`text-sm mt-1 ${
            item.inStock ? "text-green-600" : "text-red-500"
          }`}
        >
          {item.inStock ? "In stock" : "Out of stock"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          disabled={!item.inStock}
          className="gap-2"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Trash2 size={16} />
          Remove
        </Button>
      </div>
    </div>
  )
}
