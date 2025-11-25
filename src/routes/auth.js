const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/NguoiDung");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- Đăng ký & Đăng nhập thông thường ---
const authController = require("../controllers/authController");
router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);

// --- Google Login (Client-side popup) ---
router.post("/google-login", async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ message: "Thiếu id_token" });

    // Xác thực token từ Google
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload; // sub = googleId

    if (!email) {
      return res
        .status(400)
        .json({ message: "Không lấy được email từ Google" });
    }

    // ✅ Tìm hoặc tạo user (nếu chưa có)
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        hoTen: name,
        email,
        googleId: sub,
        role: "user",
      });
      await user.save();
    } else {
      // Nếu đã có, cập nhật thông tin mới (nếu cần)
      let updated = false;
      if (!user.googleId) {
        user.googleId = sub;
        updated = true;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
        updated = true;
      }
      if (updated) await user.save();
    }

    // 🔑 Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Đăng nhập Google thành công",
      user,
      token,
    });
  } catch (err) {
    console.error("❌ Lỗi Google login:", err);
    res
      .status(500)
      .json({ success: false, message: "Xác thực Google thất bại" });
  }
});

module.exports = router;
