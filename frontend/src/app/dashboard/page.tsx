"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import {
  User,
  Edit2,
  Clock,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  Loader2,
  PackageX,
  Link,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

// --- Types ---
interface Subscription {
  sub_id: number;
  start_date: string;
  end_date: string;
  status: string;
  Products: {
    name: string;
    duration_months: number;
  };
}

interface Order {
  order_id: number;
  date: string;
  total: string;
  payment_status: string;
  Products: {
    name: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data States
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  useEffect(() => {
    // 1. Check Auth
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    // 2. Fetch Data
    const fetchData = async () => {
      try {
        // Gọi song song 2 API để tiết kiệm thời gian
        const [subRes, orderRes] = await Promise.all([
          fetch(`${API_BASE_URL}/subscriptions/user/${parsedUser.user_id}`),
          fetch(`${API_BASE_URL}/orders/user/${parsedUser.user_id}`),
        ]);

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscriptions(subData);
        }

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrders(orderData);

          // Tính toán thống kê
          const totalSpent = orderData.reduce(
            (sum: number, item: any) => sum + Number(item.total),
            0
          );
          setStats({
            totalOrders: orderData.length,
            totalSpent: totalSpent,
          });
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- Helpers ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  // Tính % thời gian đã dùng để vẽ Progress Bar
  const calculateProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const now = new Date().getTime();

    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;

    const percent = (elapsed / totalDuration) * 100;
    return Math.min(Math.max(percent, 0), 100); // Giới hạn 0-100%
  };

  // Tính số ngày còn lại
  const getDaysLeft = (end: string) => {
    const endDate = new Date(end).getTime();
    const now = new Date().getTime();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleRenew = async (subId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/renew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sub_id: subId }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(data.redirect_url);
      } else {
        console.error("Lỗi gia hạn:", await response.text());
      }
    } catch (error) {
      console.error("Lỗi khi gọi API gia hạn:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
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
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Gói dịch vụ của tôi
                <span className="bg-blue-100 text-primary text-xs px-2 py-1 rounded-full">
                  {subscriptions.length}
                </span>
              </h3>

              <div className="space-y-4">
                {subscriptions.length > 0 ? (
                  subscriptions.map((sub) => {
                    const daysLeft = getDaysLeft(sub.end_date);
                    const isExpired = daysLeft <= 0 || sub.status === "expired";
                    const progress = calculateProgress(
                      sub.start_date,
                      sub.end_date
                    );

                    return (
                      <div
                        key={sub.sub_id}
                        className={`border rounded-2xl p-5 relative transition-all ${
                          isExpired
                            ? "border-gray-200 bg-gray-50 opacity-80 grayscale hover:grayscale-0 hover:opacity-100"
                            : "border-green-200 bg-green-50/30"
                        }`}
                      >
                        {/* Badge Trạng thái */}
                        <div
                          className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                            isExpired
                              ? "bg-gray-200 text-gray-600"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isExpired ? (
                            "Đã hết hạn"
                          ) : (
                            <>
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              Đang hoạt động
                            </>
                          )}
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                          <div className="w-full">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {sub.Products.name}
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">
                              Kích hoạt: {formatDate(sub.start_date)} | Hết hạn:{" "}
                              {formatDate(sub.end_date)}
                            </p>

                            {/* Progress Bar */}
                            {!isExpired && (
                              <>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                                  <div
                                    className="bg-[#28A745] h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                  <Clock size={12} /> Còn {daysLeft} ngày sử
                                  dụng
                                </p>
                              </>
                            )}
                          </div>

                          <button
                            onClick={() => handleRenew(sub.sub_id)}
                            className={`${
                              isExpired
                                ? "border border-primary text-primary hover:bg-blue-50"
                                : "bg-primary text-white hover:bg-blue-600 shadow-blue-200 shadow-md"
                            } px-6 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap`}
                          >
                            {isExpired ? "Mua lại" : "Gia hạn"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                    <PackageX
                      className="mx-auto text-gray-300 mb-2"
                      size={40}
                    />
                    <p className="text-gray-500">
                      Bạn chưa đăng ký gói dịch vụ nào.
                    </p>
                  </div>
                )}
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
                      <th className="pb-3 font-medium pl-2">Mã đơn</th>
                      <th className="pb-3 font-medium">Dịch vụ</th>
                      <th className="pb-3 font-medium">Ngày</th>
                      <th className="pb-3 font-medium">Số tiền</th>
                      <th className="pb-3 font-medium text-right pr-2">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr
                          key={order.order_id}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 font-medium text-gray-900 pl-2">
                            #{order.order_id}
                          </td>
                          <td className="py-4 font-bold text-gray-800">
                            {order.Products.name}
                          </td>
                          <td className="py-4 text-gray-500">
                            {formatDate(order.date)}
                          </td>
                          <td className="py-4 font-medium">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="py-4 text-right pr-2">
                            <span
                              className={`font-bold ${
                                order.payment_status === "paid"
                                  ? "text-[#28A745]"
                                  : "text-orange-500"
                              }`}
                            >
                              {order.payment_status === "paid"
                                ? "Thành công"
                                : order.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 text-center text-gray-500"
                        >
                          Chưa có giao dịch nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: SIDEBAR USER --- */}
          <div className="lg:w-[350px] space-y-6">
            {/* Card Profile */}
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 text-center sticky top-24">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-primary mb-4 border-4 border-white shadow-sm ring-1 ring-blue-50">
                <span className="text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
              <button
                onClick={() => router.push("/profile")}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
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
                <div className="bg-gray-50 p-4 rounded-xl text-center hover:bg-blue-50 transition-colors cursor-default">
                  <div className="text-gray-400 mb-1 flex justify-center">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </div>
                  <div className="text-xs text-gray-500">Đơn hàng</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center hover:bg-blue-50 transition-colors cursor-default">
                  <div className="text-gray-400 mb-1 flex justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div className="text-xl font-bold text-primary truncate">
                    {/* Hiển thị kiểu rút gọn: 1.5 Tr */}
                    {(stats.totalSpent / 1000000).toFixed(1)} Tr
                  </div>
                  <div className="text-xs text-gray-500">Tổng chi tiêu</div>
                </div>
              </div>
            </div>

            {/* Banner Quảng cáo nhỏ (Optional) */}
            <div className="bg-gradient-to-br from-primary to-blue-600 rounded-[20px] p-6 text-white text-center">
              <p className="font-bold text-lg mb-2">Nâng cấp Youtube?</p>
              <p className="text-sm text-blue-100 mb-4">
                Chỉ từ 80k/tháng, không quảng cáo.
              </p>
              <button
                className="bg-white text-primary text-xs font-bold px-4 py-2 rounded-lg shadow-sm"
                onClick={() => router.push("/")}
              >
                Xem ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
