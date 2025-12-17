"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  TrendingUp,
  ShoppingBag,
  UserPlus,
  Package,
  DollarSign,
} from "lucide-react";

// Component Card Thống kê
const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div
    className={`bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between ${color}`}
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center bg-opacity-20`}
      >
        <Icon size={24} />
      </div>
    </div>
    <div className="flex flex-col">
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {trend && (
        <div className="flex items-center text-sm font-medium">
          <TrendingUp size={16} className="mr-1" />
          <span>{trend} tháng này</span>
        </div>
      )}
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // --- BẢO VỆ TRANG ADMIN ---
  useEffect(() => {
    // 1. Lấy thông tin user từ localStorage
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      // Chưa đăng nhập -> Đá về trang login
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);

    // 2. Kiểm tra quyền
    if (user.role !== "admin") {
      // Đã đăng nhập nhưng không phải admin -> Đá về trang chủ
      alert("Bạn không có quyền truy cập trang này!");
      router.push("/");
    } else {
      // Đúng là admin -> Cho phép hiển thị
      setAuthorized(true);
    }
  }, [router]);

  // Nếu chưa check xong quyền thì không hiện gì cả (hoặc hiện loading)
  if (!authorized) {
    return null;
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Tổng quan</h1>
      <p className="text-gray-500 mb-8">Xem toàn bộ hoạt động và doanh thu</p>

      {/* --- HÀNG 1: THẺ THỐNG KÊ --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Tổng doanh thu"
          value="45.000.000đ"
          icon={DollarSign}
          color="text-primary"
          trend="+12%"
        />
        <StatCard
          title="Tổng đơn hàng"
          value="320 đơn"
          icon={ShoppingBag}
          color="text-yellow-600"
          trend="-3%"
        />
        <StatCard
          title="Người dùng đăng ký"
          value="1000 người"
          icon={UserPlus}
          color="text-purple-600"
          trend="+5%"
        />
        <StatCard
          title="Gói đang hoạt động"
          value="28 gói"
          icon={Package}
          color="text-success"
          trend="Đang bán"
        />
      </div>

      {/* --- HÀNG 2: BIỂU ĐỒ --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 lg:col-span-2 min-h-[300px]">
          <h3 className="text-lg font-bold mb-4">Doanh thu theo tháng</h3>
          <div className="h-[85%] w-full bg-gray-50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-xl">
            [Biểu đồ sẽ hiển thị tại đây]
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 min-h-[300px]">
          <h3 className="text-lg font-bold mb-4">Tỷ lệ gói được mua</h3>
          <div className="h-[85%] w-full bg-gray-50 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-xl">
            [Biểu đồ tròn]
          </div>
        </div>
      </div>

      {/* --- HÀNG 3: BẢNG ĐƠN HÀNG --- */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Đơn hàng gần đây</h3>
          <button className="text-sm text-primary hover:underline">
            Xem tất cả
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Gói
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Dữ liệu giả mẫu */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                  #OD-001
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Nguyễn Thị Hồng Nhung
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  Canva Pro
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  200.000đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                    Hoàn thành
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  16/12/2025
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                  #OD-002
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Trần Kim Toàn
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ChatGPT Pro
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  300.000đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Đang xử lý
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  16/12/2025
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
