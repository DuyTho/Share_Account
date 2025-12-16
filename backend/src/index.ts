import express from 'express'
import cors from 'cors'

// Import các file routes vừa tạo
import userRoutes from './routes/user.route'
import productRoutes from './routes/product.route'
import orderRoutes from './routes/order.route'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// --- ĐĂNG KÝ ROUTES ---
// Lúc này URL sẽ được ghép: /users + / = /users
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

// Trang chủ test
app.get('/', (req, res) => {
  res.send('Backend Share Account (Refactored) is ready!')
})

// Khởi chạy
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})