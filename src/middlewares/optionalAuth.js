// middlewares/optionalAuth.js
const jwt = require("jsonwebtoken");
const NguoiDung = require("../models/NguoiDung");
const dotenv = require("dotenv");

dotenv.config();

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra xem token có tồn tại không
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await NguoiDung.findById(decoded.id).select("-password");

      if (user) {
        req.user = user; // Gán user vào req nếu tìm thấy
      }
    } catch (err) {
      
    }
  }
  next();
};

module.exports = optionalAuth;
