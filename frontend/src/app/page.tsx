"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Import useRouter để chuyển trang
import Navbar from "@/components/layout/Navbar";
import {
  ShieldCheck,
  Zap,
  Users,
  Star,
  ArrowRight,
  ShoppingCart,
  CheckCircle2,
  X,
  Tag,
  AlertCircle, // Icon cho thông báo lỗi
} from "lucide-react";

// Cấu hình URL API
const API_BASE_URL = "http://localhost:8080";

interface Product {
  product_id: number;
  name: string;
  duration_months: number;
  price: string | number;
  description: string;
}

export default function Home() {
  const router = useRouter(); // Hook điều hướng

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho Toast (Hỗ trợ cả success và error)
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Hàm hiển thị Toast
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // 1. Gọi API lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
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

  // --- 2. HÀM XỬ LÝ THÊM VÀO GIỎ HÀNG (GỌI API) ---
  const handleAddToCart = async (product: Product) => {
    // Bước A: Kiểm tra đăng nhập
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      // Nếu chưa đăng nhập, hỏi user có muốn đi đăng nhập không
      const confirmLogin = confirm(
        "Bạn cần đăng nhập để thêm vào giỏ hàng. Đi đến trang đăng nhập?"
      );
      if (confirmLogin) {
        router.push("/login");
      }
      return;
    }

    const user = JSON.parse(userStr);

    // Bước B: Gọi API Backend
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id, // Lấy ID từ localStorage (Lưu ý: kiểm tra xem trong localStorage lưu là user_id hay id)
          product_id: product.product_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi thêm giỏ hàng");
      }

      // Bước C: Thành công -> Hiện Toast
      showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, "success");

      // (Tùy chọn) Gửi sự kiện để Navbar cập nhật số lượng giỏ hàng
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      console.error(err);
      showToast(err.message, "error");
    }
  };

  const handleBuyNow = (product: Product) => {
    // Logic mua ngay: Thêm vào giỏ -> Chuyển sang trang thanh toán
    handleAddToCart(product);
    setTimeout(() => {
      router.push("/cart");
    }, 500);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative">
      <Navbar />

      {/* --- HERO SECTION (Giữ nguyên) --- */}
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

      {/* --- TRUST STATS (Giữ nguyên) --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            {/* ... Code phần stats giữ nguyên ... */}
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

      {/* --- PRICING SECTION --- */}
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

                  <p className="text-[#757575] mb-6 text-sm flex-grow">
                    {product.description ||
                      `Gói ${product.duration_months} tháng bảo hành`}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-[#28A745] font-bold text-xl mb-4">
                      <Tag size={20} />
                      {formatPrice(product.price)}
                    </div>

                    <div className="flex gap-2">
                      {/* 3. Gắn hàm handleAddToCart vào nút giỏ hàng */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-3 bg-gray-100 text-[#757575] rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200"
                        title="Thêm vào giỏ hàng"
                      >
                        <ShoppingCart size={20} />
                      </button>

                      {/* 4. Gắn hàm handleBuyNow vào nút Mua ngay */}
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

      {/* --- WHY CHOOSE US (Giữ nguyên) --- */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn ShareAccount?
            </h2>
            <div className="w-16 h-1 bg-[#0D6EFD] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Nội dung Why Choose Us giữ nguyên */}
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

      {/* --- FAQ SECTION (Giữ nguyên) --- */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Câu hỏi thường gặp
        </h2>
        {/* ... Nội dung FAQ ... */}
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
          {/* ... Các câu hỏi khác ... */}
        </div>
      </div>

      {/* --- TOAST NOTIFICATION (Nâng cấp) --- */}
      {toast.show && (
        <div
          className={`fixed bottom-10 right-10 z-[100] bg-white border-l-4 shadow-2xl rounded-lg p-4 flex items-center gap-4 animate-in slide-in-from-right duration-300 ${
            toast.type === "success" ? "border-[#28A745]" : "border-red-500"
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              toast.type === "success"
                ? "bg-green-100 text-[#28A745]"
                : "bg-red-100 text-red-500"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={24} />
            ) : (
              <AlertCircle size={24} />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">
              {toast.type === "success" ? "Thành công!" : "Lỗi!"}
            </h4>
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
