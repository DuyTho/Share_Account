"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
// 1. Import Toast Component
import Toast from "@/components/ui/Toast";
import {
  Clock,
  Copy,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";

import { API_BASE_URL } from "@/config";;

export default function PaymentGatewayPage() {
  const router = useRouter();

  // State dữ liệu
  const [timeLeft, setTimeLeft] = useState(600);
  const [status, setStatus] = useState<
    "loading" | "pending" | "processing" | "success"
  >("loading");
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [orderInfo, setOrderInfo] = useState("");

  // 2. Thêm State quản lý Toast
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Hàm tiện ích để hiển thị Toast
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
  };

  // Lấy thông tin User và Giỏ hàng
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
    setOrderInfo(`SHAREACC ${parsedUser.user_id}`);

    const fetchCartTotal = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cart/${parsedUser.user_id}`);
        if (!res.ok) throw new Error("Lỗi tải giỏ hàng");

        const cartItems = await res.json();

        if (cartItems.length === 0) {
          // Thay alert bằng Toast + Delay chuyển trang
          showToast("Giỏ hàng trống! Đang quay lại trang chủ...", "error");
          setTimeout(() => router.push("/"), 2000);
          return;
        }

        const total = cartItems.reduce(
          (sum: number, item: any) =>
            sum + Number(item.Products.price) * item.quantity,
          0
        );

        setTotalAmount(total);
        setStatus("pending");
      } catch (error) {
        console.error(error);
        showToast("Lỗi kết nối Server. Đang quay lại...", "error");
        setTimeout(() => router.push("/cart"), 2000);
      }
    };

    fetchCartTotal();
  }, [router]);

  // Đếm ngược
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // LOGIC THANH TOÁN
  useEffect(() => {
    if (status !== "pending" || !user) return;

    const paymentTimer = setTimeout(async () => {
      setStatus("processing");

      try {
        console.log("💳 Đang gọi API Checkout...");

        const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.user_id }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log("✅ Checkout thành công:", data);
          setStatus("success");
          window.dispatchEvent(new Event("cartUpdated"));

          // Thay alert thành công bằng Toast
          showToast("Thanh toán thành công! Đang chuyển hướng...", "success");

          // Chuyển trang sau 3 giây
          setTimeout(() => {
            router.push("/checkout/success");
          }, 3000);
        } else {
          throw new Error(data.error || "Thanh toán thất bại");
        }
      } catch (error: any) {
        console.error("Lỗi checkout:", error);
        // Thay alert lỗi bằng Toast
        showToast(`Lỗi: ${error.message}`, "error");
        setStatus("pending");
      }
    }, 10000);

    return () => clearTimeout(paymentTimer);
  }, [status, user, router]);

  // Helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const bankInfo = {
    bankId: "MB",
    accountNo: "0333666999",
    accountName: "NGUYEN VAN A",
  };

  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.jpg?amount=${totalAmount}&addInfo=${orderInfo}&accountName=${bankInfo.accountName}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <Navbar />

      {/* 3. Hiển thị Toast nếu show = true */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- CỘT TRÁI: QR CODE --- */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center text-center min-h-[400px] justify-center relative overflow-hidden">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-3">
                <RefreshCcw className="animate-spin text-primary" size={32} />
                <p className="text-gray-500">Đang tạo giao dịch an toàn...</p>
              </div>
            )}

            {(status === "pending" || status === "processing") && (
              <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Quét mã để thanh toán
                </h2>
                <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-4 py-1 rounded-full mb-6 text-sm">
                  <Clock size={16} />
                  <span>Đơn hàng hết hạn sau: {formatTime(timeLeft)}</span>
                </div>

                <div
                  className={`p-4 border-2 border-primary/20 rounded-xl mb-6 bg-white relative transition-opacity duration-300 ${
                    status === "processing" ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className="absolute -top-3 -right-3 bg-white p-1 rounded-full border border-gray-100 shadow-sm w-10 h-10 flex items-center justify-center z-10">
                    <img
                      src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                      alt="VNPay"
                      className="w-6 h-6 object-contain"
                    />
                  </div>

                  <img
                    src={qrUrl}
                    alt="VietQR Code"
                    className="w-full max-w-[260px] h-auto object-contain rounded-lg"
                  />

                  {status === "processing" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-20">
                      <Loader2 className="animate-spin text-primary w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3">
                  {status === "pending" ? (
                    <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">
                        Đang chờ tín hiệu ngân hàng...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Hệ thống đang xử lý đơn hàng...</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    Vui lòng giữ nguyên trang này.
                  </p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                  <CheckCircle2 className="text-green-600 w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công!
                </h2>
                <p className="text-gray-500 mb-4">
                  Vui lòng kiểm tra Email của bạn.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                  <Loader2 className="animate-spin" size={14} /> Đang chuyển
                  hướng...
                </div>
              </div>
            )}
          </div>

          {/* --- CỘT PHẢI: THÔNG TIN CK --- */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-primary" size={20} />
                Thông tin chuyển khoản
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Ngân hàng</span>
                  <span className="font-bold text-gray-900">
                    MB Bank (Quân Đội)
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-lg">
                      {bankInfo.accountNo}
                    </span>
                    <Copy
                      size={16}
                      className="text-gray-400 cursor-pointer hover:text-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(bankInfo.accountNo);
                        showToast("Đã sao chép số tài khoản!", "success");
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Chủ tài khoản</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {bankInfo.accountName}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-primary/20 bg-blue-50/30">
                  <span className="text-sm text-gray-500">Số tiền</span>
                  <span className="font-bold text-primary text-2xl">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="text-xs text-yellow-800 mb-1 font-bold uppercase">
                    Nội dung (Memo)
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">
                      {orderInfo}
                    </span>
                    <Copy
                      size={18}
                      className="text-yellow-600 cursor-pointer hover:text-yellow-800"
                      onClick={() => {
                        navigator.clipboard.writeText(orderInfo);
                        showToast("Đã sao chép nội dung!", "success");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
              <div className="font-bold mb-1 flex items-center gap-2">
                <AlertTriangle size={16} /> Lưu ý:
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Hệ thống duyệt đơn tự động sau khi nhận được tiền (khoảng
                  10-30s).
                </li>
                <li>
                  Nếu quá 5 phút chưa thấy cập nhật, vui lòng liên hệ
                  Hotline/Zalo Admin.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
