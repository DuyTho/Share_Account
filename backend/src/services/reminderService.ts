import prisma from '../prisma'
import { sendExpiryReminder } from '../utils/mailer'

export const sendExpiryReminders = async () => {
  try {
    const today = new Date()
    const target = new Date(today)
    target.setDate(today.getDate() + 7)

    // Start and end of target day (UTC-safe handling)
    const startOfDay = new Date(target)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(target)
    endOfDay.setHours(23, 59, 59, 999)

    const subs = await prisma.subscriptions.findMany({
      where: {
        end_date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: 'active'
      },
      include: {
        Users: true,
        Products: true
      }
    })

    if (!subs || subs.length === 0) {
      console.log('🔔 Không có subscription nào hết hạn sau 7 ngày.')
      return
    }

    for (const s of subs) {
      const email = s.Users?.email
      const name = s.Users?.name ?? 'Khách hàng'
      const productName = s.Products?.name ?? ''

      // Tính ngày còn lại chính xác (phòng trường hợp thời gian khác múi giờ)
      const now = new Date()
      const diffMs = s.end_date.getTime() - now.getTime()
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

      if (email) {
        await sendExpiryReminder(email, name, daysLeft, productName)
      }
    }

    console.log(`🔔 Đã xử lý ${subs.length} thông báo nhắc hạn.`)
  } catch (error) {
    console.error('❌ Lỗi khi gửi reminder:', error)
  }
}
