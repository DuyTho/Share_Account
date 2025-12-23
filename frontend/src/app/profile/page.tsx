"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  X,
  Edit2,
  Camera,
  Loader2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái: Xem hay Sửa
  const [saving, setSaving] = useState(false);

  // State dữ liệu User
  const [userData, setUserData] = useState({
    user_id: 0,
    name: "",
    email: "",
    phone: "",
    created_at: "",
    role: "",
  });

  // State tạm để lưu dữ liệu khi đang gõ (chưa lưu)
  const [tempData, setTempData] = useState({ ...userData });

  useEffect(() => {
    // 1. Lấy ID từ localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const localUser = JSON.parse(userStr);

    // 2. Gọi API lấy dữ liệu mới nhất từ DB (để tránh localStorage bị cũ)
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${localUser.user_id}`);
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          setTempData(data); // Đồng bộ dữ liệu tạm
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Xử lý bật chế độ sửa
  const handleEdit = () => {
    setIsEditing(true);
    setTempData(userData); // Reset dữ liệu tạm về giống dữ liệu thật
  };

  // Xử lý hủy sửa
  const handleCancel = () => {
    setIsEditing(false);
    setTempData(userData); // Hoàn tác thay đổi
  };

  // Xử lý Lưu thay đổi
  const handleSave = async () => {
    if (!tempData.name.trim()) return alert("Tên không được để trống");

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userData.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tempData.name,
          phone: tempData.phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Cập nhật State
        setUserData({ ...userData, ...tempData });
        setIsEditing(false);

        // 2. Cập nhật LocalStorage (Quan trọng để Navbar hiển thị đúng tên mới)
        const oldStorage = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...oldStorage, name: tempData.name })
        );

        // 3. Bắn event để Navbar tự reload tên
        window.dispatchEvent(new Event("storage"));

        alert("Cập nhật hồ sơ thành công!");
      } else {
        alert(data.error || "Lỗi cập nhật");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Hồ sơ cá nhân
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* --- CỘT TRÁI: AVATAR --- */}
            <div className="col-span-1">
              <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 text-center sticky top-24">
                <div className="relative w-32 h-32 mx-auto mb-4 group">
                  <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-primary text-4xl font-bold border-4 border-white shadow-sm overflow-hidden">
                    {/* Nếu có ảnh thì dùng thẻ img, chưa có thì dùng chữ cái đầu */}
                    {userData.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Nút đổi ảnh (Giả lập UI) */}
                  <button className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full hover:bg-primary transition-colors shadow-md">
                    <Camera size={18} />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  {userData.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{userData.email}</p>

                <div className="inline-block bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {userData.role || "Customer"}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 text-left space-y-3">
                  <div className="text-xs text-gray-500 font-bold uppercase">
                    Ngày tham gia
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar size={16} />
                    {new Date(userData.created_at).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>

            {/* --- CỘT PHẢI: FORM THÔNG TIN --- */}
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900">
                    Thông tin chi tiết
                  </h3>

                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 text-primary hover:bg-blue-50 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                    >
                      <Edit2 size={16} /> Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                        disabled={saving}
                      >
                        <X size={16} /> Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-md disabled:opacity-70"
                      >
                        {saving ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Save size={16} />
                        )}
                        Lưu
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Họ và tên */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <User size={16} className="text-primary" /> Họ và tên
                    </label>
                    <input
                      type="text"
                      value={isEditing ? tempData.name : userData.name}
                      onChange={(e) =>
                        setTempData({ ...tempData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                        isEditing
                          ? "border-primary bg-white focus:ring-2 focus:ring-blue-100"
                          : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  {/* Email (Read only) */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Mail size={16} className="text-primary" /> Email
                      <span className="text-xs font-normal text-gray-400">
                        (Không thể thay đổi)
                      </span>
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Phone size={16} className="text-primary" /> Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={
                        isEditing
                          ? tempData.phone || ""
                          : userData.phone || "Chưa cập nhật"
                      }
                      onChange={(e) =>
                        setTempData({ ...tempData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Nhập số điện thoại..."
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                        isEditing
                          ? "border-primary bg-white focus:ring-2 focus:ring-blue-100"
                          : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
