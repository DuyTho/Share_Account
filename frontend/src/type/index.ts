// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string; // VD: Gói Youtube Premium 6 Tháng
  price: number;
  durationMonths: number;
  features: string[]; // Các dòng mô tả lợi ích
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}