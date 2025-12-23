"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Trash2, Minus, Plus, ArrowRight, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Cấu hình URL
const API_BASE_URL = "http://localhost:8080";

// Interface khớp với dữ liệu từ Backend trả về
interface CartItem {
  cart_item_id: number; // ID của item trong giỏ (để xóa)
  product_id: number;
  quantity: number;
  Products: {
    // Join bảng Products
    name: string;
    price: string | number;
    duration_months: number;
    description: string;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  // 1. Kiểm tra đăng nhập và Lấy dữ liệu giỏ hàng
  useEffect(() => {
    // Check localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Vui lòng đăng nhập để xem giỏ hàng!");
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    setUserId(user.user_id);
    fetchCart(user.user_id);
  }, []);

  // Hàm gọi API lấy giỏ hàng
  const fetchCart = async (uId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/cart/${uId}`);
      if (!res.ok) throw new Error("Lỗi tải giỏ hàng");
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm format tiền
  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  // Tính tổng tiền
  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.Products.price) * item.quantity,
    0
  );

  // Xử lý XÓA sản phẩm (Gọi API)
  const removeItem = async (cartItemId: number) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Cập nhật lại UI bằng cách lọc bỏ item vừa xóa (đỡ phải gọi lại API fetchCart)
        setCartItems((prev) =>
          prev.filter((item) => item.cart_item_id !== cartItemId)
        );
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  // Hàm xử lý CẬP NHẬT SỐ LƯỢNG (Gọi API PUT)
  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Không cho giảm dưới 1

    // 1. Cập nhật UI ngay lập tức cho mượt (Optimistic UI)
    setCartItems((prev) =>
      prev.map((item) =>
        item.cart_item_id === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      // 2. Gọi API cập nhật Backend
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_item_id: cartItemId,
          quantity: newQuantity,
        }),
      });

      if (res.ok) {
        // 3. Bắn tín hiệu để Navbar cập nhật số lượng badge
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        // Nếu lỗi thì revert UI lại (tùy chọn)
        console.error("Lỗi update quantity backend");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20 relative">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          Giỏ hàng của bạn
          {loading && (
            <RefreshCcw className="animate-spin text-gray-400" size={24} />
          )}
        </h1>

        {!loading && cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="bg-white p-4 sm:p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-blue-200 transition-colors"
                >
                  {/* Info Sản phẩm */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
                      {/* Ảnh Demo */}
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
                        alt="Product"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.Products.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Thời hạn: {item.Products.duration_months} tháng
                      </p>
                    </div>
                  </div>

                  {/* Bộ điều khiển & Giá */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                    {/* Bộ điều khiển số lượng */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.cart_item_id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-200"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-10 text-center font-medium text-gray-900 select-none">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.cart_item_id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 text-gray-600 transition-colors border-l border-gray-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Giá tiền */}
                    <div className="text-right min-w-[120px]">
                      <div className="font-bold text-primary text-lg">
                        {formatCurrency(
                          Number(item.Products.price) * item.quantity
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatCurrency(item.Products.price)} / gói
                      </div>
                    </div>

                    {/* Nút xóa */}
                    <button
                      onClick={() => removeItem(item.cart_item_id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- CỘT PHẢI: TỔNG KẾT --- */}
            <div className="lg:w-[380px]">
              <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Thông tin thanh toán
                </h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Giảm giá</span>
                    <span className="text-gray-400">0đ</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <Link href="/checkout" className="block w-full">
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                    <span>Thanh toán ngay</span>
                    <ArrowRight size={20} />
                  </button>
                </Link>

                <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} /> Bảo mật thanh toán 100%
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Trạng thái Trống hoặc Loading
          <div className="text-center py-20 bg-white rounded-[20px] shadow-sm border border-gray-100">
            {loading ? (
              <p className="text-gray-500">Đang tải giỏ hàng...</p>
            ) : (
              <>
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <ShoppingCart size={32} />
                </div>
                <p className="text-gray-500 mb-6 text-lg">
                  Giỏ hàng của bạn đang trống
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
                >
                  Quay lại mua sắm
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Icon phụ trợ
function ShoppingCart({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
function ShieldCheck({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
