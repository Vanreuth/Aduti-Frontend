import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Your existing product data
const productsToMigrate = [
  {
    id: "prod_001",
    name: "Esprit Ruffle Shirt",
    price: 16.64,
    originalPrice: 24.99,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RXNwcml0JTIwUnVmZmxlJTIwU2hpcnR8ZW58MHx8MHx8fDA%3D",
    category: "women",
    rating: 4.5,
    reviews: 128,
    isSale: true,
    stock: 50,
    description: "Elegant ruffle shirt perfect for any occasion",
  },
  {
    id: "prod_002",
    name: "Herschel Supply Bag",
    price: 35.31,
    image:
      "https://images.unsplash.com/photo-1673505705677-93516a00ca06?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QmFja3BhY2slMjBUcmF2ZWx8ZW58MHx8MHx8fDA%3D",
    category: "bag",
    rating: 4.8,
    reviews: 89,
    isNew: true,
    stock: 30,
    description: "Durable backpack for everyday use",
  },
  {
    id: "prod_003",
    name: "Only Check Trouser",
    price: 25.5,
    image:
      "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVufGVufDB8fDB8fHww",
    category: "men",
    rating: 4.3,
    reviews: 56,
    stock: 45,
    description: "Classic check trousers for men",
  },
  {
    id: "prod_004",
    name: "Classic Trench Coat",
    price: 75.0,
    originalPrice: 99.0,
    image:
      "https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tZW58ZW58MHx8MHx8fDA%3D",
    category: "women",
    rating: 4.7,
    reviews: 234,
    isSale: true,
    stock: 20,
    description: "Timeless trench coat for any weather",
  },
  {
    id: "prod_005",
    name: "Urban Sneakers",
    price: 64.5,
    image:
      "https://images.unsplash.com/photo-1494291793534-6f053ee9c31a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VXJiYW4lMjBTbmVha2Vyc3xlbnwwfHwwfHx8MA%3D%3D",
    category: "shoes",
    rating: 4.9,
    reviews: 312,
    isNew: true,
    stock: 60,
    description: "Comfortable urban sneakers",
  },
  {
    id: "prod_006",
    name: "Designer Watch",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U21hcnQlMjBXYXRjaCUyMFByb3xlbnwwfHwwfHx8MA%3D%3D",
    category: "watches",
    rating: 4.6,
    reviews: 178,
    stock: 25,
    description: "Elegant designer watch",
  },
  {
    id: "prod_007",
    name: "Leather Handbag",
    price: 120.0,
    originalPrice: 150.0,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGVhdGhlciUyMEhhbmRiYWd8ZW58MHx8MHx8fDA%3D",
    category: "bag",
    rating: 4.4,
    reviews: 95,
    isSale: true,
    stock: 35,
    description: "Premium leather handbag",
  },
  {
    id: "prod_008",
    name: "Smart Watch Pro",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1676554565987-524692127b1a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U21hcnQlMjBXYXRjaCUyMFByb3xlbnwwfHwwfHx8MA%3D%3D",
    category: "watches",
    rating: 4.8,
    reviews: 267,
    isNew: true,
    stock: 40,
    description: "Advanced smartwatch with health tracking",
  },
  {
    id: "prod_009",
    name: "Running Shoes",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1597892657493-6847b9640bac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UnVubmluZyUyMFNob2VzfGVufDB8fDB8fHww",
    category: "shoes",
    rating: 4.5,
    reviews: 189,
    stock: 55,
    description: "High-performance running shoes",
  },
  {
    id: "prod_010",
    name: "Casual T-Shirt",
    price: 29.99,
    image:
      "https://plus.unsplash.com/premium_photo-1689327920821-bbeebd80f6ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q2FzdWFsJTIwVC1TaGlydHxlbnwwfHwwfHx8MA%3D%3D",
    category: "men",
    rating: 4.2,
    reviews: 76,
    stock: 70,
    description: "Comfortable casual t-shirt",
  },
  {
    id: "prod_011",
    name: "Summer Dress",
    price: 59.99,
    originalPrice: 79.99,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D",
    category: "women",
    rating: 4.6,
    reviews: 145,
    isSale: true,
    stock: 40,
    description: "Light and breezy summer dress",
  },
  {
    id: "prod_012",
    name: "Backpack Travel",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1673505705677-93516a00ca06?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QmFja3BhY2slMjBUcmF2ZWx8ZW58MHx8MHx8fDA%3D",
    category: "bag",
    rating: 4.7,
    reviews: 203,
    isNew: true,
    stock: 50,
    description: "Spacious travel backpack",
  },
];

export async function migrateProductsToFirebase() {
  console.log("Starting product migration...");

  try {
    for (const product of productsToMigrate) {
      const productRef = doc(db, "products", product.id);

      await setDoc(productRef, {
        ...product,
        createdAt: serverTimestamp(),
        featured: product.isNew || product.isSale || false,
      });

      console.log(`✅ Migrated: ${product.name}`);
    }

    console.log("✅ All products migrated successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}
