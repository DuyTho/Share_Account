import AdminLayout from "@/components/admin/AdminLayout";
import {
  TrendingUp,
  ShoppingBag,
  UserPlus,
  Package,
  DollarSign,
} from "lucide-react";

// Component Card Thống kê (Giúp code gọn hơn)
const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div
    className={`bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between ${color}`}
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center bg-opacity-20`}
      >
        <Icon size={24} />
      </div>
    </div>

    <div className="flex flex-col">
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {trend && (
        <div className="flex items-center text-sm font-medium">
          <TrendingUp size={16} className="mr-1" />
          <span>{trend} tháng này</span>
        </div>
      )}
    </div>
  </div>
);

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Tổng quan</h1>
      <p className="text-gray-500 mb-8">Xem toàn bộ hoạt động và doanh thu</p>

      {/* --- HÀNG 1: THẺ THỐNG KÊ (4 cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Tổng doanh thu"
          value="45.000.000đ"
          icon={DollarSign}
          color="text-primary"
          trend="+12%"
        />
        <StatCard
          title="Tổng đơn hàng"
          value="320 đơn"
          icon={ShoppingBag}
          color="text-yellow-600"
          trend="-3%"
        />
        <StatCard
          title="Người dùng đăng ký"
          value="1000 người"
          icon={UserPlus}
          color="text-purple-600"
          trend="+5%"
        />
        <StatCard
          title="Gói đang hoạt động"
          value="28 gói"
          icon={Package}
          color="text-success"
          trend="Đang bán"
        />
      </div>

      {/* --- HÀNG 2: BIỂU ĐỒ (Giữ chỗ) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 lg:col-span-2 min-h-[300px]">
          <h3 className="text-lg font-bold mb-4">Doanh thu theo tháng</h3>
          {/* Chart placeholder */}
          <div className="h-[85%] w-full bg-gray-50 flex items-center justify-center text-gray-400">
            [Biểu đồ sẽ hiển thị tại đây]
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 min-h-[300px]">
          <h3 className="text-lg font-bold mb-4">Tỷ lệ gói được mua</h3>
          {/* Chart placeholder */}
          <div className="h-[85%] w-full bg-gray-50 flex items-center justify-center text-gray-400">
            [Biểu đồ tròn sẽ hiển thị tại đây]
          </div>
        </div>
      </div>

      {/* --- HÀNG 3: BẢNG ĐƠN HÀNG GẦN ĐÂY --- */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Đơn hàng gần đây
        </h3>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-xs font-semibold uppercase text-gray-500 bg-gray-50">
              <th className="px-6 py-3 text-left tracking-wider">Mã đơn</th>
              <th className="px-6 py-3 text-left tracking-wider">Khách hàng</th>
              <th className="px-6 py-3 text-left tracking-wider">
                Gói dịch vụ
              </th>
              <th className="px-6 py-3 text-left tracking-wider">Tổng tiền</th>
              <th className="px-6 py-3 text-center tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left tracking-wider">Ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Row 1 */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                #OD-001
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Nguyễn Thị Hồng Nhung
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                Canva Pro
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                200.000đ
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-success/10 text-success border border-success/30">
                  Hoàn thành
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                16/11/2025
              </td>
            </tr>
            {/* Row 2 */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                #OD-002
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Trần Kim Toàn
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                ChatGPT Pro
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                300.000đ
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/30">
                  Đang xử lý
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                16/11/2025
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-center mt-6">
          <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-md">
            Xem toàn bộ đơn hàng
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
