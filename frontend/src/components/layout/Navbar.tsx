"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react"; // 1. Import thêm useRef
import {
  ShoppingCart,
  Search,
  Mail,
  FileText,
  User,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";

import Image from "next/image";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 2. State quản lý đóng mở menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 3. Ref để xác định vùng menu (để xử lý click outside)
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCartCount = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/cart/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const total = data.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartCount(total);
      }
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCartCount(parsedUser.user_id);
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        const parsed = JSON.parse(updatedUser);
        setUser(parsed);
        fetchCartCount(parsed.user_id);
      } else {
        setUser(null);
        setCartCount(0);
      }
    };

    const handleCartUpdate = () => {
      const currentUser = localStorage.getItem("user");
      if (currentUser) {
        fetchCartCount(JSON.parse(currentUser).user_id);
      }
    };

    // 4. Logic: Click ra ngoài thì đóng menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);
    document.addEventListener("mousedown", handleClickOutside); // Lắng nghe click toàn trang

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    window.location.href = "/login";
  };

  // Hàm toggle menu khi click
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!mounted) return null;

  return (
    <div className="w-full sticky top-0 z-50">
      <div className="bg-primary-dark text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-end gap-6 items-center">
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>shareaccount@gmail.com</span>
          </div>
          <Link
            href="/tutorial"
            className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
          >
            <FileText size={16} /> <span>Hướng dẫn mua hàng</span>
          </Link>
        </div>
      </div>

      <header className="bg-primary shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="px-4 py-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </Link>

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

              <div className="flex items-center gap-4">
                {user ? (
                  // 5. Gán Ref vào div cha và bỏ class 'group' cũ
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown} // 6. Thêm sự kiện Click
                      className={`flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors border ${
                        isDropdownOpen ? "border-white" : "border-white/30"
                      }`}
                    >
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-primary font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium max-w-[150px] truncate hidden md:block">
                        {user.name}
                      </span>
                      {/* Xoay icon khi mở */}
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* 7. Hiển thị có điều kiện dựa trên State, bỏ 'group-hover' */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
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
                            onClick={() => setIsDropdownOpen(false)} // Đóng khi click link
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                          >
                            <User size={18} /> Thông tin tài khoản
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setIsDropdownOpen(false)} // Đóng khi click link
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
                    )}
                  </div>
                ) : (
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

                <Link
                  href="/cart"
                  className="relative p-2 text-white hover:opacity-80"
                >
                  <ShoppingCart size={28} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-primary-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary animate-in zoom-in duration-300">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <nav className="flex items-center gap-8 pt-2 pb-1 text-white font-bold text-lg overflow-x-auto">
              <Link
                href="/"
                className="hover:text-yellow-300 transition-colors whitespace-nowrap"
              >
                Trang chủ
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-yellow-300 transition-colors whitespace-nowrap"
              >
                Quản lý dịch vụ
              </Link>
              <Link
                href="/support"
                className="hover:text-yellow-300 transition-colors whitespace-nowrap"
              >
                Hỗ trợ
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
