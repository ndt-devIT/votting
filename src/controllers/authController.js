// controllers/authController.js

const NguoiDung = require("../models/NguoiDung");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendEmail = require("../utils/sendEmail");

dotenv.config();

// (generateToken - giữ nguyên)
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// --- ✏️ HÀM REGISTER (ĐÃ SỬA LỖI BẢO MẬT) ---
exports.register = async (req, res, next) => {
  try {
    const { hoTen, email, password } = req.body;
    if (!hoTen || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    } // 1. Tìm người dùng

    let user = await NguoiDung.findOne({ email }); // 2. Nếu user tồn tại VÀ đã xác thực -> Báo lỗi

    if (user && user.isVerified) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    } // 3. Tạo OTP

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút // 4. Cập nhật hoặc tạo mới người dùng

    if (user) {
      // Nếu user tồn tại nhưng chưa 'isVerified' (có thể họ yêu cầu OTP mới)
      user.hoTen = hoTen;
      user.password = password; // Gán mật khẩu thuần, hook 'save' sẽ hash
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.isVerified = false;
    } else {
      // Nếu là người dùng mới hoàn toàn
      user = new NguoiDung({
        hoTen,
        email,
        password, // Gán mật khẩu thuần, hook 'save' sẽ hash
        otp,
        otpExpires,
        isVerified: false,
      });
    } // 5. GỌI .save() ĐỂ KÍCH HOẠT HOOK MÃ HÓA
    await user.save(); // <--- ĐÂY LÀ THAY ĐỔI QUAN TRỌNG NHẤT // 6. Gửi email chứa OTP

    const emailHtml = `
      <h3>Xác thực tài khoản</h3>
      <p>Cảm ơn bạn đã đăng ký. Vui lòng sử dụng mã OTP này để hoàn tất:</p>
      <h1 style="color: blue;">${otp}</h1>
      <p>Mã OTP sẽ hết hạn sau 10 phút.</p>
    `;
    await sendEmail(user.email, "Mã OTP xác thực tài khoản", emailHtml); // 7. Trả về thông báo thành công

    res
      .status(200)
      .json({
        message: "OTP đã được gửi đến email của bạn. Vui lòng xác thực.",
      });
  } catch (err) {
    next(err);
  }
};

// (Các hàm verifyOtp và login giữ nguyên...)

// --- ⭐ HÀM MỚI: VERIFY OTP ---
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body; // 1. Tìm người dùng

    const user = await NguoiDung.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    } // 2. Kiểm tra OTP

    if (user.isVerified) {
      return res.status(400).json({ message: "Tài khoản đã được xác thực" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Mã OTP đã hết hạn" });
    } // 3. Xác thực thành công -> Cập nhật CSDL

    user.isVerified = true;
    user.status = 1; // Đảm bảo tài khoản được kích hoạt
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save(); // Sẽ không hash lại pass vì 'isModified' là false // 4. Tạo token và trả về cho client (đăng nhập)

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

// --- ✏️ HÀM LOGIN (ĐÃ SỬA LỖI) ---
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ⭐ CHỈ TRUY VẤN MỘT LẦN: Lấy user VÀ password ngay từ đầu
    const user = await NguoiDung.findOne({ email }).select('+password');

    // 1. Kiểm tra user tồn tại
    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy người dùng" });
    }

    // 2. Kiểm tra đã xác thực
    if (!user.isVerified) {
      return res
        .status(403)
        .json({
          message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email.",
        });
    }

    // 3. Kiểm tra tài khoản bị vô hiệu hóa
    if (user.status === 0) {
      return res
        .status(403)
        .json({
          message:
            "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
        });
    }

    // 4. So sánh mật khẩu (Vì đã .select('+password') nên user.comparePassword sẽ hoạt động)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai thông tin đăng nhập" });
    }

    // 5. Tạo token
    const token = generateToken(user);
    res.json({ user, token });

  } catch (err) {
    next(err);
  }
};
