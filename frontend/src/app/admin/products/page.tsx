"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 1. Dữ liệu giả lập (Tăng lên 12 item để test phân trang)
const initialProducts = [
  {
    id: 1,
    name: "Youtube Premium - 1 Tháng",
    price: 100000,
    duration: "1 Tháng",
    status: "Active",
  },
  {
    id: 2,
    name: "Youtube Premium - 6 Tháng",
    price: 450000,
    duration: "6 Tháng",
    status: "Active",
  },
  {
    id: 3,
    name: "Youtube Premium - 1 Năm",
    price: 800000,
    duration: "12 Tháng",
    status: "Active",
  },
  {
    id: 4,
    name: "Spotify Premium - 1 Năm",
    price: 350000,
    duration: "12 Tháng",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Netflix 4K - 1 Tháng",
    price: 65000,
    duration: "1 Tháng",
    status: "Active",
  },
  {
    id: 6,
    name: "Netflix 4K - 3 Tháng",
    price: 190000,
    duration: "3 Tháng",
    status: "Active",
  },
  {
    id: 7,
    name: "Canva Pro - Trọn đời",
    price: 150000,
    duration: "Vĩnh viễn",
    status: "Active",
  },
  {
    id: 8,
    name: "Elsa Speak - 1 Năm",
    price: 590000,
    duration: "12 Tháng",
    status: "Inactive",
  },
  {
    id: 9,
    name: "Zoom Pro - 1 Tháng",
    price: 200000,
    duration: "1 Tháng",
    status: "Active",
  },
  {
    id: 10,
    name: "Google One 100GB",
    price: 45000,
    duration: "1 Tháng",
    status: "Active",
  },
  {
    id: 11,
    name: "Office 365 Personal",
    price: 890000,
    duration: "12 Tháng",
    status: "Inactive",
  },
  {
    id: 12,
    name: "Duolingo Plus - 1 Năm",
    price: 250000,
    duration: "12 Tháng",
    status: "Active",
  },
];

const ITEMS_PER_PAGE = 5; // Số item trên mỗi trang

type Product = {
  id: number;
  name: string;
  price: number;
  duration: string;
  status: string;
};

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // State quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // Cắt mảng data gốc để chỉ lấy 5 item cho trang hiện tại
  const currentProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Hàm chuyển trang
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- STATE CŨ (MODAL, FORM) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    duration: "",
    status: "Active",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // --- CÁC HÀM XỬ LÝ (ADD, EDIT, DELETE) ---
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", price: 0, duration: "", status: "Active" });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditMode(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      duration: product.duration,
      status: product.status,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentId) {
      setProducts(
        products.map((p) => (p.id === currentId ? { ...p, ...formData } : p))
      );
    } else {
      const newId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const newProduct = { id: newId, ...formData };
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  const requestDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setProducts(products.filter((p) => p.id !== deleteId));
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      // Nếu xóa hết item ở trang cuối, lùi về trang trước
      if (currentProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Quản lý gói dịch vụ
          </h1>
          <p className="text-gray-500">
            Danh sách các gói đang bán trên hệ thống
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm gói mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-t-2xl border-b border-gray-100 flex items-center gap-2">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm tên gói dịch vụ..."
          className="flex-1 outline-none text-sm text-gray-700"
        />
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tên gói
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Thời hạn
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Giá bán
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {/* LƯU Ý: Ở đây dùng currentProducts thay vì products */}
              {currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {product.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-primary">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.status === "Active" ? "Đang bán" : "Ngừng bán"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => requestDelete(product.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PHẦN PAGINATION --- */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          {/* Mobile View: Chỉ hiện nút Prev/Next */}
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div></div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                {/* Nút Previous */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Các nút số trang */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ring-1 ring-inset ring-gray-300
                                    ${
                                      isActive
                                        ? "z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                        : "text-gray-900 hover:bg-gray-50"
                                    }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Nút Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL FORMS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {isEditMode ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên gói dịch vụ
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                  placeholder="VD: Youtube Premium 1 Năm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá bán (VNĐ)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời hạn
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-blue-100"
                    placeholder="VD: 12 Tháng"
                  />
                </div>
              </div>
              {isEditMode && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-primary"
                  >
                    <option value="Active">Đang bán</option>
                    <option value="Inactive">Ngừng bán</option>
                  </select>
                </div>
              )}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 shadow-md"
                >
                  {isEditMode ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL XÁC NHẬN XÓA --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Xác nhận xóa?
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Bạn có chắc chắn muốn xóa gói dịch vụ này không? <br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
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
