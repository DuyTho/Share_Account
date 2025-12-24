"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Lock,
  Download,
} from "lucide-react";

const API_URL = "http://localhost:8080/users";
const ITEMS_PER_PAGE = 5;

type UserData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  activePackage: string; // Tên gói mua gần nhất
};

export default function AdminUserPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // --- 1. FETCH DATA TỪ API ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      // Mapping dữ liệu phức tạp từ Backend sang Frontend
      const formattedUsers = data
        .filter((u: any) => u.role !== "admin")
        .map((u: any) => {
          // Lấy tên gói từ đơn hàng mới nhất (nếu có)
          const latestOrder =
            u.Orders && u.Orders.length > 0 ? u.Orders[0] : null;
          const packageName = latestOrder
            ? latestOrder.Products.name
            : "Chưa đăng ký";

          return {
            id: u.user_id,
            name: u.name,
            email: u.email,
            phone: u.phone || "",
            role: u.role,
            status: u.status || "active",
            activePackage: packageName,
          };
        });

      setUsers(formattedUsers);
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối Backend! Hãy kiểm tra server port 8080.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 2. HÀM XUẤT EXCEL (Dùng exceljs) ---
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách khách hàng");

    // Định nghĩa Header
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Họ và tên", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Số điện thoại", key: "phone", width: 20 },
      { header: "Gói hiện tại", key: "activePackage", width: 25 },
      { header: "Trạng thái", key: "status", width: 15 },
    ];

    // Thêm dữ liệu
    users.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        activePackage: user.activePackage,
        status: user.status === "active" ? "Hoạt động" : "Đã khóa",
      });
    });

    // Style Header đậm
    worksheet.getRow(1).font = { bold: true };

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Danh_sach_khach_hang.xlsx");
  };

  // --- 3. FILTER & PAGINATION ---
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // --- 4. MODAL STATE & FORM DATA ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "", // Chỉ gửi khi tạo mới
    status: "active",
  });

  // --- 5. ACTION HANDLERS ---
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserData) => {
    setIsEditMode(true);
    setCurrentId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "", // Không hiển thị password cũ
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 6. SUBMIT FORM (ADD / EDIT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditMode && currentId) {
        // GỌI API EDIT (PUT)
        const res = await fetch(`${API_URL}/${currentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
          }),
        });
        if (!res.ok) throw new Error("Lỗi cập nhật user");
      } else {
        // GỌI API ADD (POST)
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        });
        if (!res.ok) throw new Error("Lỗi tạo user");
      }

      await fetchUsers(); // Tải lại danh sách
      setIsModalOpen(false);
      alert(isEditMode ? "Cập nhật thành công!" : "Thêm mới thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // --- 7. DELETE HANDLER ---
  const requestDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const res = await fetch(`${API_URL}/${deleteId}`, { method: "DELETE" });
        if (res.ok) {
          await fetchUsers();
          setIsDeleteModalOpen(false);
          setDeleteId(null);
          // Lùi trang nếu trang hiện tại bị xóa hết
          if (paginatedUsers.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          alert(
            "Không thể xóa user này (Có thể do user đang có đơn hàng hoặc lỗi server)."
          );
          setIsDeleteModalOpen(false);
        }
      } catch (error) {
        console.error("Lỗi xóa user:", error);
      }
    }
  };

  return (
    <AdminLayout>
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Quản lý người dùng
          </h1>
          <p className="text-gray-500">Danh sách khách hàng và gói dịch vụ</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200"
          >
            <Download size={20} /> Excel
          </button>
          <button
            onClick={openAddModal}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> Thêm người dùng
          </button>
        </div>
      </div>

      {/* --- FILTER & SEARCH --- */}
      <div className="bg-white p-4 rounded-t-2xl border-b border-gray-100 flex items-center gap-2 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <button
          onClick={fetchUsers}
          className="text-gray-400 hover:text-primary p-2 transition-colors"
          title="Tải lại dữ liệu"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <RefreshCcw size={40} className="animate-spin mb-4 text-primary" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Gói đăng ký
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                            user.activePackage === "Chưa đăng ký"
                              ? "bg-gray-50 text-gray-500 border-gray-200"
                              : "bg-purple-50 text-purple-700 border-purple-100"
                          }`}
                        >
                          {user.activePackage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            user.status === "active"
                              ? "text-green-600 bg-green-50"
                              : "text-red-600 bg-red-50"
                          }`}
                        >
                          {user.status === "active" ? "Hoạt động" : "Khóa"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition-colors"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => requestDelete(user.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Không tìm thấy người dùng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <div className="text-sm text-gray-500">
                Hiển thị {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}{" "}
                trên tổng {filteredUsers.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- MODAL FORM (ADD / EDIT) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Input Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
              </div>

              {/* Input Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              {/* Input Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2"
                    placeholder="0912345678"
                  />
                </div>
              </div>

              {/* Input Password (Chỉ hiện khi Add) */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!isEditMode}
                      minLength={6}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2"
                      placeholder="Ít nhất 6 ký tự"
                    />
                  </div>
                </div>
              )}

              {/* Select Status (Chỉ hiện khi Edit) */}
              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Đã khóa</option>
                  </select>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 shadow-md transition-colors"
                >
                  {isEditMode ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CONFIRM DELETE --- */}
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
              Hành động này sẽ xóa user khỏi Database và không thể hoàn tác.
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
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
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
