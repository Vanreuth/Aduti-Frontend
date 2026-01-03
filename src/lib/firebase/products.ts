import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import { Product } from "@/types/product";

// Get all products
// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}

// Get product by ID
export async function getProductById(
  productId: string
): Promise<Product | null> {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data(),
      } as Product;
    }

    return null;
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
}

// Get products by category
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    if (category.toLowerCase() === "all") {
      return getAllProducts();
    }

    const q = query(
      collection(db, "products"),
      where("category", "==", category.toLowerCase())
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );
  } catch (error) {
    console.error("Error getting products by category:", error);
    return [];
  }
}

// Get products with filters
export async function getFilteredProducts(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isSale?: boolean;
  isNew?: boolean;
}): Promise<Product[]> {
  try {
    const constraints: QueryConstraint[] = [];

    // Category filter
    if (filters.category && filters.category.toLowerCase() !== "all") {
      constraints.push(where("category", "==", filters.category.toLowerCase()));
    }

    // Sale filter
    if (filters.isSale) {
      constraints.push(where("isSale", "==", true));
    }

    // New filter
    if (filters.isNew) {
      constraints.push(where("isNew", "==", true));
    }

    const q = query(collection(db, "products"), ...constraints);
    const querySnapshot = await getDocs(q);

    let products = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );

    // Price filter (client-side since Firestore doesn't support range queries easily)
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      products = products.filter((product) => {
        const price = product.price;
        const meetsMin =
          filters.minPrice === undefined || price >= filters.minPrice;
        const meetsMax =
          filters.maxPrice === undefined || price <= filters.maxPrice;
        return meetsMin && meetsMax;
      });
    }

    return products;
  } catch (error) {
    console.error("Error getting filtered products:", error);
    return [];
  }
}

// Get featured products
export async function getFeaturedProducts(
  maxProducts: number = 8
): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("featured", "==", true),
      limit(maxProducts)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );
  } catch (error) {
    console.error("Error getting featured products:", error);
    return [];
  }
}

// Search products
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation. For production, consider using Algolia or similar
    const querySnapshot = await getDocs(collection(db, "products"));

    const allProducts = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Product)
    );

    const searchLower = searchTerm.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}
