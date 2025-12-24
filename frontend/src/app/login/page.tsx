"use client";

import Link from "next/link";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";

// 1. Import Firebase
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

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

  // --- XỬ LÝ ĐĂNG NHẬP THƯỜNG ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");

      handleLoginSuccess(data.user);
    } catch (err: any) {
      setToast({ show: true, message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- 2. XỬ LÝ ĐĂNG NHẬP GOOGLE ---
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true); // Tận dụng state loading để khóa nút

    try {
      // A. Gọi popup đăng nhập của Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // B. Gửi thông tin user về Backend của bạn để xử lý (Tạo user mới hoặc lấy token)
      // Backend cần có endpoint này: POST /users/google-login
      const res = await fetch("http://localhost:8080/users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL,
          google_id: user.uid, // Dùng cái này để định danh duy nhất
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Lỗi đăng nhập Google");

      // C. Đăng nhập thành công
      handleLoginSuccess(data.user);
    } catch (err: any) {
      console.error(err);
      setToast({
        show: true,
        message: "Lỗi đăng nhập Google: " + err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM CHUNG XỬ LÝ SAU KHI LOGIN THÀNH CÔNG ---
  const handleLoginSuccess = (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "admin") {
      setToast({
        show: true,
        message: "Chào mừng Sếp quay lại!",
        type: "success",
      });
      setTimeout(() => router.push("/admin/dashboard"), 1000);
    } else {
      setToast({
        show: true,
        message: `Xin chào, ${user.name}!`,
        type: "success",
      });
      setTimeout(() => router.push("/"), 1500);
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
          {/* CỘT TRÁI - Giữ nguyên */}
          <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-primary to-blue-600 p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Chào mừng trở lại!</h2>
            <p className="text-blue-100 mb-8">
              Đăng nhập để quản lý tài khoản và gia hạn các gói dịch vụ Premium.
            </p>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl">👋</span>
            </div>
          </div>

          {/* CỘT PHẢI */}
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

              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Input Email & Password giữ nguyên */}
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
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </form>

              {/* PHẦN ĐĂNG NHẬP GOOGLE */}
              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative bg-white px-4 text-sm text-gray-400 font-medium">
                  Hoặc đăng nhập với
                </span>
              </div>

              <button
                type="button" // Quan trọng: type button để không submit form
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                {/* Google Icon SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>

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
