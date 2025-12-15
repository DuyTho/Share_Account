"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { name: "Tổng quan", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Quản lý gói dịch vụ", href: "/admin/products", icon: ShoppingBag },
  { name: "Quản lý đơn hàng", href: "/admin/orders", icon: ListChecks },
  { name: "Quản lý người dùng", href: "/admin/users", icon: Users },
  { name: "Hỗ trợ", href: "/admin/support", icon: HelpCircle },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Lấy đường dẫn hiện tại (Chỉ dùng được trong Client Component)
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- SIDEBAR (Màu Xanh Đậm) --- */}
      <aside className="w-64 bg-primary-dark text-white flex flex-col shrink-0">
        <div className="p-6 text-xl font-extrabold text-center border-b border-white/20">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <h3 className="text-xs uppercase text-blue-200 font-bold mb-4 tracking-wider px-2">
            Quản trị hệ thống
          </h3>
          {navItems.map((item) => {
            // Kiểm tra xem đây có phải là trang hiện tại không
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                // Dùng Tailwind để thay đổi màu nền và text khi isActive là true
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors font-medium 
                  ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-blue-500/20"
                      : "text-white/80 hover:bg-primary/50" // Giảm độ sáng của hover khi không active
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Thông tin Admin & Logout */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/10">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary font-bold">
              Q
            </div>
            <div>
              <p className="text-sm font-bold">Quản trị viên</p>
              <p className="text-xs text-blue-200">Nguyễn Văn A</p>
            </div>
            <button className="ml-auto text-white/60 hover:text-white transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
}
