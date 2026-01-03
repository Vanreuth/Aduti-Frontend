export interface Product {
  id: string; // Change from number to string for Firestore
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isSale?: boolean;
  isNew?: boolean;
  description?: string;
  stock?: number;
  createdAt?: Date;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface ProductForm {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  rating: string;
  reviews: string;
  stock: string;
  description: string;
  isSale: boolean;
  isNew: boolean;
}
