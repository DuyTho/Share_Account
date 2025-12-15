"use client";

import Navbar from "@/components/layout/Navbar";
import {
  User,
  Edit2,
  Clock,
  AlertCircle,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Quản lý dịch vụ
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- CỘT TRÁI: DANH SÁCH GÓI & LỊCH SỬ --- */}
          <div className="flex-1 space-y-8">
            {/* Section: Gói dịch vụ của tôi */}
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Gói dịch vụ của tôi
              </h3>

              <div className="space-y-4">
                {/* Card 1: Đang hoạt động */}
                <div className="border border-green-200 rounded-2xl p-5 bg-green-50/30 relative">
                  <div className="absolute top-4 left-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Đang hoạt động
                  </div>

                  <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div className="w-full">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        Youtube Premium (1 Năm)
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Ngày kích hoạt: 01/11/2025 | Hết hạn: 01/11/2026
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-success h-2 rounded-full w-[30%]"></div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        Còn 365 ngày
                      </p>
                    </div>

                    <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors whitespace-nowrap shadow-blue-200 shadow-md">
                      Gia hạn ngay
                    </button>
                  </div>
                </div>

                {/* Card 2: Đã hết hạn */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50 relative grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
                  <div className="absolute top-4 left-4 bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                    Đã hết hạn
                  </div>

                  <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        ChatGPT Plus
                      </h4>
                      <p className="text-sm text-gray-500">
                        Hết hạn: 25/10/2025
                      </p>
                    </div>
                    <button className="border border-primary text-primary px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
                      Mua lại
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Lịch sử giao dịch */}
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Lịch sử giao dịch gần đây
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b border-gray-100">
                      <th className="pb-3 font-medium">Mã đơn</th>
                      <th className="pb-3 font-medium">Dịch vụ</th>
                      <th className="pb-3 font-medium">Ngày</th>
                      <th className="pb-3 font-medium">Số tiền</th>
                      <th className="pb-3 font-medium text-right">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">
                        #ORD-9921
                      </td>
                      <td className="py-4 font-bold text-gray-800">
                        Youtube Premium
                      </td>
                      <td className="py-4 text-gray-500">01/11/2025</td>
                      <td className="py-4 font-medium">300.000đ</td>
                      <td className="py-4 text-right text-success font-bold">
                        Thành công
                      </td>
                    </tr>
                    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">
                        #ORD-8812
                      </td>
                      <td className="py-4 font-bold text-gray-800">
                        ChatGPT Plus
                      </td>
                      <td className="py-4 text-gray-500">25/09/2025</td>
                      <td className="py-4 font-medium">200.000đ</td>
                      <td className="py-4 text-right text-success font-bold">
                        Thành công
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: SIDEBAR USER --- */}
          <div className="lg:w-[350px] space-y-6">
            {/* Card Profile */}
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-primary mb-4 border-4 border-white shadow-sm">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Nguyễn Văn A</h2>
              <p className="text-sm text-gray-500 mb-6">nguyenvana@gmail.com</p>

              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Edit2 size={14} />
                Chỉnh sửa hồ sơ
              </button>
            </div>

            {/* Card Thống kê */}
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Tổng quan tài khoản
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-gray-400 mb-1 flex justify-center">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="text-xl font-bold text-gray-900">02</div>
                  <div className="text-xs text-gray-500">Gói đã mua</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <div className="text-gray-400 mb-1 flex justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div className="text-xl font-bold text-primary">0.5 Tr</div>
                  <div className="text-xs text-gray-500">Tổng chi tiêu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
