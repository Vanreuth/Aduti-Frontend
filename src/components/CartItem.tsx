"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export type CartLineItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

interface CartItemProps {
  item: CartLineItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
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
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{item.name}</h3>
        <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          disabled={item.quantity <= 1}
          onClick={() => onDecrease(item.id)}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </Button>

        <span className="w-8 text-center">{item.quantity}</span>

        <Button
          size="icon"
          variant="outline"
          onClick={() => onIncrease(item.id)}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Total */}
      <div className="w-24 text-right font-medium">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Remove */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
}
