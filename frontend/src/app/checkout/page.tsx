"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Loader2,
  User,
  Phone,
  Mail,
} from "lucide-react";

// Cấu hình URL Backend
const API_BASE_URL = "http://localhost:8080";

// Interface cho Item trong giỏ
interface CartItem {
  cart_item_id: number;
  product_id: number;
  quantity: number;
  Products: {
    name: string;
    price: string | number;
    duration_months: number;
    description: string;
  };
}

export default function CheckoutPage() {
  const router = useRouter();

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("banking"); // Mặc định là Banking
  const [totalAmount, setTotalAmount] = useState(0);

  // State cho Form thông tin (Pre-fill từ localStorage)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // --- 1. LOAD DỮ LIỆU KHI VÀO TRANG ---
  useEffect(() => {
    const userStr = localStorage.getItem("user");

    // Nếu chưa đăng nhập -> Đá về Login
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);

    // Điền sẵn thông tin user vào form
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });

    // Gọi API lấy giỏ hàng
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cart/${user.user_id}`);
        if (!res.ok) throw new Error("Lỗi tải giỏ hàng");

        const data = await res.json();
        setCartItems(data);

        // Tính tổng tiền thật
        const total = data.reduce(
          (sum: number, item: any) =>
            sum + Number(item.Products.price) * item.quantity,
          0
        );
        setTotalAmount(total);

        // Nếu giỏ hàng trống thì cảnh báo
        if (data.length === 0) {
          alert("Giỏ hàng đang trống!");
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  // Hàm format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Xử lý khi bấm nút Thanh toán
  const handleProceedToPayment = (e: React.MouseEvent) => {
    e.preventDefault(); // Chặn link mặc định để kiểm tra trước

    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    if (!formData.email || !formData.name) {
      alert("Vui lòng điền đầy đủ họ tên và email nhận hàng.");
      return;
    }

    // Nếu chọn MoMo hoặc Thẻ -> Báo tính năng đang phát triển
    if (paymentMethod !== "banking") {
      alert(
        "Hiện tại hệ thống đang bảo trì cổng này. Vui lòng chọn Chuyển khoản ngân hàng (Duyệt tự động)."
      );
      return;
    }

    // Chuyển sang trang Cổng thanh toán (Trang QR Code chúng ta làm lúc nãy)
    router.push("/checkout/payment");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          Thanh toán đơn hàng
          {loading && (
            <Loader2 className="animate-spin text-gray-400" size={24} />
          )}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- CỘT TRÁI: THÔNG TIN SẢN PHẨM (DỮ LIỆU THẬT) --- */}
          <div className="lg:w-1/3 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Đơn hàng ({cartItems.length} sản phẩm)
              </h3>

              {/* Danh sách sản phẩm trong giỏ */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="flex items-center gap-4"
                  >
                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
                        alt={item.Products.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">
                        {item.Products.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        x{item.quantity} • {item.Products.duration_months} tháng
                      </p>
                    </div>
                    <div className="font-bold text-primary text-sm whitespace-nowrap">
                      {formatCurrency(
                        Number(item.Products.price) * item.quantity
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tổng kết tiền */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Giảm giá:</span>
                  <span className="text-green-600 font-medium">0đ</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-gray-900">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: FORM ĐIỀN THÔNG TIN --- */}
          <div className="lg:w-2/3 order-1 lg:order-2 space-y-8">
            {/* 1. Thông tin khách hàng */}
            <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-sm">
                  1
                </span>
                Thông tin khách hàng
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Số điện thoại (Tùy chọn)"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email nhận dịch vụ (Quan trọng)"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-yellow-50/50"
                />
              </div>
              <p className="text-xs text-orange-500 mt-2 ml-1 font-medium flex items-center gap-1">
                ⚠️ Vui lòng điền chính xác Email để nhận tài khoản/lời mời
                family.
              </p>
            </div>

            {/* 2. Phương thức thanh toán */}
            <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-sm">
                  2
                </span>
                Chọn phương thức thanh toán
              </h3>

              <div className="space-y-4">
                {/* Option: Chuyển khoản */}
                <div
                  onClick={() => setPaymentMethod("banking")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "banking"
                      ? "border-primary bg-blue-50 ring-1 ring-primary shadow-sm"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-primary shadow-sm">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        Chuyển khoản QR Code
                      </p>
                      <p className="text-xs text-gray-500">
                        Duyệt tự động 24/7 (VietQR)
                      </p>
                    </div>
                  </div>
                  {paymentMethod === "banking" && (
                    <div className="bg-primary text-white p-1 rounded-full">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>

                {/* Option: Ví MoMo */}
                <div
                  onClick={() => setPaymentMethod("momo")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all opacity-60 ${
                    paymentMethod === "momo"
                      ? "border-primary bg-blue-50 ring-1 ring-primary"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 bg-white shadow-sm">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                        alt="MoMo"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Ví MoMo</p>
                      <p className="text-xs text-gray-500">Đang bảo trì...</p>
                    </div>
                  </div>
                  {paymentMethod === "momo" && (
                    <CheckCircle2 className="text-primary" size={20} />
                  )}
                </div>

                {/* Option: Thẻ ATM */}
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all opacity-60 ${
                    paymentMethod === "card"
                      ? "border-primary bg-blue-50 ring-1 ring-primary"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shadow-sm">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        Thẻ quốc tế
                      </p>
                      <p className="text-xs text-gray-500">
                        Visa, Master, JCB (Đang bảo trì)
                      </p>
                    </div>
                  </div>
                  {paymentMethod === "card" && (
                    <CheckCircle2 className="text-primary" size={20} />
                  )}
                </div>
              </div>
            </div>

            {/* Nút Thanh Toán */}
            <button
              onClick={handleProceedToPayment}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                `Thanh toán ngay (${formatCurrency(totalAmount)})`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
