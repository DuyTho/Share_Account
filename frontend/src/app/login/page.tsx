"use client";

import Link from "next/link";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Gọi API đăng nhập (POST /users/login)
      const res = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }

      // Đăng nhập thành công
      // Lưu thông tin user vào bộ nhớ trình duyệt để dùng sau này
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "admin") {
        setToast({
          show: true,
          message: "Chào mừng Sếp quay lại!",
          type: "success",
        });
        setTimeout(() => router.push("/admin/dashboard"), 1000); // Chuyển hướng vào Admin
      } else {
        setToast({
          show: true,
          message: `Xin chào, ${data.user.name}!`,
          type: "success",
        });
        setTimeout(() => router.push("/"), 1500); // Khách thường về trang chủ
      }
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
        <div className="bg-white rounded-[20px] shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* CỘT TRÁI: BANNER - Giữ nguyên */}
          <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-primary to-blue-600 p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Chào mừng trở lại!</h2>
            <p className="text-blue-100 mb-8">
              Đăng nhập để quản lý tài khoản và gia hạn các gói dịch vụ Premium.
            </p>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl">👋</span>
            </div>
          </div>

          {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
          <div className="w-full md:w-1/2 p-8 md:p-12 relative">
            <Link
              href="/"
              className="absolute top-6 left-6 text-gray-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Trang chủ
            </Link>

            <div className="mt-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Đăng nhập
              </h1>
              <p className="text-gray-500 mb-6">
                Nhập thông tin chi tiết của bạn để vào hệ thống
              </p>

              {/* Thông báo lỗi */}
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Input Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
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
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
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
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:bg-gray-400"
                >
                  {loading ? "Đang kiểm tra..." : "Đăng nhập"}
                </button>
              </form>

              {/* Phần Google và Footer giữ nguyên */}
              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative bg-white px-4 text-sm text-gray-400 font-medium">
                  Hoặc đăng nhập với
                </span>
              </div>

              {/* (Nút Google Button cũ giữ nguyên ở đây) */}

              <div className="mt-8 text-center text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-primary font-bold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
