"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Thêm useRouter
import { useEffect, useState } from "react"; // Thêm Hooks
import {
  LayoutDashboard,
  ShoppingBag,
  ListChecks,
  Users,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Menu Navigation
const navItems = [
  { name: "Tổng quan", href: "/admin/dashboard", icon: LayoutDashboard }, // Sửa href cho khớp với page admin
  { name: "Quản lý gói dịch vụ", href: "/admin/products", icon: ShoppingBag },
  { name: "Quản lý đơn hàng", href: "/admin/orders", icon: ListChecks },
  { name: "Quản lý người dùng", href: "/admin/users", icon: Users },
  { name: "Hỗ trợ", href: "/admin/support", icon: HelpCircle },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter(); // Dùng để chuyển trang

  // State lưu thông tin Admin
  const [user, setUser] = useState<any>(null);

  // 1. Lấy thông tin Admin khi vào trang
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Hàm xử lý Đăng xuất
  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem("user");
    // Chuyển hướng về trang login
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- SIDEBAR (Màu Xanh Đậm) --- */}
      <aside className="w-64 bg-primary-dark text-white flex flex-col shrink-0 transition-all duration-300">
        <div className="p-6 text-xl font-extrabold text-center border-b border-white/20">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <h3 className="text-xs uppercase text-blue-200 font-bold mb-4 tracking-wider px-2">
            Quản trị hệ thống
          </h3>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors font-medium 
                  ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-blue-500/20"
                      : "text-white/80 hover:bg-primary/50"
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* --- CẬP NHẬT GÓC TRÁI BÊN DƯỚI --- */}
        <div className="p-4 border-t border-white/20">
          {user ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              {/* Avatar: Lấy chữ cái đầu của tên */}
              <div className="w-8 h-8 bg-white text-primary-dark rounded-full flex items-center justify-center font-bold shrink-0">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>

              {/* Thông tin: Tên và Email (cắt ngắn nếu dài) */}
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p
                  className="text-xs text-blue-200 truncate"
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>

              {/* Nút Đăng xuất: Đã gắn sự kiện onClick */}
              <button
                onClick={handleLogout}
                className="ml-auto text-white/60 hover:text-red-400 transition-colors p-1"
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            // Skeleton loader nhẹ khi chưa load xong user
            <div className="flex items-center gap-3 p-2 animate-pulse">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-white/20 rounded w-2/3"></div>
                <div className="h-2 bg-white/20 rounded w-1/2"></div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-8 bg-[#F3F4F6]">
        {children}
      </div>
    </div>
  );
}
