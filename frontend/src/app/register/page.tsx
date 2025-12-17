"use client";

import Link from "next/link";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Dùng để chuyển trang
import Toast from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();

  // State lưu dữ liệu nhập vào
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. State quản lý Toast
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Hàm xử lý khi bấm nút Đăng ký
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Chặn reload trang
    setError("");
    setLoading(true);

    try {
      // Gọi API tạo user (POST /users)
      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, // Tạm thời hardcode số đt nếu DB bắt buộc, hoặc sửa DB cho allow null
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }

      // Thành công -> Báo user và chuyển sang trang login
      setToast({
        show: true,
        message: "Đăng ký thành công! Đang chuyển hướng...",
        type: "success",
      });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setToast({ show: true, message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[500px]">
          {/* CỘT PHẢI (BANNER) - Giữ nguyên */}
          <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Gia nhập Share Account</h2>
            <p className="text-indigo-100 mb-8">
              Tạo tài khoản để bắt đầu trải nghiệm Youtube Premium giá rẻ.
            </p>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl">🚀</span>
            </div>
          </div>

          {/* CỘT TRÁI (FORM) */}
          <div className="w-full md:w-1/2 p-8 md:p-12 relative">
            <Link
              href="/"
              className="absolute top-6 left-6 text-gray-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Trang chủ
            </Link>

            <div className="mt-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Tạo tài khoản mới
              </h1>

              {/* Hiển thị lỗi nếu có */}
              {error && (
                <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Input Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                      // Binding dữ liệu
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
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
                      required
                      type="email"
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
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
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:bg-gray-400"
                >
                  {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
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
