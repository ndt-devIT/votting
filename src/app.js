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

// --- BẮT ĐẦU SỬA LỖI ---

// 1. Đặt CORS LÊN ĐẦU TIÊN
// Sửa "origin: '*'" thành "origin: 'http://localhost:5173'"
app.use(
  cors({
    origin: "http://localhost:5173", // <-- Sửa ở đây
    credentials: true,
  })
);

// 2. Các middleware khác
app.use(express.json());
app.use(rateLimit);

// 3. Session (Dùng cho Passport/Google)
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "none",
    },
  })
);

// --- KẾT THÚC SỬA LỖI ---

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware kết nối DB
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Database connection failed", error: error.message });
  }
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contest", require("./routes/contest"));
app.use("/api/category", require("./routes/category"));
app.use("/api/candidate", require("./routes/candidate"));
app.use("/api/vote", require("./routes/vote"));
app.use("/api/nguoidung", require("./routes/nguoiDungRoutes"));

// (Các route còn lại giữ nguyên...)
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

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Bạn đã xác thực thành công", user: req.user });
});

// Error handler cuối cùng
app.use(errorHandler);

module.exports = app;
