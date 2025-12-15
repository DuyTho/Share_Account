import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* CỘT 1: GIỚI THIỆU */}
          <div>
            <h3 className="text-lg font-bold mb-6">Giới thiệu</h3>
            <ul className="space-y-4 text-sm font-medium text-blue-100">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:underline transition-all"
                >
                  Giới thiệu về ShareAccount
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white hover:underline transition-all"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white hover:underline transition-all"
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 2: LIÊN HỆ */}
          <div>
            <h3 className="text-lg font-bold mb-6">Liên hệ</h3>
            <ul className="space-y-4 text-sm font-medium text-blue-100">
              <li className="flex items-center gap-2">
                <span>Hotline:</span>
                <span className="font-bold text-white">0788423567</span>
              </li>

              {/* Liên hệ hỗ trợ */}
              <li>
                <Link
                  href="/support"
                  className="flex items-center gap-2 hover:text-white transition-all"
                >
                  <span>Gửi yêu cầu hỗ trợ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3: SOCIAL */}
          <div>
            <h3 className="text-lg font-bold mb-6">Social</h3>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-white/20 pt-8 text-center text-sm text-blue-200">
          <p>© {new Date().getFullYear()} ShareAccount | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
