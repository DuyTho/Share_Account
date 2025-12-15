import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-[20px] shadow-xl border border-gray-100 max-w-lg w-full text-center">
          {/* Icon Thành công */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-success w-12 h-12" strokeWidth={3} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-500 mb-8">
            Cảm ơn bạn đã tin tưởng Share Account.
          </p>

          {/* Thông báo quan trọng */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left mb-8">
            <h3 className="text-blue-800 font-bold mb-2 text-sm uppercase tracking-wide">
              Bước tiếp theo:
            </h3>
            <ul className="text-sm text-blue-700 space-y-2 list-disc pl-4">
              <li>Hệ thống đã gửi email xác nhận đến hộp thư của bạn.</li>
              <li>
                Chúng tôi sẽ xử lý yêu cầu dịch vụ của bạn trong vòng{" "}
                <strong>5 - 10 phút</strong>.
              </li>
              <li>Vui lòng kiểm tra cả hòm thư Spam/Quảng cáo.</li>
            </ul>
          </div>

          {/* Buttons điều hướng */}
          <div className="space-y-3">
            <Link href="/dashboard" className="block w-full">
              <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                <span>Quản lý dịch vụ</span>
                <ArrowRight size={18} />
              </button>
            </Link>

            <Link href="/" className="block w-full">
              <button className="w-full bg-white text-gray-600 border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Home size={18} />
                <span>Về trang chủ</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
