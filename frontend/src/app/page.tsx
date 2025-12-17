"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import {
  ShieldCheck,
  Zap,
  Users,
  Star,
  ArrowRight,
  ShoppingCart, // Icon giỏ hàng
  CheckCircle2, // Icon tích xanh cho Toast
  X, // Icon đóng Toast
  Tag, // Icon giá
} from "lucide-react";

// 1. Định nghĩa kiểu dữ liệu khớp với DB
interface Product {
  product_id: number;
  name: string;
  duration_months: number;
  price: string | number;
  description: string;
}

export default function Home() {
  // 2. State quản lý dữ liệu & UI
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho Toast thông báo
  const [toast, setToast] = useState({ show: false, message: "" });

  // 3. Hàm hiển thị Toast (Tự tắt sau 3s)
  const showSuccessToast = (productName: string) => {
    setToast({ show: true, message: `Đã thêm "${productName}" vào giỏ!` });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // 4. Gọi API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/products"); // Giữ port 8080 theo code của bạn

        if (!res.ok) throw new Error("Không thể kết nối đến server");

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Lỗi kết nối Backend. Hãy kiểm tra server!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  const handleBuyNow = (product: Product) => {
    // Logic mua ngay
    console.log("Mua ngay:", product);
    alert(`Chuyển đến trang thanh toán cho: ${product.name}`);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative">
      <Navbar />

      {/* --- 1. HERO SECTION --- */}
      {/* Sử dụng Primary Color: #0D6EFD */}
      <div className="relative bg-gradient-to-br from-[#0D6EFD] to-blue-600 text-white overflow-hidden">
        <div className="container mx-auto px-4 py-12 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 border border-white/30 text-sm font-medium mb-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            ✨ Giải pháp tiết kiệm tới 25% chi phí
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Nâng cấp <span className="text-[#FFC107]">Youtube Premium</span>{" "}
            <br />
            Chính chủ - Giá rẻ - Uy tín
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Tận hưởng video không quảng cáo, nghe nhạc tắt màn hình và Youtube
            Music Premium. Bảo hành trọn đời, hỗ trợ 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#pricing">
              <button className="px-8 py-4 bg-white text-[#0D6EFD] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
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

      {/* --- 2. TRUST STATS --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div>
              <div className="text-3xl font-bold text-[#0D6EFD] mb-1">10K+</div>
              <div className="text-sm text-[#757575]">Khách hàng tin dùng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0D6EFD] mb-1">24/7</div>
              <div className="text-sm text-[#757575]">Hỗ trợ kỹ thuật</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0D6EFD] mb-1">100%</div>
              <div className="text-sm text-[#757575]">Bảo hành trọn đời</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0D6EFD] mb-1">
                5.0{" "}
                <Star
                  className="inline w-4 h-4 text-[#FFC107] mb-1"
                  fill="currentColor"
                />
              </div>
              <div className="text-sm text-[#757575]">Đánh giá 5 sao</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. PRICING SECTION --- */}
      <div id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bảng giá dịch vụ
          </h2>
          <p className="text-[#757575] max-w-xl mx-auto">
            Chọn gói phù hợp với nhu cầu của bạn. Cam kết không phát sinh chi
            phí.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D6EFD]"></div>
            <p className="mt-4 text-[#757575]">
              Đang tải danh sách gói cước...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-[#DC3545]/10 rounded-xl border border-[#DC3545]/20">
            <p className="text-[#DC3545] font-medium">{error}</p>
            <p className="text-sm text-[#757575] mt-2">
              Vui lòng kiểm tra lại Backend
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#0D6EFD]/30 transition-all duration-300 flex flex-col"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h2>
                  </div>

                  <p className="text-[#757575] mb-6 text-s flex-grow">
                    {product.description ||
                      `Gói ${product.duration_months} tháng bảo hành`}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    {/* Giá tiền - Success Color */}
                    <div className="flex items-center gap-2 text-[#28A745] font-bold text-xl mb-4">
                      <Tag size={20} />
                      {formatPrice(product.price)}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => showSuccessToast(product.name)}
                        className="p-3 bg-gray-100 text-[#757575] rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200"
                        title="Thêm vào giỏ hàng"
                      >
                        <ShoppingCart size={20} />
                      </button>

                      <button
                        onClick={() => handleBuyNow(product)}
                        className="flex-1 bg-[#0D6EFD] hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors shadow-sm shadow-blue-200"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- 4. WHY CHOOSE US --- */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn ShareAccount?
            </h2>
            <div className="w-16 h-1 bg-[#0D6EFD] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-[#F8F9FA] p-8 rounded-[20px] border border-gray-100 hover:border-[#0D6EFD]/30 transition-colors">
              <div className="w-14 h-14 bg-blue-100 text-[#0D6EFD] rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Bảo hành trọn đời
              </h3>
              <p className="text-[#757575] leading-relaxed">
                Chúng tôi cam kết bảo hành 1 đổi 1 trong suốt thời gian sử dụng.
              </p>
            </div>

            <div className="bg-[#F8F9FA] p-8 rounded-[20px] border border-gray-100 hover:border-[#28A745]/30 transition-colors">
              <div className="w-14 h-14 bg-green-100 text-[#28A745] rounded-2xl flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nâng cấp siêu tốc
              </h3>
              <p className="text-[#757575] leading-relaxed">
                Hệ thống tự động xử lý đơn hàng chỉ sau 5-10 phút.
              </p>
            </div>

            <div className="bg-[#F8F9FA] p-8 rounded-[20px] border border-gray-100 hover:border-purple-500/30 transition-colors">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nâng cấp chính chủ
              </h3>
              <p className="text-[#757575] leading-relaxed">
                Nâng cấp trực tiếp trên Email cá nhân của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 5. FAQ --- */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Câu hỏi thường gặp
        </h2>
        {/* (Phần FAQ giữ nguyên code cũ của bạn vì nó chỉ là text) */}
        <div className="space-y-4">
          <details className="group bg-white border border-gray-200 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h3 className="font-bold">
                Quy trình mua hàng của ShareAccount là như thế nào?
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
            <p className="mt-4 leading-relaxed text-[#757575]">
              Quy trình mua hàng rất đơn giản. Bạn chỉ cần đăng ký tài khoản,
              chọn gói dịch vụ, và thanh toán. Chúng tôi sẽ xử lý đơn hàng trong
              vòng 5-10 phút.
            </p>
          </details>
          <details className="group bg-white border border-gray-200 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
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
            <p className="mt-4 leading-relaxed text-[#757575]">
              Tuyệt đối <strong>KHÔNG</strong>. Chúng tôi chỉ cần địa chỉ Email.
            </p>
          </details>
          <details className="group bg-white border border-gray-200 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h3 className="font-bold">Liệu ShareAccount có bảo mật không?</h3>
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
            <p className="mt-4 leading-relaxed text-[#757575]">
              Hoàn toàn <strong>AN TOÀN</strong>. Chúng tôi không lưu trữ bất kỳ
              thông tin cá nhân nào khác.
            </p>
          </details>
          {/* Bạn có thể copy nốt các câu hỏi khác vào đây */}
        </div>
      </div>

      {/* --- 6. TOAST NOTIFICATION (Success Style) --- */}
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[100] bg-white border-l-4 border-[#28A745] shadow-2xl rounded-lg p-4 flex items-center gap-4 animate-in slide-in-from-right duration-300">
          <div className="bg-green-100 p-2 rounded-full text-[#28A745]">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Thêm thành công!</h4>
            <p className="text-sm text-[#757575]">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </main>
  );
}
