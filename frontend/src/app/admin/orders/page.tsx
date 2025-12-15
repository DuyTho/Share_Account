"use client";

import { useState } from "react";
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
  AlertTriangle, // Import thêm AlertTriangle
} from "lucide-react";

// Dữ liệu giả lập
const initialOrders = [
  {
    id: "SO001",
    customer: "Nguyễn Thị Hồng Nhung",
    amount: 65000,
    package: "Netflix 4K - 1 Tháng",
    status: "Done",
    expiry: "30/12/2025",
  },
  {
    id: "SO002",
    customer: "Huỳnh Kim Toàn",
    amount: 120000,
    package: "ChatGPT Plus",
    status: "Cancel",
    expiry: "16/03/2025",
  },
  {
    id: "SO003",
    customer: "Cao Phan Hoàng Phương",
    amount: 60000,
    package: "Canva Pro",
    status: "Processing",
    expiry: "01/11/2026",
  },
  {
    id: "SO004",
    customer: "Lê Văn Luyện",
    amount: 450000,
    package: "Youtube Premium 6T",
    status: "Processing",
    expiry: "15/05/2026",
  },
  {
    id: "SO005",
    customer: "Trần Đức Bo",
    amount: 300000,
    package: "Spotify 1 Năm",
    status: "Done",
    expiry: "20/10/2026",
  },
  {
    id: "SO006",
    customer: "Phạm Thoại",
    amount: 90000,
    package: "Zoom Pro",
    status: "Cancel",
    expiry: "12/12/2025",
  },
  {
    id: "SO007",
    customer: "Độ Mixi",
    amount: 1500000,
    package: "Gói Family Youtube",
    status: "Done",
    expiry: "01/01/2027",
  },
];

const ITEMS_PER_PAGE = 5;

export default function AdminOrderPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // --- STATE QUẢN LÝ MODAL ---
  const [doneModal, setDoneModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });

  // --- STATS ---
  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.status === "Processing").length,
    done: orders.filter((o) => o.status === "Done").length,
    cancel: orders.filter((o) => o.status === "Cancel").length,
  };

  // --- FILTER & PAGINATION ---
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // --- ACTION HANDLERS ---

  // 1. Xử lý nút Done
  const openDoneModal = (id: string) => {
    setDoneModal({ isOpen: true, id });
  };

  const confirmDone = () => {
    if (doneModal.id) {
      setOrders(
        orders.map((o) =>
          o.id === doneModal.id ? { ...o, status: "Done" } : o
        )
      );
      setDoneModal({ isOpen: false, id: null });
    }
  };

  // 2. Xử lý nút Delete
  const openDeleteModal = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = () => {
    if (deleteModal.id) {
      setOrders(orders.filter((o) => o.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null });
      // Nếu xóa hết trang hiện tại thì lùi về 1 trang
      if (paginatedOrders.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Done":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            Hoàn thành
          </span>
        );
      case "Processing":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            Đang xử lý
          </span>
        );
      case "Cancel":
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
          <p className="text-gray-500">Theo dõi quá trình xử lý đơn hàng</p>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 w-fit mb-3">
              <ShoppingCart size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            <p className="text-sm text-gray-500">Tổng đơn hàng</p>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
            +12%
          </span>
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

      {/* --- FILTERS --- */}
      <div className="bg-white p-4 rounded-t-2xl border-b border-gray-100 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="w-full md:w-48">
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Processing">Đang xử lý</option>
              <option value="Done">Hoàn thành</option>
              <option value="Cancel">Đã hủy</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Ngày hết hạn
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Calendar size={16} />
              </div>
              <input
                type="text"
                placeholder="dd/mm/yy"
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto items-end">
          <div className="flex-1 md:w-64">
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Tên khách hàng
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5 outline-none"
              />
            </div>
          </div>
          <button className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 h-[42px]">
            <Filter size={16} /> Lọc
          </button>
          <button className="bg-green-100 text-green-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors flex items-center gap-2 h-[42px]">
            <Download size={16} /> Excel
          </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Gói mua
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Hết hạn
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {order.amount.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.package}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {renderStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.expiry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Action: DONE */}
                      {order.status === "Processing" ? (
                        <button
                          onClick={() => openDoneModal(order.id)}
                          className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 p-1.5 rounded-lg transition-colors text-xs font-bold px-3 flex items-center gap-1 shadow-sm"
                        >
                          <Check size={14} strokeWidth={3} /> Done
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-100 text-gray-400 p-1.5 rounded-lg cursor-default opacity-50 text-xs font-bold px-3 flex items-center gap-1"
                        >
                          <Check size={14} /> Done
                        </button>
                      )}

                      {/* Action: DELETE */}
                      <button
                        onClick={() => openDeleteModal(order.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition-colors text-xs font-bold px-3 flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Giữ nguyên) */}
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
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                    currentPage === i + 1
                      ? "bg-primary text-white shadow-md shadow-blue-200"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
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

      {/* --- MODAL XÁC NHẬN HOÀN THÀNH (DONE) --- */}
      {doneModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xác nhận hoàn thành?
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Bạn xác nhận đã gửi tài khoản cho khách hàng và muốn hoàn tất đơn{" "}
              <strong>{doneModal.id}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDoneModal({ isOpen: false, id: null })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDone}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL XÁC NHẬN XÓA (DELETE) --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xác nhận xóa?
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Bạn có chắc chắn muốn xóa đơn hàng{" "}
              <strong>{deleteModal.id}</strong> không? <br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
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
