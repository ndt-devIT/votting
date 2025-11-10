const NguoiDung = require('../models/NguoiDung');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Tạo JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
};

// Đăng ký
exports.register = async (req, res, next) => {
  try {
    const { hoTen, email, password } = req.body;
    if (!hoTen || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await NguoiDung.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await NguoiDung.create({ hoTen, email, password });
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

// Đăng nhập
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await NguoiDung.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Không tìm thấy người dùng' });
    }

    // 🔒 Kiểm tra tài khoản bị vô hiệu hóa
    if (user.status === 0) {
      return res.status(403).json({ message: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.' });
    }

    // So sánh mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Hãy sử dụng phương thức đăng nhập khác!' });
    }

    // Sinh token
    const token = generateToken(user);

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

