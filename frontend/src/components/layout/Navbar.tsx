import Link from "next/link";
import { ShoppingCart, Search, Phone, Mail, FileText } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-full">
      {/* --- Tầng 1: Top Bar --- */}
      <div className="bg-primary-dark text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-end gap-6 items-center">
          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>shareaccount@gmail.com</span>
          </div>

          {/* Support */}
          <Link
            href="/support"
            className="flex items-center gap-2 hover:text-yellow-300 transition-colors cursor-pointer"
          >
            <Phone size={16} />
            <span>Hỗ trợ khách hàng</span>
          </Link>

          {/* Hướng dẫn */}
          <Link
            href="/tutorial"
            className="flex items-center gap-2 hover:text-yellow-300 transition-colors cursor-pointer"
          >
            <FileText size={16} />
            <span>Hướng dẫn mua hàng</span>
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

              {/* Search Bar (Lớn ở giữa) */}
              <div className="hidden md:flex flex-1 max-w-2xl relative mx-4">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-gray-700"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>

              {/* Buttons & Cart */}
              <div className="flex items-center gap-3">
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

                <Link
                  href="/cart"
                  className="relative p-2 text-white hover:opacity-80"
                >
                  <ShoppingCart size={28} />
                </Link>
              </div>
            </div>

            {/* Hàng dưới: Menu Navigation */}
            <nav className="flex items-center gap-8 pt-2 pb-1 text-white font-bold text-lg">
              <Link
                href="/"
                className="hover:text-yellow-300 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                className="hover:text-yellow-300 transition-colors"
              >
                Gói dịch vụ
              </Link>
              <Link
                href="/explore"
                className="hover:text-yellow-300 transition-colors"
              >
                Khám phá
              </Link>
              <Link
                href="/news"
                className="hover:text-yellow-300 transition-colors"
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
