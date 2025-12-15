"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  X,
} from "lucide-react";

export default function SupportPage() {
  // State quản lý hiển thị Modal xác nhận và Thông báo thành công
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // State quản lý dữ liệu form (để sau này gửi API)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
    content: "",
  });

  // Xử lý khi người dùng nhập liệu
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Bước 1: Bấm nút Gửi -> Hiện Modal xác nhận
  const handleInitialSubmit = (e: any) => {
    e.preventDefault();
    // (Có thể thêm validate form ở đây nếu cần)
    setShowConfirmModal(true);
  };

  // Bước 2: Bấm "Xác nhận" trong Modal -> Xử lý gửi và hiện Success
  const handleConfirmSend = () => {
    setShowConfirmModal(false); // Tắt modal

    // Giả lập gửi API thành công...
    setTimeout(() => {
      setShowSuccessToast(true); // Hiện thông báo thành công

      // Tự động tắt thông báo sau 3 giây và reset form
      setTimeout(() => {
        setShowSuccessToast(false);
        setFormData({ name: "", email: "", issue: "", content: "" });
      }, 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* --- BANNER HEADER (Giống ảnh thiết kế) --- */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 py-12 mb-10 text-center text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Chúng tôi có thể giúp gì cho bạn?
        </h1>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* --- CỘT TRÁI: KÊNH HỖ TRỢ NHANH --- */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Kênh hỗ trợ nhanh
              </h2>

              <div className="space-y-6">
                {/* Hotline */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">
                      Hotline (8h-17h30):
                    </p>
                    <a
                      href="tel:0788423567"
                      className="text-lg font-bold text-blue-600 hover:underline"
                    >
                      0788423567
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-primary shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Email hỗ trợ:</p>
                    <a
                      href="mailto:shareaccount@gmail.com"
                      className="font-bold text-gray-900 hover:text-primary transition-colors"
                    >
                      shareaccount@gmail.com
                    </a>
                  </div>
                </div>

                {/* Chat */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-primary shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">
                      Chat trực tuyến:
                    </p>
                    <a
                      href="#"
                      className="font-bold text-gray-900 hover:text-primary transition-colors"
                    >
                      Chat với CSKH qua Fanpage
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-4"></div>

                {/* Thời gian làm việc */}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>
                    Thời gian làm việc:
                    <br />
                    Thứ 2 - Thứ 7: 8:00 - 17:30
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: FORM GỬI YÊU CẦU --- */}
          <div className="lg:w-2/3">
            <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Gửi yêu cầu hỗ trợ
              </h2>
              <p className="text-gray-500 mb-8 text-sm">
                Điền thông tin chi tiết bên dưới, đội ngũ kỹ thuật sẽ phản hồi
                bạn trong thời gian sớm nhất.
              </p>

              <form onSubmit={handleInitialSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Họ và tên */}
                  <div className="space-y-2">
                    <label className="font-bold text-gray-900 text-sm">
                      Họ và tên
                    </label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Nhập họ tên của bạn"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="font-bold text-gray-900 text-sm">
                      Email liên hệ
                    </label>
                    <input
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="Nhập email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Vấn đề cần hỗ trợ */}
                <div className="space-y-2">
                  <label className="font-bold text-gray-900 text-sm">
                    Vấn đề cần hỗ trợ
                  </label>
                  <div className="relative">
                    <select
                      name="issue"
                      value={formData.issue}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Chọn vấn đề...</option>
                      <option value="tech">Lỗi kỹ thuật / Đăng nhập</option>
                      <option value="billing">Thanh toán / Gia hạn</option>
                      <option value="product">Tư vấn gói dịch vụ</option>
                      <option value="other">Khác</option>
                    </select>
                    {/* Mũi tên custom cho select đẹp hơn */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1.5L6 6.5L11 1.5"
                          stroke="#6B7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Nội dung chi tiết */}
                <div className="space-y-2">
                  <label className="font-bold text-gray-900 text-sm">
                    Nội dung chi tiết
                  </label>
                  <textarea
                    required
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* Button Submit */}
                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  <Send size={18} />
                  GỬI YÊU CẦU
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL XÁC NHẬN (Popup) --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center transform scale-100 animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Yêu cầu hỗ trợ
            </h3>
            <p className="text-gray-500 mb-8">Xác nhận gửi yêu cầu hỗ trợ?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-2 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSend}
                className="flex-1 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- THÔNG BÁO THÀNH CÔNG (Toast) --- */}
      {showSuccessToast && (
        <div className="fixed bottom-10 right-10 z-[100] bg-white border-l-4 border-green-500 shadow-2xl rounded-lg p-4 flex items-center gap-4 animate-in slide-in-from-right duration-300">
          <div className="bg-green-100 p-2 rounded-full text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Gửi thành công!</h4>
            <p className="text-sm text-gray-500">
              Chúng tôi sẽ liên hệ lại sớm nhất.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
