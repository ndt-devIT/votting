const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

// === CÁC ROUTE CỤ THỂ (PHẢI LÊN TRÊN) ===

// Lấy các hạng mục CỦA TÔI (của admin đã đăng nhập)
router.get(
  "/mycategories",
  authMiddleware, // <-- Cần xác thực
  categoryController.getMyCategories
);

// === CÁC ROUTE CHUNG (CÔNG KHAI) ===

// Lấy TẤT CẢ hạng mục (công khai)
router.get("/", categoryController.getCategories);

// Lấy 1 hạng mục (công khai)
// :id phải nằm SAU /my-categories
router.get("/:id", categoryController.getCategoryById);

// === CÁC ROUTE HÀNH ĐỘNG (CẦN XÁC THỰC) ===

// Tạo hạng mục mới
router.post("/", authMiddleware, categoryController.createCategory);

// Cập nhật hạng mục
router.put("/:id", authMiddleware, categoryController.updateCategory);

// Xóa hạng mục
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

module.exports = router;
