const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const rateLimit = require("./middlewares/rateLimit");
const { errorHandler } = require("./middlewares/errorMiddleware");
const authMiddleware = require("./middlewares/authMiddleware");
const cors = require("cors");
const connectDB = require("./config/db");
const mql = require("@microlink/mql");

const app = express();

// --- 1. CẤU HÌNH CORS (KHẮC PHỤC LỖI ACCESS-CONTROL-ALLOW-ORIGIN) ---
app.use(
  cors({
    // Cho phép truy cập từ Frontend của bạn
    origin: "https://vote.ndtdev.id.vn",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Chỉ định rõ các phương thức được phép
    credentials: true, // Cho phép gửi cookies (cần thiết cho session/passport)
  })
);

// --- 2. MIDDLEWARES CƠ BẢN ---
app.use(express.json());
app.use(rateLimit);

// --- 3. CẤU HÌNH SESSION (KHẮC PHỤC LỖI COOKIE/CORS KHI DÙNG HTTPS) ---
// Đã thêm logic kiểm tra môi trường (production) để đặt secure: true và sameSite: 'none'
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret-fallback-key", // NÊN DÙNG BIẾN MÔI TRƯỜNG
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Đặt true khi chạy trên HTTPS (Production)
      secure: process.env.NODE_ENV === "production" ? true : false,
      // Đặt 'none' cho yêu cầu cross-site (Frontend/Backend khác domain)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    },
  })
);

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// --- 4. LOẠI BỎ MIDDLEWARE KẾT NỐI DB TẠI ĐÂY ---
// Đã loại bỏ middleware kết nối DB cho mỗi request để tránh quá tải
// và lỗi 502/Timeout trong môi trường Serverless (Netlify Functions).
// Bạn cần đảm bảo gọi connectDB() MỘT LẦN ở file khởi động server (ví dụ: index.js hoặc server.js)
/* app.use(async (req, res, next) => {
    try {
        await connectDB(); // ĐÃ BỊ LOẠI BỎ!
        next();
    } catch (error) {
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
}); 
*/

// --- 5. ROUTES ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contest", require("./routes/contest"));
app.use("/api/category", require("./routes/category"));
app.use("/api/candidate", require("./routes/candidate"));
app.use("/api/vote", require("./routes/vote"));
app.use("/api/nguoidung", require("./routes/nguoiDungRoutes"));

// Microlink API Route (Giữ nguyên)
app.get("/api/microlink", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });
  try {
    const { data } = await mql(url, { pdf: true, meta: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch Microlink data" });
  }
});

// Protected Route (Giữ nguyên)
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Bạn đã xác thực thành công", user: req.user });
});

// Error handler cuối cùng
app.use(errorHandler);

module.exports = app;
