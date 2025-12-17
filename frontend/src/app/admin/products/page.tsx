"use client";

import { useState, useEffect } from "react";
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
  RefreshCcw, // Thêm icon loading
} from "lucide-react";

// URL API Backend (Đảm bảo Backend đang chạy ở port 3000)
const API_URL = "http://localhost:8080/products";

const ITEMS_PER_PAGE = 5;

type Product = {
  id: number;
  name: string;
  price: number;
  duration: string; // Hiển thị trên bảng (VD: "12 Tháng")
  duration_months: number; // Dữ liệu gốc để gửi lên Server
  status: string;
  description: string;
};

export default function AdminProductPage() {
  // 1. State lưu trữ sản phẩm từ API
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // State quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // --- HÀM GỌI API LẤY DANH SÁCH ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      // Mapping dữ liệu từ Backend (product_id) sang Frontend (id)
      const formattedData = data.map((item: any) => ({
        id: item.product_id,
        name: item.name,
        price: Number(item.price),
        duration: `${item.duration_months} Tháng`,
        duration_months: item.duration_months,
        status: item.is_active ? "Active" : "Inactive", // Giả sử backend chưa có field này thì mặc định Active
        description: item.description || "",
      }));

      setProducts(formattedData);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      alert("Không thể kết nối tới Backend!");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi vào trang
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Form Data (Cập nhật để khớp với DB)
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    duration_months: 1, // Dùng số tháng thay vì text
    description: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // --- CÁC HÀM XỬ LÝ (ADD, EDIT, DELETE VỚI API) ---
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", price: 0, duration_months: 1, description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditMode(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      duration_months: product.duration_months,
      description: product.description,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" || name === "description" ? value : Number(value),
    }));
  };

  // --- XỬ LÝ SUBMIT (GỌI API) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chuẩn bị dữ liệu gửi lên Server
    const payload = {
      name: formData.name,
      price: formData.price,
      duration_months: formData.duration_months,
      description: formData.description,
    };

    try {
      if (isEditMode && currentId) {
        // GỌI API EDIT (PUT)
        const res = await fetch(`${API_URL}/${currentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Lỗi cập nhật");
      } else {
        // GỌI API ADD (POST)
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Lỗi tạo mới");
      }

      // Thành công -> Tải lại danh sách
      await fetchProducts();
      setIsModalOpen(false);
      alert(isEditMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const requestDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // --- XỬ LÝ XÓA (GỌI API) ---
  const confirmDelete = async () => {
    if (deleteId) {
      try {
        // GỌI API DELETE (Bạn cần đảm bảo Backend đã có hàm deleteProduct)
        /* LƯU Ý: Nếu backend chưa có API Delete, bạn cần thêm vào backend trước.
           Tạm thời code này giả định backend đã có Route DELETE /products/:id
        */
        const res = await fetch(`${API_URL}/${deleteId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          await fetchProducts(); // Tải lại danh sách
          setIsDeleteModalOpen(false);
          setDeleteId(null);
          // Logic lùi trang nếu xóa hết item
          if (currentProducts.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          alert("Không thể xóa sản phẩm này (Có thể do ràng buộc khóa ngoại)");
          setIsDeleteModalOpen(false);
        }
      } catch (error) {
        console.error("Lỗi xóa:", error);
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
            Dữ liệu được đồng bộ trực tiếp từ Database
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

      {/* --- THANH TÌM KIẾM --- */}
      <div className="bg-white p-4 rounded-t-2xl border-b border-gray-100 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm tên gói dịch vụ..."
            className="flex-1 outline-none text-sm text-gray-700"
          />
        </div>
        <button
          onClick={fetchProducts}
          title="Tải lại dữ liệu"
          className="text-gray-400 hover:text-primary p-2"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
        {/* --- LOADING STATE --- */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <RefreshCcw size={40} className="animate-spin mb-4 text-primary" />
            <p>Đang tải dữ liệu từ server...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <p>Chưa có sản phẩm nào.</p>
          </div>
        ) : (
          <>
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
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Đang bán
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

            {/* --- PAGINATION (Giữ nguyên) --- */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Trang <span className="font-medium">{currentPage}</span> /{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {/* (Giữ logic render số trang cũ) */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- MODAL FORMS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {isEditMode ? "Chỉnh sửa gói" : "Thêm gói mới"}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2"
                  placeholder="VD: Youtube Premium"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tháng
                  </label>
                  {/* Thay đổi input type text -> number cho khớp DB */}
                  <input
                    type="number"
                    name="duration_months"
                    value={formData.duration_months}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả (Ngắn)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2"
                  rows={3}
                ></textarea>
              </div>

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

      {/* --- MODAL XÁC NHẬN XÓA (Giữ nguyên) --- */}
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
              Hành động này sẽ xóa dữ liệu khỏi Database.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
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
