"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  TrendingUp,
  ShoppingBag,
  UserPlus,
  Package,
  DollarSign,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

// --- Types cập nhật theo đúng cấu trúc JSON từ DashboardController ---
interface DashboardData {
  cards: {
    revenue: number;
    orders: number;
    users: number;
    active_subs: number;
  };
  recent_orders: {
    id: number;
    customer: string;
    package: string;
    amount: number;
    status: string;
    date: string;
  }[];
  // chart_data có thể thêm vào sau nếu cần vẽ biểu đồ thật
}

// Component Card Thống kê (Giữ nguyên UI)
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
          <span>{trend}</span>
        </div>
      )}
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardData | null>(null);

  // --- CHECK QUYỀN & FETCH DATA ---
  useEffect(() => {
    const initDashboard = async () => {
      // 1. Check Auth
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.push("/login");
        return;
      }
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        alert("Bạn không có quyền truy cập trang này!");
        router.push("/");
        return;
      }
      setAuthorized(true);

      // 2. Fetch Data từ API Backend
      try {
        // Cập nhật đường dẫn đúng: /dashboard/stats
        const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          console.error("Lỗi tải thống kê dashboard");
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  // Helpers Format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
            Hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
            Đang xử lý
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (!authorized) return null;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[500px]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Tổng quan</h1>
      <p className="text-gray-500 mb-8">
        Số liệu thống kê thời gian thực từ hệ thống
      </p>

      {/* --- HÀNG 1: THẺ THỐNG KÊ (DỮ LIỆU THẬT) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Tổng doanh thu"
          // Truy cập vào stats.cards.revenue thay vì stats.revenue
          value={stats ? formatCurrency(stats.cards.revenue) : "0đ"}
          icon={DollarSign}
          color="text-primary"
          trend="Tất cả thời gian"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats ? `${stats.cards.orders} đơn` : "0 đơn"}
          icon={ShoppingBag}
          color="text-yellow-600"
          trend="Tất cả thời gian"
        />
        <StatCard
          title="Người dùng"
          value={stats ? `${stats.cards.users} người` : "0 người"}
          icon={UserPlus}
          color="text-purple-600"
          trend="Khách hàng"
        />
        <StatCard
          title="Gói đang chạy"
          value={stats ? `${stats.cards.active_subs} gói` : "0 gói"}
          icon={Package}
          color="text-success"
          trend="Active Subs"
        />
      </div>

      {/* --- HÀNG 2: BIỂU ĐỒ (Placeholder) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 lg:col-span-2 min-h-[300px]">
          <h3 className="text-lg font-bold mb-4">Biểu đồ doanh thu</h3>
          <div className="h-[85%] w-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-xl gap-2">
            <DollarSign size={40} className="text-gray-300" />
            <p>Tính năng đang phát triển</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 min-h-[300px]">
          <h3 className="text-lg font-bold mb-4">Tỷ lệ gói dịch vụ</h3>
          <div className="h-[85%] w-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-xl gap-2">
            <Package size={40} className="text-gray-300" />
            <p>Tính năng đang phát triển</p>
          </div>
        </div>
      </div>

      {/* --- HÀNG 3: BẢNG ĐƠN HÀNG MỚI NHẤT --- */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Đơn hàng mới nhất</h3>
          <Link
            href="/admin/orders"
            className="text-sm text-primary hover:underline font-bold"
          >
            Xem tất cả
          </Link>
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
              {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                stats.recent_orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.package}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
