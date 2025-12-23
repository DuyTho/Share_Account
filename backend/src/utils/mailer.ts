import nodemailer from 'nodemailer';

// Cấu hình transporter (người đưa thư)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'official.shareacc@gmail.com', // Điền email của bạn
    pass: 'pmmf qnjg gpbb vent' // Điền App Password (không phải pass login)
  }
});

export const sendPaymentSuccessEmail = async (
  toEmail: string, 
  userName: string, 
  productName: string, 
  orderId: number
) => {
  const mailOptions = {
    from: '"ShareAccount Support" <no-reply@shareaccount.vn>',
    to: toEmail,
    subject: `[ShareAccount] Thanh toán thành công gói dịch vụ ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        
        <div style="background-color: #0D6EFD; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">Thanh toán thành công!</h2>
        </div>

        <div style="padding: 20px;">
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Hệ thống đã nhận được thanh toán cho gói dịch vụ: <strong>${productName}</strong>.</p>
          <p style="margin-bottom: 5px;">Hệ thống đang tự động xử lý yêu cầu của bạn.</p>
          <ul style="padding-left: 20px; color: #333;">
            <li>Thời gian xử lý: <strong>5 - 10 phút</strong>.</li>
            <li>Bạn sẽ nhận được một email tiêu đề: <strong>"... muốn bạn tham gia nhóm gia đình của họ"</strong> từ Google.</li>
            <li>Vui lòng kiểm tra cả hộp thư <strong>Spam/Quảng cáo</strong>.</li>
          </ul>
          <p>Sau khi nhận được email từ Google, bạn chỉ cần bấm <strong>"Chấp nhận lời mời"</strong> là hoàn tất.</p>
          
          <p>Nếu sau 30 phút chưa nhận được lời mời, vui lòng trả lời email này để được hỗ trợ.</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>Cảm ơn bạn đã tin tưởng ShareAccount!</p>
          <p>Email này được gửi tự động, vui lòng không trả lời nếu không cần hỗ trợ.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Đã gửi mail xác nhận cho: ${toEmail}`);
  } catch (error) {
    console.error("❌ Lỗi gửi mail:", error);
    // Không throw error để tránh làm crash luồng thanh toán chính
  }
};