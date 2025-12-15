"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import {
  CreditCard,
  Wallet,
  Building2,
  CheckCircle2,
  QrCode,
} from "lucide-react";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("banking");

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Thanh toán đơn hàng
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- CỘT TRÁI: THÔNG TIN ĐƠN HÀNG --- */}
          <div className="lg:w-1/3 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Thông tin đơn hàng
              </h3>

              {/* Sản phẩm mẫu */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
                    alt="Youtube Premium"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Youtube Premium</h4>
                  <p className="text-sm text-gray-500">Gói 12 tháng</p>
                </div>
                <div className="font-bold text-primary">300.000đ</div>
              </div>

              {/* Tổng kết */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>300.000đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Giảm giá:</span>
                  <span>0đ</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-gray-900">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-primary">
                  300.000đ
                </span>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: FORM ĐIỀN THÔNG TIN --- */}
          <div className="lg:w-2/3 order-1 lg:order-2 space-y-8">
            {/* 1. Thông tin khách hàng */}
            <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                1. Thông tin khách hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Họ và tên của bạn"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <input
                type="email"
                placeholder="Email nhận dịch vụ (Quan trọng)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-2 ml-1">
                * Vui lòng điền chính xác Email. Chúng tôi sẽ xác nhận tài khoản
                này là tài khoản sử dụng dịch vụ.
              </p>
            </div>

            {/* 2. Phương thức thanh toán */}
            <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                2. Chọn phương thức thanh toán
              </h3>

              <div className="space-y-4">
                {/* Option: Chuyển khoản */}
                <div
                  onClick={() => setPaymentMethod("banking")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "banking"
                      ? "border-primary bg-blue-50 ring-1 ring-primary"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-primary">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Chuyển khoản ngân hàng
                      </p>
                      <p className="text-xs text-gray-500">
                        Vietcombank, Techcombank...
                      </p>
                    </div>
                  </div>
                  {paymentMethod === "banking" && (
                    <CheckCircle2 className="text-primary" size={20} />
                  )}
                </div>

                {/* Option: Ví MoMo */}
                <div
                  onClick={() => setPaymentMethod("momo")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "momo"
                      ? "border-primary bg-blue-50 ring-1 ring-primary"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* LOGO MOMO */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 bg-white">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                        alt="MoMo"
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">Ví MoMo</p>
                      <p className="text-xs text-gray-500">
                        Thanh toán siêu tốc
                      </p>
                    </div>
                  </div>
                  {paymentMethod === "momo" && (
                    <CheckCircle2 className="text-primary" size={20} />
                  )}
                </div>

                {/* Option: Thẻ ATM */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-blue-50 ring-1 ring-primary"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                      <CreditCard size={20} />
                    </div>
                    <p className="font-bold text-gray-900">
                      Thẻ ATM / Visa / Master
                    </p>
                  </div>
                  {paymentMethod === "card" && (
                    <CheckCircle2 className="text-primary" size={20} />
                  )}
                </div>
              </div>
            </div>

            {/* Nút Thanh Toán */}
            <Link href="/checkout/payment" className="w-full">
              <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-shadow shadow-lg shadow-blue-200 uppercase tracking-wide">
                Thanh toán ngay (300.000đ)
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
