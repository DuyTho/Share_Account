"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error"; // Chọn kiểu thông báo
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  // Tự động tắt sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Cấu hình màu sắc dựa trên type
  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-white" : "bg-white";
  const borderColor = isSuccess ? "border-[#28A745]" : "border-[#DC3545]";
  const iconBg = isSuccess
    ? "bg-green-100 text-[#28A745]"
    : "bg-red-100 text-[#DC3545]";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;
  const title = isSuccess ? "Thành công!" : "Đã có lỗi!";

  return (
    <div
      className={`fixed bottom-10 right-10 z-[100] ${bgColor} border-l-4 ${borderColor} shadow-2xl rounded-lg p-4 flex items-center gap-4 animate-in slide-in-from-right duration-300 max-w-sm`}
    >
      <div className={`${iconBg} p-2 rounded-full`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-sm text-[#757575]">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
}
