"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Search,
  Filter,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Eye,
  X,
} from "lucide-react";

// Dữ liệu giả lập (Mock Data)
// "issue" tương ứng với các option bên trang User Support
const initialRequests = [
  {
    id: "SP001",
    customer: "Nguyễn Thị Hồng Nhung",
    email: "nhung13042005@gmail.com",
    issue: "Lỗi kỹ thuật / Đăng nhập",
    content:
      "Mình không đăng nhập được dù đã nhập đúng mật khẩu. Hệ thống báo lỗi 403.",
    status: "Done",
    date: "30/12/2025",
  },
  {
    id: "SP002",
    customer: "Huỳnh Kim Toàn",
    email: "23521600@gm.uit.edu.vn",
    issue: "Thanh toán / Gia hạn",
    content:
      "Mình vừa chuyển khoản gia hạn gói ChatGPT nhưng chưa thấy cập nhật.",
    status: "Processing",
    date: "16/03/2025",
  },
  {
    id: "SP003",
    customer: "Cao Phan Hoàng Phương",
    email: "23521240@gm.uit.edu.vn",
    issue: "Tư vấn gói dịch vụ",
    content: "Cho mình hỏi gói Canva Pro có dùng được font chữ riêng không?",
    status: "New",
    date: "01/11/2026",
  },
  {
    id: "SP004",
    customer: "Lê Văn Luyện",
    email: "luyen.lv@gmail.com",
    issue: "Lỗi kỹ thuật / Đăng nhập",
    content: "Tài khoản Youtube bị mất Premium.",
    status: "New",
    date: "15/05/2026",
  },
  {
    id: "SP005",
    customer: "Trần Đức Bo",
    email: "bo.meo@yahoo.com",
    issue: "Khác",
    content: "Muốn hợp tác làm đại lý.",
    status: "Done",
    date: "20/10/2026",
  },
];

const ITEMS_PER_PAGE = 5;

export default function AdminSupportPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // State cho Modal Xem/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // --- STATS ---
  const stats = {
    new: requests.filter((r) => r.status === "New").length,
    processing: requests.filter((r) => r.status === "Processing").length,
    done: requests.filter((r) => r.status === "Done").length,
  };

  // --- FILTER & PAGINATION ---
  const filteredRequests = requests.filter(
    (req) =>
      req.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // --- ACTIONS ---
  const openDetailModal = (request: any) => {
    setSelectedRequest({ ...request }); // Copy object để sửa không ảnh hưởng list gốc ngay
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      setRequests(
        requests.map((r) => (r.id === selectedRequest.id ? selectedRequest : r))
      );
      setIsModalOpen(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            Mới
          </span>
        );
      case "Processing":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            Đang xử lý
          </span>
        );
      case "Done":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            Hoàn thành
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
            Quản lý hỗ trợ
          </h1>
          <p className="text-gray-500">
            Theo dõi và xử lý các yêu cầu từ khách hàng
          </p>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600 w-fit mb-3">
              <Mail size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.new}</h3>
            <p className="text-sm text-gray-500">Yêu cầu mới</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 w-fit mb-3">
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
          <p className="text-sm text-gray-500">Đã giải quyết</p>
        </div>
      </div>

      {/* --- THANH TÌM KIẾM --- */}
      <div className="bg-white p-4 rounded-t-2xl border-b border-gray-100 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all"
          />
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU --- */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                {/* Đã thay đổi cột Nội dung -> Vấn đề */}
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Vấn đề
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Ngày gửi
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {req.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {req.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Hiển thị loại vấn đề ngắn gọn */}
                    <div className="text-sm text-gray-700 font-medium">
                      {req.issue}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {renderStatusBadge(req.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openDetailModal(req)}
                      className="text-blue-600 hover:text-blue-900 font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Không tìm thấy yêu cầu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        {filteredRequests.length > 0 && (
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

      {/* --- MODAL CHI TIẾT & CẬP NHẬT --- */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Chi tiết yêu cầu #{selectedRequest.id}
                </h3>
                <p className="text-xs text-gray-500">{selectedRequest.date}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
              {/* Thông tin khách hàng */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                    Khách hàng
                  </label>
                  <div className="text-sm font-bold text-gray-900">
                    {selectedRequest.customer}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                    Email
                  </label>
                  <div className="text-sm text-gray-900">
                    {selectedRequest.email}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 my-2"></div>

              {/* Vấn đề (Read-only) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Loại vấn đề
                </label>
                <input
                  type="text"
                  value={selectedRequest.issue}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                />
              </div>

              {/* Nội dung chi tiết (Read-only) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Nội dung chi tiết
                </label>
                <textarea
                  rows={4}
                  value={selectedRequest.content}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 resize-none"
                ></textarea>
              </div>

              {/* Cập nhật trạng thái */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Cập nhật trạng thái
                </label>
                <select
                  value={selectedRequest.status}
                  onChange={(e) =>
                    setSelectedRequest({
                      ...selectedRequest,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
                >
                  <option value="New">Mới (Chưa xử lý)</option>
                  <option value="Processing">Đang xử lý</option>
                  <option value="Done">Đã giải quyết</option>
                </select>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 shadow-md"
                >
                  Lưu cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
