"use client";

import Link from "next/link";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[500px]">
          {/* --- CỘT PHẢI (BANNER) --- */}
          <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Gia nhập Share Account</h2>
            <p className="text-indigo-100 mb-8">
              Tạo tài khoản để bắt đầu trải nghiệm Youtube Premium giá rẻ và
              chất lượng ngay hôm nay.
            </p>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl">🚀</span>
            </div>
          </div>

          {/* --- CỘT TRÁI (FORM) --- */}
          <div className="w-full md:w-1/2 p-8 md:p-12 relative">
            <Link
              href="/"
              className="absolute top-6 left-6 text-gray-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Trang chủ
            </Link>

            <div className="mt-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Tạo tài khoản mới
              </h1>

              <form className="space-y-4">
                {/* Input Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                {/* Input Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                {/* Input Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                {/* Button Submit */}
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
                >
                  Đăng ký tài khoản
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-primary font-bold hover:underline"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
