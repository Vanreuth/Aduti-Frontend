"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartItemProps {
  item: {
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }
}

export default function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex items-center gap-6 border rounded-xl p-4">
      {/* Product Image */}
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
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline">
          <Minus size={16} />
        </Button>

        <span className="w-8 text-center">{item.quantity}</span>

        <Button size="icon" variant="outline">
          <Plus size={16} />
        </Button>
      </div>

      {/* Total */}
      <div className="w-20 text-right font-medium">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Remove */}
      <Button size="icon" variant="ghost">
        <Trash2 size={18} />
      </Button>
    </div>
  )
}
