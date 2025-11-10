const express = require("express");
const router = express.Router();
const nguoiDungController = require("../controllers/nguoiDungController");

// Lấy danh sách người dùng (mặc định chỉ active)
router.get('/', nguoiDungController.getAllNguoiDung);

// Cập nhật status (bật/tắt tài khoản)
router.patch('/:id/status', nguoiDungController.updateStatus);

module.exports = router;
