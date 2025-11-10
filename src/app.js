const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const rateLimit = require('./middlewares/rateLimit');
const { errorHandler } = require('./middlewares/errorMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require("cors");
const connectDB = require("./config/db");
// FIX: Using require instead of import
const mql = require('@microlink/mql');

const app = express();
// Middleware JSON
app.use(express.json());

// Rate limit toàn bộ API
app.use(rateLimit);

// Session middleware (nếu dùng session)
app.use(cors({ origin: "*", credentials: true }));

app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "none", // cần thiết khi khác domain
    },
  })
);

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// --- THÊM VÀO ĐÂY ---
// Middleware đảm bảo DB luôn sẵn sàng trước khi xử lý route
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    // Trả về lỗi 500 nếu không kết nối được DB
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contest', require('./routes/contest'));
app.use('/api/category', require('./routes/category'));
app.use('/api/candidate', require('./routes/candidate'));
app.use('/api/vote', require('./routes/vote'));
app.use("/api/nguoidung", require("./routes/nguoiDungRoutes"));

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

// Example route bảo vệ bằng JWT
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Bạn đã xác thực thành công', user: req.user });
});

// Error handler cuối cùng
app.use(errorHandler);

module.exports = app;
