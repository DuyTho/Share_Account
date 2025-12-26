import cron from "node-cron";
import { sendExpiryReminders } from "../services/reminderService";

const cronExpr = process.env.REMINDER_CRON || "0 8 * * *"; // mặc định chạy mỗi ngày lúc 08:00

console.log(`⏰ Đăng ký cron reminder với biểu thức: ${cronExpr}`);

// Khi file được import, job sẽ được đăng ký tự động
cron.schedule(cronExpr, async () => {
  console.log("⏰ Cron đang chạy: gửi mail nhắc hạn...");
  try {
    await sendExpiryReminders();
  } catch (err) {
    console.error("❌ Lỗi trong cron reminder:", err);
  }
});

export default cron;
