"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

// Dữ liệu giả lập giỏ hàng (Sau này sẽ lấy từ LocalStorage hoặc Database)
interface CartItem {
  id: number;
  title: string;
  price: number;
  period: string; // VD: / tháng, / năm
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "Gói 1 năm",
      price: 800000,
      period: "/ năm",
      quantity: 1,
    },
    {
      id: 2,
      title: "Gói 1 tháng",
      price: 100000,
      period: "/ tháng",
      quantity: 2,
    },
  ]);

  // Hàm format tiền tệ (VD: 100000 -> 100.000đ)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Tính tổng tiền
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Xử lý tăng/giảm số lượng
  const updateQuantity = (id: number, change: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(1, newQuantity) }; // Không cho giảm dưới 1
        }
        return item;
      })
    );
  };

  // Xử lý xóa sản phẩm
  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Giỏ hàng của bạn
        </h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  {/* Info Sản phẩm */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Hình ảnh placeholder đơn giản */}
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
                        alt="Youtube Premium"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Gói Family Premium
                      </p>
                    </div>
                  </div>

                  {/* Bộ điều khiển số lượng & Giá */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                    {/* Nút tăng giảm */}
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Giá tiền */}
                    <div className="text-right min-w-[100px]">
                      <div className="font-bold text-primary text-lg">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatCurrency(item.price)} {item.period}
                      </div>
                    </div>

                    {/* Nút xóa */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG --- */}
            <div className="lg:w-[380px]">
              <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Thông tin thanh toán
                </h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Giảm giá</span>
                    <span className="text-gray-400">0đ</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <Link href="/checkout" className="block w-full">
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                    <span>Tiến hành thanh toán</span>
                    <ArrowRight size={20} />
                  </button>
                </Link>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Bảo mật thanh toán 100%
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Trạng thái khi giỏ hàng trống
          <div className="text-center py-20 bg-white rounded-[20px]">
            <p className="text-gray-500 mb-6 text-lg">
              Giỏ hàng của bạn đang trống
            </p>
            <Link
              href="/"
              className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
            >
              Quay lại mua sắm
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
