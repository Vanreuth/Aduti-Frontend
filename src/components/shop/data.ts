import { Product, PriceRange } from "./types";

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Esprit Ruffle Shirt",
    price: 16.64,
    originalPrice: 24.99,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RXNwcml0JTIwUnVmZmxlJTIwU2hpcnR8ZW58MHx8MHx8fDA%3D",
    category: "women",
    rating: 4.5,
    reviews: 128,
    isSale: true,
  },
  {
    id: 2,
    name: "Herschel Supply Bag",
    price: 35.31,
    image:
      "https://images.unsplash.com/photo-1673505705677-93516a00ca06?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QmFja3BhY2slMjBUcmF2ZWx8ZW58MHx8MHx8fDA%3D",
    category: "bag",
    rating: 4.8,
    reviews: 89,
    isNew: true,
  },
  {
    id: 3,
    name: "Only Check Trouser",
    price: 25.5,
    image:
      "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVufGVufDB8fDB8fHww",
    category: "men",
    rating: 4.3,
    reviews: 56,
  },
  {
    id: 4,
    name: "Classic Trench Coat",
    price: 75.0,
    originalPrice: 99.0,
    image:
      "https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tZW58ZW58MHx8MHx8fDA%3D",
    category: "women",
    rating: 4.7,
    reviews: 234,
    isSale: true,
  },
  {
    id: 5,
    name: "Urban Sneakers",
    price: 64.5,
    image:
      "https://images.unsplash.com/photo-1494291793534-6f053ee9c31a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VXJiYW4lMjBTbmVha2Vyc3xlbnwwfHwwfHx8MA%3D%3D",
    category: "shoes",
    rating: 4.9,
    reviews: 312,
    isNew: true,
  },
  {
    id: 6,
    name: "Designer Watch",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U21hcnQlMjBXYXRjaCUyMFByb3xlbnwwfHwwfHx8MA%3D%3D",
    category: "watches",
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 7,
    name: "Leather Handbag",
    price: 120.0,
    originalPrice: 150.0,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGVhdGhlciUyMEhhbmRiYWd8ZW58MHx8MHx8fDA%3D",
    category: "bag",
    rating: 4.4,
    reviews: 95,
    isSale: true,
  },
  {
    id: 8,
    name: "Smart Watch Pro",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1676554565987-524692127b1a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U21hcnQlMjBXYXRjaCUyMFByb3xlbnwwfHwwfHx8MA%3D%3D",
    category: "watches",
    rating: 4.8,
    reviews: 267,
    isNew: true,
  },
  {
    id: 9,
    name: "Running Shoes",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1597892657493-6847b9640bac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UnVubmluZyUyMFNob2VzfGVufDB8fDB8fHww",
    category: "shoes",
    rating: 4.5,
    reviews: 189,
  },
  {
    id: 10,
    name: "Casual T-Shirt",
    price: 29.99,
    image:
      "https://plus.unsplash.com/premium_photo-1689327920821-bbeebd80f6ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q2FzdWFsJTIwVC1TaGlydHxlbnwwfHwwfHx8MA%3D%3D",
    category: "men",
    rating: 4.2,
    reviews: 76,
  },
  {
    id: 11,
    name: "Summer Dress",
    price: 59.99,
    originalPrice: 79.99,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D",
    category: "women",
    rating: 4.6,
    reviews: 145,
    isSale: true,
  },
  {
    id: 12,
    name: "Backpack Travel",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1673505705677-93516a00ca06?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QmFja3BhY2slMjBUcmF2ZWx8ZW58MHx8MHx8fDA%3D",
    category: "bag",
    rating: 4.7,
    reviews: 203,
    isNew: true,
  },
];

export const categories = ["All", "Women", "Men", "Bag", "Shoes", "Watches"];

export const priceRanges: PriceRange[] = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];
