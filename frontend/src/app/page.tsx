"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ProductCard from "@/components/ui/ProductCard";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  Star,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  // Dữ liệu sản phẩm
  const products = [
    {
      title: "Gói 1 tháng",
      price: "100.000đ",
      description: "Thích hợp để trải nghiệm thử dịch vụ.",
    },
    {
      title: "Gói 6 tháng",
      price: "450.000đ",
      description: "Tiết kiệm 25% - Lựa chọn phổ biến.",
    },
    {
      title: "Gói 1 năm",
      price: "800.000đ",
      description: "Siêu tiết kiệm - Bảo hành trọn đời.",
    },
  ];

  const handleAddToCart = (title: string) => {
    alert(`Đã thêm ${title} vào giỏ hàng!`);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* --- 1. HERO SECTION (Ấn tượng đầu tiên) --- */}
      <div className="relative bg-gradient-to-br from-primary to-blue-600 text-white overflow-hidden">
        {/* Họa tiết nền mờ ảo */}
        <div className="container mx-auto px-4 py-12 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 border border-white/30 text-sm font-medium mb-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            ✨ Giải pháp tiết kiệm tới 80% chi phí
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Nâng cấp <span className="text-yellow-300">Youtube Premium</span>{" "}
            <br />
            Chính chủ - Giá rẻ - Uy tín
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Tận hưởng video không quảng cáo, nghe nhạc tắt màn hình và Youtube
            Music Premium. Bảo hành trọn đời, hỗ trợ 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#pricing">
              <button className="px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                Xem bảng giá
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/support">
              <button className="px-8 py-4 bg-transparent border border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
                Tư vấn ngay
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- 2. TRUST STATS (Số liệu tin cậy) --- */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">10K+</div>
              <div className="text-sm text-gray-500">Khách hàng tin dùng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm text-gray-500">Hỗ trợ kỹ thuật</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-500">Bảo hành trọn đời</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                5.0{" "}
                <Star
                  className="inline w-4 h-4 text-yellow-400 mb-1"
                  fill="currentColor"
                />
              </div>
              <div className="text-sm text-gray-500">Đánh giá 5 sao</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. PRICING SECTION (Trọng tâm) --- */}
      <div id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bảng giá dịch vụ
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Chọn gói phù hợp với nhu cầu của bạn. Cam kết không phát sinh chi
            phí.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              {...product}
              onAddToCart={() => handleAddToCart(product.title)}
            />
          ))}
        </div>
      </div>

      {/* --- 4. WHY CHOOSE US (Tính năng) --- */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn ShareAccount?
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-primary rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Bảo hành trọn đời
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Chúng tôi cam kết bảo hành 1 đổi 1 trong suốt thời gian sử dụng
                gói dịch vụ. Lỗi là đổi mới ngay lập tức.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nâng cấp siêu tốc
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Hệ thống tự động xử lý đơn hàng. Bạn sẽ nhận được email nâng cấp
                chỉ sau 5-10 phút thanh toán.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nâng cấp chính chủ
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Nâng cấp trực tiếp trên Email cá nhân của bạn. Không cần đổi tài
                khoản, giữ nguyên lịch sử xem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 5. FAQ (Câu hỏi thường gặp) --- */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Câu hỏi thường gặp
        </h2>

        <div className="space-y-4">
          <details className="group bg-white border border-gray-100 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h3 className="font-bold">
                Tôi có cần đưa mật khẩu Gmail không?
              </h3>
              <div className="white-space-nowrap text-gray-900 group-open:-rotate-180 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </summary>
            <p className="mt-4 leading-relaxed text-gray-700">
              Tuyệt đối <strong>KHÔNG</strong>. Chúng tôi chỉ cần địa chỉ Email
              của bạn để gửi lời mời tham gia Family. Bạn không cần cung cấp mật
              khẩu.
            </p>
          </details>

          <details className="group bg-white border border-gray-100 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h3 className="font-bold">
                Tài khoản có bị mất Premium giữa chừng không?
              </h3>
              <div className="white-space-nowrap text-gray-900 group-open:-rotate-180 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </summary>
            <p className="mt-4 leading-relaxed text-gray-700">
              Tỷ lệ này rất thấp. Tuy nhiên nếu xảy ra, ShareAccount cam kết bảo
              hành khôi phục lại gói Premium hoặc hoàn tiền cho thời gian chưa
              sử dụng.
            </p>
          </details>

          <details className="group bg-white border border-gray-100 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h3 className="font-bold">
                Thời gian xử lý đơn hàng là bao lâu?
              </h3>
              <div className="white-space-nowrap text-gray-900 group-open:-rotate-180 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </summary>
            <p className="mt-4 leading-relaxed text-gray-700">
              Thông thường từ 5 - 15 phút trong giờ hành chính (8h00 - 22h00).
              Ngoài giờ hành chính có thể chậm hơn một chút nhưng không quá 12
              tiếng.
            </p>
          </details>
        </div>
      </div>
    </main>
  );
}
