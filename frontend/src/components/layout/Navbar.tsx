"use client"; // 1. Bắt buộc thêm dòng này để dùng localStorage và State

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  Phone,
  Mail,
  FileText,
  User,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";

export default function Navbar() {
  // 2. State để lưu thông tin user
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false); // Tránh lỗi hydration của Next.js

  // 3. Kiểm tra localStorage khi web vừa load
  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Lắng nghe sự kiện thay đổi localStorage (để khi login xong navbar tự cập nhật)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 4. Hàm Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login"; // Reload lại trang để xóa sạch state cũ
  };

  // Nếu chưa mount xong thì chưa render logic user để tránh lỗi giao diện
  if (!mounted) return null;

  return (
    <div className="w-full sticky top-0 z-50">
      {/* --- Tầng 1: Top Bar (Giữ nguyên) --- */}
      <div className="bg-primary-dark text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-end gap-6 items-center">
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>shareaccount@gmail.com</span>
          </div>
          <Link
            href="/support"
            className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
          >
            <Phone size={16} /> <span>Hỗ trợ khách hàng</span>
          </Link>
          <Link
            href="/tutorial"
            className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
          >
            <FileText size={16} /> <span>Hướng dẫn mua hàng</span>
          </Link>
        </div>
      </div>

      {/* --- Tầng 2: Main Header --- */}
      <header className="bg-primary shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Hàng trên: Logo - Search - Actions */}
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link href="/" className="bg-white px-4 py-2 rounded shadow-sm">
                <span className="text-primary text-2xl font-extrabold tracking-wider">
                  LOGO
                </span>
              </Link>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-2xl relative mx-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm gói dịch vụ..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-gray-700 shadow-inner"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>

              {/* KHU VỰC QUAN TRỌNG: User Actions */}
              <div className="flex items-center gap-4">
                {/* LOGIC: Nếu có User -> Hiện Menu, Chưa có -> Hiện nút Đăng nhập */}
                {user ? (
                  // --- GIAO DIỆN ĐÃ ĐĂNG NHẬP ---
                  <div className="relative group">
                    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border border-white/30">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-primary font-bold">
                        {user.name.charAt(0).toUpperCase()}{" "}
                        {/* Lấy chữ cái đầu của tên */}
                      </div>
                      <span className="font-medium max-w-[150px] truncate hidden md:block">
                        {user.name}
                      </span>
                      <ChevronDown size={20} />
                    </button>

                    {/* Dropdown Menu (Hiện khi hover vào group) */}
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                        >
                          <User size={18} /> Thông tin tài khoản
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                        >
                          <Package size={18} /> Đơn hàng của tôi
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut size={18} /> Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // --- GIAO DIỆN CHƯA ĐĂNG NHẬP (Cũ) ---
                  <>
                    <Link
                      href="/login"
                      className="hidden md:block px-5 py-2 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      className="hidden md:block px-5 py-2 border border-white bg-white/10 text-white rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}

                {/* Cart Icon (Luôn hiện) */}
                <Link
                  href="/cart"
                  className="relative p-2 text-white hover:opacity-80"
                >
                  <ShoppingCart size={28} />
                  {/* Badge số lượng (Demo) */}
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-primary-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary">
                    0
                  </span>
                </Link>
              </div>
            </div>

            {/* Hàng dưới: Menu Navigation (Giữ nguyên) */}
            <nav className="flex items-center gap-8 pt-2 pb-1 text-white font-bold text-lg overflow-x-auto">
              <Link
                href="/"
                className="hover:text-yellow-300 transition-colors whitespace-nowrap"
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                className="hover:text-yellow-300 transition-colors whitespace-nowrap"
              >
                Gói dịch vụ
              </Link>
              <Link
                href="/explore"
                className="hover:text-yellow-300 transition-colors whitespace-nowrap"
              >
                Khám phá
              </Link>
              <Link
                href="/news"
                className="hover:text-yellow-300 transition-colors whitespace-nowrap"
              >
                Tin tức
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
