"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import {
  Clock,
  Copy,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function PaymentGatewayPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút đếm ngược
  const [status, setStatus] = useState<"pending" | "success">("pending");

  // 1. Logic Đếm ngược thời gian (Chạy độc lập)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Logic Giả lập Thanh toán (Đã sửa lỗi)
  useEffect(() => {
    // Chỉ chạy logic này khi đang ở trạng thái pending
    if (status === "success") return;

    // Giả lập hệ thống đang check (log ra console cho bạn thấy nó chạy)
    const checkInterval = setInterval(() => {
      console.log("System: Đang kiểm tra giao dịch...");
    }, 2000);

    // QUAN TRỌNG: Đặt hẹn giờ cứng 10 giây để kích hoạt thành công
    const successTimer = setTimeout(() => {
      console.log("System: Đã nhận được tiền!");
      clearInterval(checkInterval); // Dừng check
      setStatus("success"); // Chuyển trạng thái

      // Chờ 2 giây để người dùng nhìn thấy thông báo rồi mới chuyển trang
      setTimeout(() => {
        router.push("/checkout/success");
      }, 2000);
    }, 10000); // 10000ms = 10 giây

    // Cleanup khi component bị hủy (người dùng thoát ra)
    return () => {
      clearInterval(checkInterval);
      clearTimeout(successTimer);
    };
  }, [router, status]); // Dependency array chuẩn

  // Format phút:giây
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Thông tin chuyển khoản
  const bankInfo = {
    bankId: "MB",
    accountNo: "0000123456789",
    accountName: "SHARE ACCOUNT ADMIN",
    amount: 300000,
    content: "SHAREACC 123456",
  };

  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.jpg?amount=${bankInfo.amount}&addInfo=${bankInfo.content}&accountName=${bankInfo.accountName}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- CỘT TRÁI: MÃ QR & TRẠNG THÁI --- */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center text-center min-h-[400px] justify-center">
            {status === "pending" ? (
              <div className="w-full flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Thanh toán qua mã QR
                </h2>
                <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-4 py-1 rounded-full mb-6 text-sm">
                  <Clock size={16} />
                  <span>Đơn hàng hết hạn sau: {formatTime(timeLeft)}</span>
                </div>

                {/* Khung QR */}
                <div className="p-4 border-2 border-primary/20 rounded-xl mb-6 bg-white relative">
                  {/* Logo VNPAY ở góc cho uy tín */}
                  <div className="absolute -top-3 -right-3 bg-white p-1 rounded-full border border-gray-100 shadow-sm w-10 h-10 flex items-center justify-center">
                    <img
                      src="/vnpay.png"
                      alt="VNPay"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <img
                    src={qrUrl}
                    alt="VietQR Code"
                    className="w-full max-w-[260px] h-auto object-contain rounded-lg"
                  />
                </div>

                {/* Trạng thái Loading */}
                <div className="flex flex-col items-center gap-3 animate-pulse">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Đang chờ thanh toán...</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Vui lòng không tắt trình duyệt.
                  </p>
                </div>
              </div>
            ) : (
              // Trạng thái THÀNH CÔNG (Hiện ra khi status = success)
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-green-600 w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công!
                </h2>
                <p className="text-gray-500">Đang chuyển hướng...</p>
              </div>
            )}
          </div>

          {/* --- CỘT PHẢI: THÔNG TIN CHI TIẾT --- */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-primary" size={20} />
                Thông tin chuyển khoản
              </h3>

              <div className="space-y-4">
                {/* Các dòng thông tin ngân hàng - Giữ nguyên như cũ */}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Ngân hàng</span>
                  <span className="font-bold text-gray-900">MB Bank</span>
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
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Chủ tài khoản</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {bankInfo.accountName}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Số tiền</span>
                  <span className="font-bold text-primary text-xl">
                    300.000đ
                  </span>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="text-xs text-yellow-800 mb-1 font-bold uppercase">
                    Nội dung chuyển khoản
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">
                      {bankInfo.content}
                    </span>
                    <Copy
                      size={18}
                      className="text-yellow-600 cursor-pointer hover:text-yellow-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hướng dẫn phụ */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
              <div className="font-bold mb-1 flex items-center gap-2">
                <AlertTriangle size={16} /> Lưu ý:
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tuyệt đối không làm mới trang khi đang thanh toán.</li>
                <li>
                  Nếu quá 5 phút chưa thấy cập nhật, vui lòng liên hệ Hotline:{" "}
                  <strong>0788423567</strong>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
