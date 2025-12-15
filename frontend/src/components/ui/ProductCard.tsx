import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: string;
  description: string;
  onAddToCart?: () => void; // Đổi tên hàm cho đúng ý nghĩa
}

export default function ProductCard({
  title,
  price,
  description,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
      {/* Tiêu đề gói */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>

      {/* Giá tiền */}
      <div className="text-xl font-bold text-primary mb-4">Giá: {price}</div>

      {/* Mô tả ngắn */}
      <p className="text-gray-500 mb-8 font-medium">{description}</p>

      {/* Nút Thêm vào giỏ hàng */}
      <button
        onClick={onAddToCart}
        className="w-full bg-primary text-white py-3 px-6 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-blue-200 shadow-lg flex items-center justify-center gap-2"
      >
        <ShoppingCart size={20} />
        <span>Thêm vào giỏ hàng</span>
      </button>
    </div>
  );
}
