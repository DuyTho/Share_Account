"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Search,
  Filter,
  Download,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Check,
  Trash2,
  Calendar,
  AlertTriangle,
  Loader2,
  RefreshCcw,
  Ban,
} from "lucide-react";

// Cấu hình URL
const API_BASE_URL = "http://localhost:8080";

// Interface map đúng với dữ liệu trả về từ Backend
interface Order {
  order_id: number;
  user: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    duration: number;
  };
  amount: string; // Decimal trả về string
  status: "pending" | "paid" | "cancelled";
  created_at: string;
  expiry_date: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [doneModal, setDoneModal] = useState<{
    isOpen: boolean;
    id: number | null;
  }>({ isOpen: false, id: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: number | null;
  }>({ isOpen: false, id: null });

  // 1. Gọi API lấy danh sách
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        alert("Lỗi tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Thống kê
  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.status === "pending").length,
    done: orders.filter((o) => o.status === "paid").length,
    cancel: orders.filter((o) => o.status === "cancelled").length,
  };

  // 3. Logic Filter & Search
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      order.order_id.toString().includes(searchLower) ||
      order.user.name.toLowerCase().includes(searchLower) ||
      order.user.email.toLowerCase().includes(searchLower);

    let matchStatus = true;
    if (statusFilter !== "All") {
      if (statusFilter === "Processing")
        matchStatus = order.status === "pending";
      if (statusFilter === "Done") matchStatus = order.status === "paid";
      if (statusFilter === "Cancel") matchStatus = order.status === "cancelled";
    }

    return matchSearch && matchStatus;
  });

  // 4. Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // 5. Xử lý Done (Chuyển pending -> paid)
  const confirmDone = async () => {
    if (!doneModal.id) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/orders/${doneModal.id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "paid" }),
        }
      );

      if (res.ok) {
        // Cập nhật State trực tiếp để không cần load lại trang
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === doneModal.id ? { ...o, status: "paid" } : o
          )
        );
        setDoneModal({ isOpen: false, id: null });
      } else {
        alert("Lỗi cập nhật trạng thái");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 6. Xử lý Delete
  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/orders/${deleteModal.id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.order_id !== deleteModal.id));
        setDeleteModal({ isOpen: false, id: null });
        // Reset về trang 1 nếu xóa hết item trang hiện tại
        if (paginatedOrders.length === 1 && currentPage > 1)
          setCurrentPage(currentPage - 1);
      } else {
        alert("Lỗi xóa đơn hàng");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 7. Helpers
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            Hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            Đang xử lý
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-500 flex items-center gap-2">
            Theo dõi trạng thái đơn hàng từ hệ thống
            {loading && (
              <Loader2 className="animate-spin text-primary" size={16} />
            )}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 w-fit mb-3">
            <ShoppingCart size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
          <p className="text-sm text-gray-500">Tổng đơn hàng</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600 w-fit mb-3">
            <Clock size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.processing}
          </h3>
          <p className="text-sm text-gray-500">Đang xử lý</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-green-50 rounded-xl text-green-600 w-fit mb-3">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.done}</h3>
          <p className="text-sm text-gray-500">Hoàn thành</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-red-50 rounded-xl text-red-600 w-fit mb-3">
            <XCircle size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.cancel}</h3>
          <p className="text-sm text-gray-500">Đã hủy</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-t-2xl border-b border-gray-100 flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="flex gap-2 w-full md:w-auto items-end">
          <div className="flex-1 md:w-64">
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Tìm kiếm
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Tên khách, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-primary block w-full pl-10 p-2.5 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="w-48">
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">Tất cả</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Done">Hoàn thành</option>
              <option value="Cancel">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Gói mua
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Hết hạn (Dự kiến)
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-primary"
                      size={32}
                    />
                  </td>
                </tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.order_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      #{order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-bold">{order.user.name}</div>
                      <div className="text-xs text-gray-500">
                        {order.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.expiry_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {order.status === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                setDoneModal({
                                  isOpen: true,
                                  id: order.order_id,
                                })
                              }
                              className="bg-green-100 text-green-700 hover:bg-green-200 p-1.5 rounded-lg text-xs font-bold px-3 flex items-center gap-1"
                            >
                              <Check size={14} /> Duyệt
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm("Bạn muốn HỦY đơn này?")) {
                                  await fetch(
                                    `${API_BASE_URL}/admin/orders/${order.order_id}/status`,
                                    {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        status: "cancelled",
                                      }),
                                    }
                                  );
                                  fetchOrders();
                                }
                              }}
                              className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 p-1.5 rounded-lg text-xs font-bold px-3"
                            >
                              <Ban size={14} /> Hủy
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 font-bold p-2">
                            Đã xử lý
                          </span>
                        )}
                        <button
                          onClick={() =>
                            setDeleteModal({ isOpen: true, id: order.order_id })
                          }
                          className="bg-red-50 text-red-600 hover:bg-red-100 p-1.5 rounded-lg text-xs font-bold px-3"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center bg-white">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                &lt;
              </button>
              <span className="h-8 flex items-center px-4 text-sm font-bold text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRM DONE MODAL */}
      {doneModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Duyệt đơn hàng #{doneModal.id}?
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Hành động này sẽ chuyển trạng thái sang "Hoàn thành".
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDoneModal({ isOpen: false, id: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmDone}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xóa đơn hàng #{deleteModal.id}?
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Hành động này sẽ xóa vĩnh viễn đơn hàng và lịch sử đăng ký.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
