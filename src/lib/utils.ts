import { type ClassValue, clsx } from 'clsx';
import { Timestamp } from 'firebase/firestore';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface User {
  nickname: string;
  isSeller: boolean;
}

export interface Product {
  createdAt: Timestamp;
  id: string;
  productCategory: string;
  productDescription: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  sellerId: number;
  updatedAt: Timestamp;
  imageUrl?: string;
}

export interface FetchProductsResult {
  products: Product[];
  nextPage: string | null;
}
