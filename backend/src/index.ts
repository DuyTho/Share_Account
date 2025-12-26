import express from "express";
import cors from "cors";

// Import các file routes vừa tạo
import userRoutes from "./routes/user.route";
import productRoutes from "./routes/product.route";
import orderRoutes from "./routes/order.route";
import supportRoutes from "./routes/support.route";
import cartRoutes from "./routes/cart.route";
import subscriptionRoutes from "./routes/subscription.route";
import dashboardRoutes from "./routes/dashboard.route";
// Cron jobs
import "./cron/reminderCron";

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// --- ĐĂNG KÝ ROUTES ---
// Lúc này URL sẽ được ghép: /users + / = /users
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/supports", supportRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/cart", cartRoutes);

// Trang chủ test
app.get("/", (req, res) => {
  res.send("Backend Share Account (Refactored) is ready!");
});

// Khởi chạy
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
