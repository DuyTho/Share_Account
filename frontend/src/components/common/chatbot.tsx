"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Product {
  product_id: number;
  name: string;
  price: string | number;
}

interface ChatbotProps {
  products: Product[]; // Nhận danh sách sản phẩm từ trang chủ để tư vấn giá
}

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

export default function Chatbot({ products }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! ShareAccount có thể giúp gì cho bạn? (Hỏi về giá, quy trình, bảo hành...)",
      sender: "bot",
    },
  ]);

  // Tự động cuộn xuống tin nhắn mới nhất
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // --- LOGIC TRẢ LỜI TỰ ĐỘNG (RULE-BASED) ---
  const generateResponse = (text: string) => {
    const lowerText = text.toLowerCase();

    // 1. Hỏi về giá / sản phẩm
    if (
      lowerText.includes("giá") ||
      lowerText.includes("sản phẩm") ||
      lowerText.includes("gói") ||
      lowerText.includes("bao nhiêu")
    ) {
      if (products.length === 0)
        return "Hiện tại mình đang cập nhật bảng giá. Bạn quay lại sau nhé!";

      const priceList = products
        .map(
          (p) =>
            `- ${p.name}: ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(p.price))}`
        )
        .join("\n");
      return `Dạ, dưới đây là bảng giá các gói Youtube Premium bên mình:\n${priceList}\n\nBạn muốn mua gói nào ạ?`;
    }

    // 2. Hỏi về thanh toán
    if (
      lowerText.includes("thanh toán") ||
      lowerText.includes("mua") ||
      lowerText.includes("bank")
    ) {
      return "Quy trình thanh toán rất đơn giản ạ:\n1. Bạn chọn gói và thêm vào giỏ hàng.\n2. Tiến hành Checkout.\n3. Chuyển khoản theo mã QR.\n4. Hệ thống sẽ tự động gửi tài khoản qua Email sau 5 phút.";
    }

    // 3. Hỏi về bảo hành / uy tín
    if (
      lowerText.includes("bảo hành") ||
      lowerText.includes("lỗi") ||
      lowerText.includes("uy tín")
    ) {
      return "Bên mình cam kết bảo hành trọn đời gói dịch vụ 1 đổi 1. Nếu có lỗi, bạn cứ nhắn tin, bên mình sẽ fix hoặc đổi tài khoản mới ngay lập tức ạ!";
    }

    // 4. Hỏi về cách dùng
    if (
      lowerText.includes("dùng") ||
      lowerText.includes("sử dụng") ||
      lowerText.includes("như thế nào")
    ) {
      return "Dạ đây là gói nâng cấp chính chủ. Bạn chỉ cần cung cấp Email, bên mình sẽ gửi lời mời Family. Bạn chấp nhận lời mời là dùng được Premium ngay ạ.";
    }

    // 5. Câu chào
    if (
      lowerText.includes("chào") ||
      lowerText.includes("hello") ||
      lowerText.includes("hi")
    ) {
      return "Chào bạn! Mình là trợ lý ảo của ShareAccount. Bạn cần tư vấn gì không ạ?";
    }

    // Default
    return "Xin lỗi, mình chưa hiểu ý bạn lắm. Bạn có thể hỏi cụ thể hơn về 'giá', 'bảo hành' hoặc liên hệ hotline 0912345678 để được người thật hỗ trợ nhé!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Thêm tin nhắn người dùng
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 2. Bot trả lời (Giả lập delay)
    setTimeout(() => {
      const botResponseText = generateResponse(userMsg.text);
      const botMsg: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Nút mở chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-[#0D6EFD] text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 animate-in fade-in zoom-in duration-300"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 max-h-[500px]">
          {/* Header */}
          <div className="bg-[#0D6EFD] p-4 text-white flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Trợ lý ShareAccount</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                Thường trả lời ngay
              </p>
            </div>
          </div>

          {/* Body Chat */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 h-80 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-gray-200 text-gray-600"
                      : "bg-blue-100 text-[#0D6EFD]"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 text-sm rounded-2xl whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-[#0D6EFD] text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#0D6EFD] focus:ring-1 focus:ring-[#0D6EFD] text-gray-700"
            />
            <button
              onClick={handleSend}
              className="bg-[#0D6EFD] text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
