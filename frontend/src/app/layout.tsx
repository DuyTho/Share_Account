import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Import Footer
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Share Account - Youtube Premium Family",
  description: "Dịch vụ chia sẻ tài khoản Youtube Premium giá rẻ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          {/* Phần nội dung chính của các trang sẽ nằm ở đây */}
          <div className="flex-1">{children}</div>

          {/* 2. Đặt Footer ở đây, nó sẽ luôn nằm dưới cùng */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
